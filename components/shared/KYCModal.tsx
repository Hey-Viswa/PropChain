"use client";
import { useState } from "react";
import { Shield, X, Eye, EyeOff,
  CheckCircle, Smartphone, AlertTriangle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { useKYC } from "@/hooks/useKYC";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    await new Promise((r) => setTimeout(r, 1000));
    setOtpSent(true);
    setStep(2);
    setLoading(false);
    toast({
      title:       "OTP Sent",
      description: "A 6-digit OTP has been sent to your registered mobile.",
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
                      bg-on_surface/60
                      dark:bg-black/80
                      backdrop-blur-sm" />
      <div className="relative bg-white
                      dark:bg-card rounded-[32px]
                      w-full max-w-md overflow-hidden
                      shadow-floating border border-stone/50 dark:border-white/10">
        <div className="h-1.5 bg-primary" />
        <div className="p-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl
                              bg-primary/10
                              flex items-center justify-center border border-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold font-display
                               text-on_surface
                               dark:text-[#e8eaf0]">
                  Compliance Audit
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest
                               text-on_surface_variant
                               dark:text-muted-foreground mt-0.5">
                  Step {step} of 2 —{" "}
                  {step === 1
                    ? "Identify"
                    : "Authorize"}
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

          {/* Success */}
          {success && (
            <div className="flex items-center gap-4
                            p-5 bg-success/5
                            border border-success/10 rounded-2xl animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold
                               text-success uppercase tracking-wider">
                  Audit Finalized
                </p>
                <p className="text-xs text-on_surface_variant dark:text-muted-foreground font-medium">
                  Identity link successful.
                </p>
              </div>
            </div>
          )}

          {!success && (
            <>
              {/* Step 1: Aadhaar input */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest
                                       text-on_surface_variant
                                       dark:text-muted-foreground ml-1">
                      Aadhaar Identity Number
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
                      className="w-full bg-sand/30
                                 dark:bg-white/5
                                 rounded-xl px-5 py-4
                                 text-lg text-on_surface
                                 dark:text-[#e8eaf0]
                                 border border-stone/50
                                 dark:border-white/10
                                 focus:border-primary
                                 focus:ring-1 focus:ring-primary
                                 focus:outline-none
                                 placeholder:text-on_surface_variant/30
                                 font-mono tracking-[0.2em]
                                 transition-all"
                    />
                    <p className="text-[10px] font-medium
                                   text-on_surface_variant/60
                                   dark:text-muted-foreground/50 ml-1">
                      Encryption: Only last 4 digits persist.
                    </p>
                  </div>
                  {error && (
                    <p className="text-xs font-bold text-error flex items-center gap-1.5 ml-1">
                      <AlertTriangle size={12} /> {error}
                    </p>
                  )}
                  <Button
                    onClick={handleSendOTP}
                    disabled={
                      rawAadhaar.length !== 12 || loading
                    }
                    className="w-full h-12 rounded-xl text-xs
                               font-bold uppercase tracking-widest shadow-lg">
                    {loading ? "Initializing..." : "Generate OTP"}
                  </Button>
                </div>
              )}

              {/* Step 2: OTP input */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5
                                  rounded-2xl flex items-center
                                  gap-4 border border-primary/10">
                    <Smartphone className="w-5 h-5 text-primary
                                            flex-shrink-0" />
                    <p className="text-xs font-medium leading-relaxed
                                   text-on_surface_variant
                                   dark:text-muted-foreground">
                      Authorization code sent to registered device.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest
                                       text-on_surface_variant
                                       dark:text-muted-foreground ml-1">
                      One-Time Protocol Code
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
                        onClick={() => setShowOtp((p) => !p)}
                        className="absolute right-4 top-1/2
                                   -translate-y-1/2
                                   text-on_surface_variant hover:text-primary p-2 transition-colors">
                        {showOtp
                          ? <EyeOff className="w-5 h-5" />
                          : <Eye className="w-5 h-5" />
                        }
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p className="text-xs font-bold text-error flex items-center gap-1.5 ml-1">
                      <AlertTriangle size={12} /> {error}
                    </p>
                  )}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                        setError("");
                      }}
                      className="flex-1 h-12 rounded-xl text-[10px]
                                 font-bold uppercase tracking-widest">
                      Back
                    </Button>
                    <Button
                      onClick={handleVerify}
                      disabled={otp.length !== 6 || loading}
                      className="flex-1 h-12 rounded-xl text-[10px]
                                 font-bold uppercase tracking-widest shadow-lg">
                      {loading ? "Verifying..." : "Confirm"}
                    </Button>
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
