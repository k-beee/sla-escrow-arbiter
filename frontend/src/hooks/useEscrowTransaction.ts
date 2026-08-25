import { useState } from "react";

export type TxState = "idle" | "signing" | "pending" | "ACCEPTED" | "FINALIZED" | "error";

export function useEscrowTransaction() {
  const [status, setStatus] = useState<TxState>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = async (txPromise: () => Promise<string>, waitReceipt: (hash: string) => Promise<any>) => {
    try {
      setStatus("signing");
      setError(null);
      const hash = await txPromise();
      setTxHash(hash);
      setStatus("pending");

      const receipt = await waitReceipt(hash);
      if (receipt.status === "FINALIZED" || receipt.status === "ACCEPTED") {
        setStatus("FINALIZED");
      } else {
        setStatus("ACCEPTED");
      }
      return receipt;
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Transaction failed");
      throw err;
    }
  };

  return { status, txHash, error, execute };
}
