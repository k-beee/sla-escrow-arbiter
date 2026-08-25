import { createClient, createAccount } from "genlayer-js";

async function main() {
  const rpcUrl = process.env.GENLAYER_RPC_URL || "https://studio.genlayer.com/api";
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!privateKey || !contractAddress) {
    console.error("Usage: PRIVATE_KEY=0x... CONTRACT_ADDRESS=0x... node scripts/interact.mjs");
    process.exit(1);
  }

  const account = createAccount(privateKey);
  const client = createClient({ endpoint: rpcUrl, account });

  console.log(`Connecting to SLAEscrowArbiter at ${contractAddress}...`);
  const details = await client.readContract({
    address: contractAddress,
    functionName: "get_escrow_details",
    args: [],
  });

  console.log("Current Escrow State:", details);
}

main().catch(console.error);
