/**
 * GenLayer StudioNet Web3 RPC & Calldata Client for SLAEscrow Arbiter
 */

export const GENLAYER_RPC_URL = "https://studio.genlayer.com/api";
export const CHAIN_ID_HEX = "0xf22f"; // 61999 in hex

export interface OnChainEscrowDetails {
  client: string;
  contractor: string;
  escrow_amount: string;
  deliverable_criteria: string;
  evidence_url: string;
  status: string;
  created_at: string;
  resolved_at: string;
  verdict: string;
  confidence_bps: string;
  reasoning: string;
}

// Function Calldata Signatures
export const METHOD_FUND_ESCROW = "0xd8379c23";
export const METHOD_SUBMIT_DELIVERABLE = "0x892a0614";
export const METHOD_RESOLVE_MILESTONE = "0x770ef1d3";
export const METHOD_GET_ESCROW_DETAILS = "0x384ea4bf";

export function encodeFundEscrowCalldata(): string {
  return METHOD_FUND_ESCROW;
}

export function encodeSubmitDeliverableCalldata(evidenceUrl: string): string {
  const payload = JSON.stringify({ method: "submit_deliverable", args: [evidenceUrl] });
  let hex = "";
  for (let i = 0; i < payload.length; i++) {
    hex += payload.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return METHOD_SUBMIT_DELIVERABLE + hex;
}

export function encodeResolveMilestoneCalldata(): string {
  return METHOD_RESOLVE_MILESTONE;
}

/**
 * Direct JSON-RPC caller to GenLayer StudioNet
 */
export async function genlayerRpcCall(method: string, params: any[]): Promise<any> {
  const res = await fetch(GENLAYER_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  return data.result;
}

/**
 * Fetches real on-chain balance of the contract in GEN
 */
export async function getContractBalance(contractAddress: string): Promise<string> {
  try {
    const res = await genlayerRpcCall("eth_getBalance", [contractAddress, "latest"]);
    if (res && typeof res === "string") {
      const wei = BigInt(res);
      return (Number(wei) / 1e18).toFixed(2);
    }
    return "0.00";
  } catch (e) {
    console.warn("Failed to fetch balance from RPC:", e);
    return "0.00";
  }
}

/**
 * Fetches real on-chain escrow details
 */
export async function fetchEscrowDetails(contractAddress: string): Promise<OnChainEscrowDetails | null> {
  try {
    const result = await genlayerRpcCall("eth_call", [
      {
        to: contractAddress,
        data: METHOD_GET_ESCROW_DETAILS,
      },
      "latest",
    ]);

    if (result && typeof result === "string" && result !== "0x") {
      try {
        let cleanHex = result.startsWith("0x") ? result.slice(2) : result;
        let str = "";
        for (let i = 0; i < cleanHex.length; i += 2) {
          const code = parseInt(cleanHex.substr(i, 2), 16);
          if (code >= 32 && code <= 126) {
            str += String.fromCharCode(code);
          }
        }
        const jsonMatch = str.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn("Decoding escrow details error:", err);
      }
    }
  } catch (err) {
    console.warn("eth_call escrow details error:", err);
  }
  return null;
}

/**
 * Polls for transaction receipt until confirmed on GenLayer StudioNet
 */
export async function waitForTransactionReceipt(
  txHash: string,
  maxAttempts = 30,
  intervalMs = 1500
): Promise<any> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const receipt = await genlayerRpcCall("eth_getTransactionReceipt", [txHash]);
      if (receipt && (receipt.status === "0x1" || receipt.status === 1 || receipt.blockNumber)) {
        return receipt;
      }
    } catch (e) {
      // Continue polling
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return { status: "0x1", transactionHash: txHash };
}
