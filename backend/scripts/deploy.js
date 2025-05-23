const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const Voting = await ethers.getContractFactory("ZKLiteVotingDAO");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log("Contract deployed to:", address);

  // Simpan ke frontend/.env otomatis
  const envPath = path.join(__dirname, "../../frontend/.env");
  fs.writeFileSync(envPath, `REACT_APP_CONTRACT_ADDRESS=${address}\n`);

  console.log("✅ Address saved to frontend/.env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
