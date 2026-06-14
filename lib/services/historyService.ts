/**
 * lib/services/historyService.ts
 *
 * Phase 2 — ownership / event history for a property, read directly from chain
 * logs via viem `getLogs`. This is the *free* alternative to The Graph
 * (the decentralized network is a paid service): we batch eth_getLogs over the
 * contract events ourselves.
 *
 * Works against PropertyNFT plus the optional Encumbrance/Dispute registries
 * when their addresses are configured.
 */
import { parseAbiItem, type AbiEvent, type PublicClient } from "viem";
import {
  getProvider,
  CONTRACT_ADDRESS,
  ENCUMBRANCE_REGISTRY_ADDRESS,
  DISPUTE_REGISTRY_ADDRESS,
} from "@/lib/contracts";

export type TimelineCategory =
  | "registry"
  | "ownership"
  | "encumbrance"
  | "dispute";

export interface TimelineEvent {
  type: string;
  category: TimelineCategory;
  tokenId: string;
  blockNumber: number;
  txHash: string;
  logIndex: number;
  timestamp: number | null; // epoch ms (from block)
  args: Record<string, string | number>;
}

interface EventSpec {
  category: TimelineCategory;
  address: `0x${string}`;
  event: AbiEvent;
}

const DEFAULT_CHUNK = BigInt(9000);
const ONE = BigInt(1);

function eventSpecs(): EventSpec[] {
  const specs: EventSpec[] = [];

  if (CONTRACT_ADDRESS) {
    specs.push(
      {
        category: "registry",
        address: CONTRACT_ADDRESS,
        event: parseAbiItem(
          "event PropertyRegistered(uint256 indexed tokenId, string ulpin, address indexed owner, uint256 timestamp)"
        ),
      },
      {
        category: "registry",
        address: CONTRACT_ADDRESS,
        event: parseAbiItem(
          "event PropertyApproved(uint256 indexed tokenId, address indexed oracle)"
        ),
      },
      {
        category: "registry",
        address: CONTRACT_ADDRESS,
        event: parseAbiItem(
          "event PropertyRejected(uint256 indexed tokenId, address indexed oracle, string reason)"
        ),
      },
      {
        category: "ownership",
        address: CONTRACT_ADDRESS,
        event: parseAbiItem(
          "event OwnershipTransferInitiated(uint256 indexed tokenId, address from, address to)"
        ),
      }
    );
  }

  if (ENCUMBRANCE_REGISTRY_ADDRESS) {
    specs.push(
      {
        category: "encumbrance",
        address: ENCUMBRANCE_REGISTRY_ADDRESS,
        event: parseAbiItem(
          "event LienAdded(uint256 indexed tokenId, address indexed lender, uint256 amount, string reason, uint256 timestamp)"
        ),
      },
      {
        category: "encumbrance",
        address: ENCUMBRANCE_REGISTRY_ADDRESS,
        event: parseAbiItem(
          "event LienReleased(uint256 indexed tokenId, address indexed lender, uint256 timestamp)"
        ),
      }
    );
  }

  if (DISPUTE_REGISTRY_ADDRESS) {
    specs.push(
      {
        category: "dispute",
        address: DISPUTE_REGISTRY_ADDRESS,
        event: parseAbiItem(
          "event DisputeRaised(uint256 indexed tokenId, address indexed raisedBy, string reason, uint256 timestamp)"
        ),
      },
      {
        category: "dispute",
        address: DISPUTE_REGISTRY_ADDRESS,
        event: parseAbiItem(
          "event DisputeResolved(uint256 indexed tokenId, address indexed resolvedBy, string resolution, uint256 timestamp)"
        ),
      }
    );
  }

  return specs;
}

/** Stable ordering: by block number, then log index. Pure (unit-testable). */
export function sortTimeline(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort(
    (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex
  );
}

function serializeArgs(args: unknown): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (args && typeof args === "object") {
    for (const [k, v] of Object.entries(args as Record<string, unknown>)) {
      out[k] = typeof v === "bigint" ? v.toString() : (v as string | number);
    }
  }
  return out;
}

/**
 * Fetch and merge the full on-chain timeline for a token id.
 * `startBlock` defaults to HISTORY_START_BLOCK env (or 0).
 */
export async function getPropertyHistory(
  tokenId: number | string,
  opts: { startBlock?: bigint; client?: PublicClient } = {}
): Promise<TimelineEvent[]> {
  const client = (opts.client ?? getProvider()) as PublicClient;
  const id = BigInt(tokenId);
  const latest = await client.getBlockNumber();
  const startBlock =
    opts.startBlock ?? BigInt(process.env.HISTORY_START_BLOCK ?? "0");

  const events: TimelineEvent[] = [];
  const timestampCache = new Map<bigint, number | null>();

  for (const spec of eventSpecs()) {
    for (let from = startBlock; from <= latest; from += DEFAULT_CHUNK + ONE) {
      const to = from + DEFAULT_CHUNK > latest ? latest : from + DEFAULT_CHUNK;
      let logs;
      try {
        logs = await client.getLogs({
          address: spec.address,
          event: spec.event,
          args: { tokenId: id } as never,
          fromBlock: from,
          toBlock: to,
        });
      } catch {
        // Some RPCs reject wide ranges; skip this chunk gracefully.
        continue;
      }

      for (const log of logs) {
        const blockNumber = log.blockNumber ?? BigInt(0);
        if (!timestampCache.has(blockNumber)) {
          try {
            const block = await client.getBlock({ blockNumber });
            timestampCache.set(blockNumber, Number(block.timestamp) * 1000);
          } catch {
            timestampCache.set(blockNumber, null);
          }
        }
        events.push({
          type: spec.event.name,
          category: spec.category,
          tokenId: String(tokenId),
          blockNumber: Number(blockNumber),
          txHash: log.transactionHash ?? "",
          logIndex: log.logIndex ?? 0,
          timestamp: timestampCache.get(blockNumber) ?? null,
          args: serializeArgs((log as { args?: unknown }).args),
        });
      }
    }
  }

  return sortTimeline(events);
}
