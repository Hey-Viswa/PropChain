import { KYCRecord } from "@/lib/db/models/KYC";

export const KYCService = {
  async isVerified(clerkId: string): Promise<boolean> {
    const record = await KYCRecord.findOne({ clerkId }).select("verified");
    return record?.verified === true;
  },

  async getRecord(clerkId: string) {
    return KYCRecord.findOne({ clerkId });
  },

  async createRecord(clerkId: string, aadhaarLast4: string) {
    return KYCRecord.create({ clerkId, aadhaarLast4, verified: false });
  },

  async markVerified(clerkId: string) {
    return KYCRecord.findOneAndUpdate(
      { clerkId },
      { verified: true, verifiedAt: new Date() },
      { new: true }
    );
  },
};
