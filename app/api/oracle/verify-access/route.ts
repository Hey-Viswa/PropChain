import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit } from "@/lib/rateLimit";

/**
 * POST /api/oracle/verify-access
 *
 * Receives a plaintext passphrase from the client, hashes it server-side,
 * and compares it against the ORACLE_ACCESS_HASH env variable.
 *
 * SECURITY RULES:
 *  - ORACLE_ACCESS_HASH is server-only (no NEXT_PUBLIC_ prefix)
 *  - The hash is NEVER returned to the client
 *  - Only a boolean result is returned
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed, resetIn } = rateLimit(ip, 5);

  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': resetIn.toString() }
    });
  }

  try {
    const body = await req.json();
    const passphrase: string | undefined = body?.passphrase;

    if (!passphrase || typeof passphrase !== "string") {
      return NextResponse.json(
        { valid: false, error: "Passphrase is required." },
        { status: 400 }
      );
    }

    const storedHash = process.env.ORACLE_ACCESS_HASH;
    if (!storedHash) {
      console.error("[verify-access] ORACLE_ACCESS_HASH is not configured.");
      return NextResponse.json(
        { valid: false, error: "Oracle access is not configured." },
        { status: 500 }
      );
    }

    // Hash the incoming plaintext server-side — never trust client-side hashing
    const hashedInput = crypto
      .createHash("sha256")
      .update(passphrase)
      .digest("hex");

    const isValid =
      hashedInput.toLowerCase() === storedHash.trim().toLowerCase();

    // Always return 200 with a boolean — do NOT expose why it failed
    // Rate limiting / lockout is enforced client-side (and should also be
    // enforced via middleware / Redis in production).
    return NextResponse.json({ valid: isValid }, { status: 200 });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
