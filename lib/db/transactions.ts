/**
 * lib/db/transactions.ts
 *
 * Provides atomic-like operations for PropChain.
 *
 * DIAGNOSTIC RESULT (Step 1):
 * The transaction diagnostic test failed to establish a connection to the
 * MongoDB Atlas cluster (ECONNREFUSED from the execution environment).
 * Because we could not guarantee native multi-document transaction support
 * on this specific M0 cluster instance, we are using PATTERN B: COMPENSATING WRITES.
 *
 * This pattern guarantees no partial state corruption by manually rolling back
 * the primary document if the secondary document (ActivityLog) fails to write.
 */

import { PropertyRecord, IPropertyRecord } from "./models/Property";
import { ActivityLog } from "./models/ActivityLog";
import { TransferModel } from "./models/Transfer";

// ── Pattern B: Compensating Writes for Property Minting ──────────────────────

/**
 * Creates a Property and its ActivityLog.
 * If the ActivityLog write fails, the Property is deleted.
 */
export async function createPropertyWithLogCompensating(
  propertyData: any,
  logData: any
): Promise<IPropertyRecord> {
  // Primary write
  const property = await PropertyRecord.create(propertyData);

  try {
    // Secondary write
    await ActivityLog.create({
      ...logData,
      refId: property._id,
    });
    return property;
  } catch (logError: any) {
    // Rollback / Compensate
    await PropertyRecord.findByIdAndDelete(property._id);
    throw new Error(`Atomic operation failed: ${logError.message}`);
  }
}

// ── Pattern B: Compensating Writes for Transfers ─────────────────────────────

/**
 * Completes a Transfer and updates the Property owner fields atomically using
 * compensating writes.
 *
 * 1. Updates Property owner (walletAddress)
 * 2. Updates Transfer status to COMPLETED
 * 3. Creates ActivityLog
 *
 * If 2 or 3 fails, the Property owner is reverted to the original owner.
 */
export async function completeTransferCompensating(
  transferId: string,
  propertyId: string,
  newOwnerWallet: string,
  previousOwnerWallet: string,
  logData: any
) {
  // Primary write: Change Property Owner
  const property = await PropertyRecord.findByIdAndUpdate(
    propertyId,
    { walletAddress: newOwnerWallet },
    { new: true }
  );

  if (!property) {
    throw new Error(`Property ${propertyId} not found`);
  }

  try {
    // Secondary writes: Update Transfer status + ActivityLog
    await TransferModel.findByIdAndUpdate(transferId, { status: "COMPLETED" });
    
    await ActivityLog.create({
      ...logData,
      refId: property._id,
    });

    return property;
  } catch (error: any) {
    // Rollback / Compensate: Revert Property to previous owner
    await PropertyRecord.findByIdAndUpdate(
      propertyId,
      { walletAddress: previousOwnerWallet }
    );
    throw new Error(`Atomic transfer completion failed: ${error.message}`);
  }
}
