"use client";
import { useState } from "react";
import { Shield, X, Eye, EyeOff,
  CheckCircle, Smartphone } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { useKYC } from "@/hooks/useKYC";

interface Props {
  isOpen:  boolean;
  onClose: () => void;
  onVerified?: () => void;
}

export default function KYCModal({
  isOpen, onClose, onVerified,
}: Props) {
  const { address }  = useWallet();
  const { refetch }  = useKYC();
  const { toast }    = useToast();

  const [step, setStep]             = useState<1 | 2>(1);
  const [aadhaar, setAadhaar]       = useState("");
  const [otp, setOtp]               = useState("");
  const [showOtp, setShowOtp]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [otpSent, setOtpSent]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");

  const formatAadhaar = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const rawAadhaar = aadhaar.replace(/\s/g, "");

  const handleSendOTP = async () => {
    if (rawAadhaar.length !== 12) {
      setError("Enter a valid 12-digit Aadhaar number");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate OTP send (Phase 1 mock)
    await new Promise((r) => setTimeout(r, 1000));
    setOtpSent(true);
    setStep(2);
    setLoading(false);
    toast({
      title:       "OTP Sent",
      description: "A 6-digit OTP has been sent to your registered mobile (simulated).",
    });
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/kyc/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhaarNumber: rawAadhaar,
          otp,
          walletAddress: address ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Verification failed");
        return;
      }
      setSuccess(true);
      await refetch();
      setTimeout(() => {
        onVerified?.();
        onClose();
        setSuccess(false);
        setStep(1);
        setAadhaar("");
        setOtp("");
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center
                 justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div className="absolute inset-0
                      bg-on_surface/40
                      dark:bg-black/60
                      backdrop-blur-sm" />
      <div className="relative bg-surface_container_lowest
                      dark:bg-[#131820] rounded-2xl
                      w-full max-w-md overflow-hidden
                      shadow-[0_24px_64px_rgba(0,26,67,0.16)]">
        <div className="h-1 bg-gradient-to-r
                        from-primary to-primary_container" />
        <div className="p-6 space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl
                              bg-primary_fixed
                              dark:bg-[#3D1F10]
                              flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary
                                    dark:text-[#E89874]" />
              </div>
              <div>
                <p className="text-title-md font-bold
                               text-on_surface
                               dark:text-[#e8eaf0]">
                  KYC Verification
                </p>
                <p className="text-label-sm
                               text-on_surface_variant
                               dark:text-[#9ba3b8]">
                  Step {step} of 2 —{" "}
                  {step === 1
                    ? "Enter Aadhaar"
                    : "Verify OTP"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg
                         text-on_surface_variant
                         hover:bg-surface_container
                         dark:hover:bg-[#1c2333]
                         transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success */}
          {success && (
            <div className="flex items-center gap-3
                            p-4 bg-success_container
                            dark:bg-[#0a2e1a] rounded-xl">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-body-md font-semibold
                               text-success">
                  KYC Verified Successfully
                </p>
                <p className="text-label-sm text-success/70">
                  Your identity has been confirmed.
                </p>
              </div>
            </div>
          )}

          {!success && (
            <>
              {/* Step 1: Aadhaar input */}
              {step === 1 && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-label-sm font-medium
                                       text-on_surface_variant
                                       dark:text-[#9ba3b8]">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      value={aadhaar}
                      onChange={(e) => {
                        setAadhaar(
                          formatAadhaar(e.target.value)
                        );
                        setError("");
                      }}
                      placeholder="0000 0000 0000"
                      maxLength={14}
                      className="w-full bg-surface_container_highest
                                 dark:bg-[#2a3347]
                                 rounded-lg px-4 py-3
                                 text-body-md text-on_surface
                                 dark:text-[#e8eaf0]
                                 border-0 border-b-2
                                 border-outline_variant/30
                                 dark:border-[#2a3347]
                                 focus:border-primary
                                 dark:focus:border-[#E89874]
                                 focus:outline-none
                                 placeholder:text-on_surface_variant/40
                                 font-mono tracking-widest
                                 transition-colors"
                    />
                    <p className="text-label-sm
                                   text-on_surface_variant/60
                                   dark:text-[#9ba3b8]/50">
                      Only last 4 digits are stored.
                      This is a simulation — no real data sent.
                    </p>
                  </div>
                  {error && (
                    <p className="text-label-sm text-error">
                      {error}
                    </p>
                  )}
                  <button
                    onClick={handleSendOTP}
                    disabled={
                      rawAadhaar.length !== 12 || loading
                    }
                    className="w-full bg-primary text-on_primary
                               rounded-md py-2.5 text-body-md
                               font-medium hover:opacity-90
                               transition disabled:opacity-50
                               disabled:cursor-not-allowed">
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              )}

              {/* Step 2: OTP input */}
              {step === 2 && (
                <div className="space-y-3">
                  <div className="p-3 bg-primary_fixed/40
                                  dark:bg-[#3D1F10]/40
                                  rounded-xl flex items-center
                                  gap-2.5">
                    <Smartphone className="w-4 h-4 text-primary
                                            dark:text-[#E89874]
                                            flex-shrink-0" />
                    <p className="text-label-sm
                                   text-on_surface_variant
                                   dark:text-[#9ba3b8]">
                      OTP sent to your registered mobile
                      (simulated). Enter any 6-digit number.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-label-sm font-medium
                                       text-on_surface_variant
                                       dark:text-[#9ba3b8]">
                      One-Time Password
                    </label>
                    <div className="relative">
                      <input
                        type={showOtp ? "text" : "password"}
                        value={otp}
                        onChange={(e) => {
                          setOtp(
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6)
                          );
                          setError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleVerify();
                        }}
                        placeholder="000000"
                        maxLength={6}
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
                                   font-mono tracking-[0.5em]
                                   text-center text-xl
                                   transition-colors"
                      />
                      <button
                        onClick={() => setShowOtp((p) => !p)}
                        className="absolute right-3 top-1/2
                                   -translate-y-1/2
                                   text-on_surface_variant p-1">
                        {showOtp
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p className="text-label-sm text-error">
                      {error}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                        setError("");
                      }}
                      className="flex-1 bg-surface_container
                                 dark:bg-[#1c2333]
                                 text-on_surface_variant
                                 dark:text-[#9ba3b8]
                                 rounded-md py-2.5 text-body-md
                                 font-medium hover:opacity-80
                                 transition">
                      Back
                    </button>
                    <button
                      onClick={handleVerify}
                      disabled={otp.length !== 6 || loading}
                      className="flex-1 bg-primary text-on_primary
                                 rounded-md py-2.5 text-body-md
                                 font-medium hover:opacity-90
                                 transition disabled:opacity-50
                                 disabled:cursor-not-allowed">
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
