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
import { cn } from "@/lib/utils";

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

      <div
        className="absolute inset-0
                      bg-on_surface/60
                      dark:bg-black/80
                      backdrop-blur-sm"
      />

      <div
        className={cn(
          "relative bg-white dark:bg-card",
          "rounded-[32px] w-full max-w-md",
          "shadow-floating overflow-hidden",
          "border border-stone/50 dark:border-white/10",
          "transition-transform duration-200",
          shaking ? "animate-[shake_0.4s_ease-in-out]" : ""
        )}>

        <div className="h-1.5 bg-primary" />

        <div
          className="flex items-start justify-between
                        p-8 pb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl
                            bg-primary/10
                            flex items-center justify-center border border-primary/20">
              <Shield
                className="w-6 h-6 text-primary"
              />
            </div>
            <div>
              <h2
                className="text-xl font-bold font-display
                              text-on_surface
                              dark:text-[#e8eaf0]">
                Institutional Access
              </h2>
              <p
                className="text-[10px] font-bold uppercase tracking-widest
                             text-on_surface_variant
                             dark:text-muted-foreground mt-0.5">
                Government Identity Authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl
                       text-on_surface_variant
                       hover:bg-stone/10
                       dark:hover:bg-white/5
                       transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 pt-4 space-y-6">

          <div
            className="flex items-start gap-4 p-4
                          bg-primary/5
                          rounded-2xl border border-primary/10">
            <ShieldCheck
              className="w-5 h-5 text-primary
                                     flex-shrink-0 mt-0.5"
            />
            <p
              className="text-xs font-medium leading-relaxed
                           text-on_surface_variant
                           dark:text-muted-foreground">
              Enter the institutional access code to activate Oracle functions. All administrative sessions are cryptographically logged.
            </p>
          </div>

          {success && (
            <div
              className="flex items-center gap-4 p-5
                            bg-success/5
                            border border-success/10
                            rounded-2xl animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center shrink-0">
                <CheckCircle
                  className="w-6 h-6 text-white"
                />
              </div>
              <div>
                <p
                  className="text-sm font-bold
                               text-success uppercase tracking-wider">
                  Access Authorized
                </p>
                <p className="text-xs text-on_surface_variant dark:text-muted-foreground font-medium">
                  Redirecting to Control Center...
                </p>
              </div>
            </div>
          )}

          {isLocked && (
            <div
              className="flex items-center gap-4 p-5
                            bg-error/5
                            border border-error/10
                            rounded-2xl animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-error flex items-center justify-center shrink-0">
                <Lock
                  className="w-5 h-5 text-white"
                />
              </div>
              <div>
                <p
                  className="text-sm font-bold
                               text-error uppercase tracking-wider">
                  Security Lockout
                </p>
                <p className="text-xs text-on_surface_variant dark:text-muted-foreground font-medium">
                  Retry available in {countdown}s
                </p>
              </div>
            </div>
          )}

          {!success && (
            <>
              <div className="space-y-2">
                <label
                  className="text-[10px] font-bold uppercase tracking-widest
                                   text-on_surface_variant
                                   dark:text-muted-foreground ml-1">
                  Access Protocol Code
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
                    placeholder="••••••••"
                    disabled={isLocked || checking}
                    className="w-full bg-sand/30
                               dark:bg-white/5
                               rounded-xl px-5 py-4 pr-14
                               text-2xl text-on_surface
                               dark:text-[#e8eaf0]
                               border border-stone/50
                               dark:border-white/10
                               focus:border-primary
                               focus:ring-1 focus:ring-primary
                               focus:outline-none
                               placeholder:text-on_surface_variant/20
                               font-mono tracking-[0.6em]
                               text-center
                               transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowCode((p) => !p)}
                    className="absolute right-4 top-1/2
                               -translate-y-1/2
                               text-on_surface_variant
                               hover:text-primary
                               transition-colors p-2">
                    {showCode
                      ? <EyeOff className="w-5 h-5" />
                      : <Eye className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              {error && !isLocked && (
                <div className="flex items-center gap-2 ml-1">
                  <AlertTriangle
                    className="w-4 h-4 text-error flex-shrink-0"
                  />
                  <p className="text-xs font-bold text-error">
                    {error}
                  </p>
                </div>
              )}

              {attempts > 0 && !isLocked && (
                <div className="flex items-center gap-2 ml-1">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest
                                 text-on_surface_variant/60
                                 dark:text-muted-foreground/60">
                    Security Attempts:
                  </p>
                  <div className="flex items-center gap-1.5">
                    {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors",
                          i < attempts ? "bg-error" : "bg-stone/30 dark:bg-white/10"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="default"
                className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg mt-2"
                onClick={handleSubmit}
                disabled={
                  !code.trim() ||
                  isLocked ||
                  checking
                }>
                {checking
                  ? "Authorizing..."
                  : "Verify Institutional Access"}
              </Button>
            </>
          )}

          <p
            className="text-[10px] text-on_surface_variant/40
                         dark:text-muted-foreground/30
                         text-center leading-relaxed font-medium">
            PropChain Security: Multiple unauthorized attempts will result in node suspension and IP flagging.
          </p>

        </div>
      </div>
    </div>
  );
}
