import { createClient, createAccount } from "genlayer-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const rpcUrl = process.env.GENLAYER_RPC_URL || "https://studio.genlayer.com/api";
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.error("Please provide PRIVATE_KEY environment variable");
    process.exit(1);
  }

  const account = createAccount(privateKey);
  const client = createClient({ endpoint: rpcUrl, account });

  console.log(`Deploying from account: ${account.address}`);

  const contractPath = path.join(__dirname, "../contracts/SLAEscrowArbiter.py");
  const contractCode = fs.readFileSync(contractPath, "utf-8");

  const contractorAddress = process.env.CONTRACTOR_ADDRESS || account.address;
  const criteria = process.env.CRITERIA || "Deliverable must satisfy all acceptance tests with documentation.";

  console.log("Deploying SLAEscrowArbiter to GenLayer...");
  const txHash = await client.deployContract({
    code: contractCode,
    args: [contractorAddress, criteria],
  });

  console.log(`Deployment transaction submitted. Hash: ${txHash}`);
  const receipt = await client.waitForTransactionReceipt({ hash: txHash });
  console.log(`Contract successfully deployed at: ${receipt.contractAddress}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
