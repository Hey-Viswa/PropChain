"use client";
import { useState, useEffect, useRef } from "react";
import {
  Shield,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { useOracleAccessStore } from "@/store/useOracleAccessStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 30_000; // 30 seconds

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function OracleAccessModal({
  isOpen,
  onClose,
}: Props) {
  const router = useRouter();
  const {
    attempts,
    lockedUntil,
    setOracleMode,
    incrementAttempts,
    setLocked,
  } = useOracleAccessStore();

  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setCode("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil(
        (lockedUntil - Date.now()) / 1000
      );
      if (remaining <= 0) {
        setCountdown(0);
        clearInterval(interval);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = lockedUntil
    ? Date.now() < lockedUntil
    : false;

  const handleSubmit = async () => {
    if (!code.trim() || isLocked || checking) return;

    setChecking(true);
    setError("");

    try {
      // Send plaintext passphrase over HTTPS — hashing happens server-side.
      // ORACLE_ACCESS_HASH is a server-only env var and is never sent to the client.
      const res = await fetch("/api/oracle/verify-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase: code.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          (data as { error?: string }).error ??
          "Verification failed. Please try again."
        );
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        setCode("");
        return;
      }

      const { valid } = (await res.json()) as { valid: boolean };

      if (valid) {
        setSuccess(true);
        setTimeout(() => {
          setOracleMode(true);
          onClose();
          router.push("/oracle/queue");
        }, 1200);
      } else {
        incrementAttempts();
        const newAttempts = attempts + 1;

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockUntil = Date.now() + LOCKOUT_MS;
          setLocked(lockUntil);
          setCountdown(30);
          setError(
            "Too many failed attempts. " +
            "Access locked for 30 seconds."
          );
        } else {
          setError(
            `Invalid access code. ` +
            `${MAX_ATTEMPTS - newAttempts} ` +
            `attempt${
              MAX_ATTEMPTS - newAttempts === 1
                ? "" : "s"
            } remaining.`
          );
        }

        // Shake animation
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        setCode("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center
                    justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>

      {/* Backdrop */}
      <div
        className="absolute inset-0
                      bg-on_surface/40
                      dark:bg-black/60
                      backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className={`relative bg-surface_container_lowest
                       dark:bg-[#131820]
                       rounded-2xl w-full max-w-md
                       shadow-[0_24px_64px_rgba(0,26,67,0.16)]
                       dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)]
                       overflow-hidden
                       transition-transform duration-200
                       ${shaking ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>

        {/* Top accent bar */}
        <div
          className="h-1 bg-gradient-to-r
                        from-primary to-primary_container"
        />

        {/* Header */}
        <div
          className="flex items-start justify-between
                        p-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl
                            bg-primary_fixed
                            dark:bg-[#3D1F10]
                            flex items-center justify-center">
              <Shield
                className="w-5 h-5 text-primary
                                  dark:text-[#E89874]"
              />
            </div>
            <div>
              <h2
                className="text-title-md font-bold
                              text-on_surface
                              dark:text-[#e8eaf0]">
                Oracle Access
              </h2>
              <p
                className="text-label-sm
                             text-on_surface_variant
                             dark:text-[#9ba3b8]">
                Government authority verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg
                       text-on_surface_variant
                       dark:text-[#9ba3b8]
                       hover:bg-surface_container
                       dark:hover:bg-[#1c2333]
                       transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">

          {/* Info banner */}
          <div
            className="flex items-start gap-3 p-3
                          bg-primary_fixed/40
                          dark:bg-[#3D1F10]/40
                          rounded-xl">
            <ShieldCheck
              className="w-4 h-4 text-primary
                                     dark:text-[#E89874]
                                     flex-shrink-0 mt-0.5"
            />
            <p
              className="text-label-sm text-on_surface_variant
                           dark:text-[#9ba3b8]">
              Enter the secure access code provided
              by the PropChain authority administrator.
              This session will be logged.
            </p>
          </div>

          {/* Success state */}
          {success && (
            <div
              className="flex items-center gap-3 p-4
                            bg-success_container
                            dark:bg-[#0a2e1a]
                            rounded-xl">
              <CheckCircle
                className="w-5 h-5 text-success
                                       flex-shrink-0"
              />
              <div>
                <p
                  className="text-body-md font-semibold
                               text-success">
                  Access granted
                </p>
                <p className="text-label-sm text-success/70">
                  Redirecting to Oracle dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Locked state */}
          {isLocked && (
            <div
              className="flex items-center gap-3 p-4
                            bg-error_container
                            dark:bg-[#2d0a0a]
                            rounded-xl">
              <Lock
                className="w-5 h-5 text-error
                                flex-shrink-0"
              />
              <div>
                <p
                  className="text-body-md font-semibold
                               text-error">
                  Access temporarily locked
                </p>
                <p className="text-label-sm text-error/70">
                  Try again in {countdown} seconds
                </p>
              </div>
            </div>
          )}

          {/* Input */}
          {!success && (
            <>
              <div className="space-y-1.5">
                <label
                  className="text-label-sm font-medium
                                   text-on_surface_variant
                                   dark:text-[#9ba3b8]">
                  Access Code
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showCode ? "text" : "password"}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter secure access code"
                    disabled={isLocked || checking}
                    className="w-full bg-surface_container_highest
                               dark:bg-[#2a3347]
                               rounded-lg px-4 py-3 pr-12
                               text-body-md text-on_surface
                               dark:text-[#e8eaf0]
                               border-0 border-b-2
                               border-outline_variant/30
                               dark:border-[#2a3347]
                               focus:border-primary
                               dark:focus:border-[#E89874]
                               focus:outline-none
                               placeholder:text-on_surface_variant/40
                               dark:placeholder:text-[#9ba3b8]/40
                               disabled:opacity-50
                               disabled:cursor-not-allowed
                               font-mono tracking-widest
                               transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowCode((p) => !p)}
                    className="absolute right-3 top-1/2
                               -translate-y-1/2
                               text-on_surface_variant
                               dark:text-[#9ba3b8]
                               hover:text-on_surface
                               transition-colors p-1">
                    {showCode
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && !isLocked && (
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className="w-3.5 h-3.5
                                            text-error
                                            flex-shrink-0"
                  />
                  <p className="text-label-sm text-error">
                    {error}
                  </p>
                </div>
              )}

              {/* Attempt dots */}
              {attempts > 0 && !isLocked && (
                <div className="flex items-center gap-1.5">
                  <p
                    className="text-label-sm
                                 text-on_surface_variant/60
                                 dark:text-[#9ba3b8]/60
                                 mr-1">
                    Attempts:
                  </p>
                  {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < attempts
                          ? "bg-error"
                          : "bg-surface_container_high dark:bg-[#2a3347]"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Submit button */}
              <Button
                variant="default"
                className="w-full"
                onClick={handleSubmit}
                disabled={
                  !code.trim() ||
                  isLocked ||
                  checking
                }>
                {checking
                  ? "Verifying..."
                  : "Verify & Enter Oracle Mode"}
              </Button>
            </>
          )}

          {/* Footer disclaimer */}
          <p
            className="text-[10px] text-on_surface_variant/50
                         dark:text-[#9ba3b8]/40
                         text-center leading-relaxed">
            Unauthorized access attempts are logged
            and may result in account suspension.
            This system is monitored.
          </p>

        </div>
      </div>
    </div>
  );
}
