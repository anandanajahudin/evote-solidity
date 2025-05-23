const hre = require("hardhat");

async function main() {
  const [admin, member1, member2] = await hre.ethers.getSigners();

  // Deploy kontrak
  const Voting = await hre.ethers.getContractFactory("ZKLiteVotingDAO");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  const votingAddress = await voting.getAddress();
  console.log("✅ Contract deployed at:", votingAddress);

  // Tambah 2 anggota
  await voting.connect(admin).addMember(member1.address);
  await voting.connect(admin).addMember(member2.address);
  console.log("✅ Members added:", member1.address, member2.address);

  // Buat proposal
  const now = Math.floor(Date.now() / 1000);
  const start = now + 2; // mulai 2 detik dari sekarang
  const end = now + 600; // selesai dalam 10 menit
  const quorum = 50; // 50% anggota harus voting
  const pass = 60; // butuh 60% suara YES untuk lolos

  const tx = await voting
    .connect(member1)
    .createProposal("Should we launch project X?", start, end, quorum, pass);
  await tx.wait();
  console.log("✅ Proposal created");

  // Tunggu sampai waktu voting aktif
  console.log("⏳ Waiting for voting to open...");
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 detik

  // Submit vote (menggunakan hash unik)
  const nullifier1 = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("vote1"));
  const nullifier2 = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("vote2"));

  await voting.connect(member1).submitVote(1, nullifier1, true);
  console.log("🗳️ Member 1 voted YES");

  await voting.connect(member2).submitVote(1, nullifier2, false);
  console.log("🗳️ Member 2 voted NO");

  // Lihat hasilnya
  const result = await voting.getProposalResult(1);
  console.log("📊 Voting result:", result);
}

main().catch((error) => {
  console.error("❌ Error in simulation:", error);
  process.exitCode = 1;
});
