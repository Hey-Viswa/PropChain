"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { PropChainMark } from "@/components/shared/PropChainMark";
import { toSvg } from "@/lib/qrcode";

interface PropertyView {
  ulpin: string;
  physicalAddress: string;
  areaSqFt: number;
  propertyType: string;
  walletAddress: string;
  tokenId: number;
  status: string;
}
interface Credential {
  id: string;
  issuanceDate: string;
  proof?: { proofValue: string };
}

export default function CertificatePage() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [property, setProperty] = useState<PropertyView | null>(null);
  const [credential, setCredential] = useState<Credential | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetch(`/api/properties/token/${tokenId}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/credential/${tokenId}`).then(async (r) => ({ ok: r.ok, body: await r.json() })),
    ])
      .then(([prop, cred]) => {
        if (cancelled) return;
        if (prop?.ulpin) setProperty(prop);
        if (cred.ok && cred.body.credential) {
          setCredential(cred.body.credential);
          setValid(cred.body.verification?.valid ?? null);
        } else {
          setError(cred.body?.error ?? "Certificate unavailable");
        }
      })
      .catch(() => !cancelled && setError("Failed to load certificate"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [tokenId]);

  const verifyUrl = origin ? `${origin}/certificate/${tokenId}` : "";
  const qrSvg = useMemo(() => {
    if (!verifyUrl) return "";
    try {
      return toSvg(verifyUrl, { margin: 2 });
    } catch {
      return "";
    }
  }, [verifyUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f1ea]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D97757]" />
      </div>
    );
  }

  if (error || !property || !credential) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f4f1ea] text-center px-6">
        <ShieldAlert className="w-10 h-10 text-[#b3492f]" />
        <p className="text-lg font-semibold text-[#2a2724]">{error ?? "Certificate not available"}</p>
        <p className="text-sm text-[#6b655d]">A certificate is only issued for an oracle-approved property.</p>
        <Link href={`/properties/${tokenId}`} className="text-[#D97757] font-medium underline">
          Back to property
        </Link>
      </div>
    );
  }

  const shortHash = credential.proof?.proofValue
    ? `${credential.proof.proofValue.slice(0, 16)}…${credential.proof.proofValue.slice(-16)}`
    : "—";
  const issued = new Date(credential.issuanceDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#e9e4d8] py-8 px-4 print:bg-white print:p-0">
      {/* Print-only styling: hide the toolbar, give the sheet full bleed. */}
      <style>{`@media print { .no-print { display: none !important; } @page { size: A4 landscape; margin: 12mm; } }`}</style>

      {/* Toolbar */}
      <div className="no-print max-w-[920px] mx-auto mb-6 flex items-center justify-between">
        <Link href={`/properties/${tokenId}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#5a544b] hover:text-[#2a2724]">
          <ArrowLeft size={16} /> Back to property
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D97757] text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-[#c56a4c] transition-colors"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* Certificate sheet */}
      <div className="max-w-[920px] mx-auto bg-[#fdfcf9] rounded-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] print:shadow-none border-[6px] border-double border-[#c9a36a] p-12 print:p-10 relative overflow-hidden">
        {/* Guilloché-style corner flourishes */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full border-[24px] border-[#D97757]/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full border-[28px] border-[#c9a36a]/10" />

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <PropChainMark size={34} />
          <span className="font-display text-2xl font-bold tracking-tight text-[#2a2724]">
            Prop<span className="text-[#D97757]">Chain</span>
          </span>
        </div>
        <p className="text-center text-[11px] uppercase tracking-[0.35em] text-[#a89f8e] mb-8">
          Digital Land Registry · Proof of Concept
        </p>

        <h1 className="text-center font-display text-3xl md:text-4xl font-bold text-[#2a2724] mb-1">
          Certificate of Ownership
        </h1>
        <p className="text-center text-sm text-[#6b655d] mb-10">
          This certifies that the property recorded below is registered on the PropChain ledger.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
          {/* Details */}
          <div className="space-y-4">
            <Field label="Registered Owner (Wallet)" value={property.walletAddress} mono />
            <Field label="ULPIN (Bhu-Aadhar)" value={property.ulpin} mono />
            <Field label="Property Address" value={property.physicalAddress} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Area" value={`${property.areaSqFt.toLocaleString("en-IN")} sq ft`} />
              <Field label="Type" value={property.propertyType} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Token ID" value={`#${property.tokenId}`} mono />
              <Field label="Issued On" value={issued} />
            </div>
          </div>

          {/* QR + seal */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-40 h-40 bg-white p-2 rounded-md border border-[#e3ddd0]" aria-label="Verification QR code">
              {qrSvg ? (
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#a89f8e] text-center px-2">
                  Scan unavailable
                </div>
              )}
            </div>
            <p className="text-[10px] text-[#a89f8e] text-center max-w-[160px]">Scan to verify this certificate</p>
          </div>
        </div>

        {/* Verification footer */}
        <div className="mt-10 pt-6 border-t border-[#e3ddd0] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            {valid ? (
              <span className="inline-flex items-center gap-1.5 text-[#2f7a4d] text-sm font-semibold">
                <ShieldCheck size={16} /> Cryptographic proof verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#b3492f] text-sm font-semibold">
                <ShieldAlert size={16} /> Proof unverified
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#a89f8e]">W3C VC · HMAC-SHA256 proof</p>
            <p className="text-[11px] font-mono text-[#6b655d] break-all">{shortHash}</p>
          </div>
        </div>

        <p className="mt-6 text-center text-[9px] leading-relaxed text-[#a89f8e]">
          This is a Proof of Concept and does not create legal ownership under the Transfer of Property Act, 1882
          or the Registration Act, 1908. Smart-contract transfers are simulations and are not legally binding.
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-[#a89f8e] mb-0.5">{label}</p>
      <p className={`text-[#2a2724] font-medium ${mono ? "font-mono text-sm break-all" : "text-base"}`}>{value}</p>
    </div>
  );
}
