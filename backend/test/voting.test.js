const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZKLiteVotingDAO", function () {
  let Voting, voting, admin, member1, member2;
  const quorum = 50; // Persentase quorum
  const pass = 60; // Persentase pass (jika lebih dari 60% YES, proposal diterima)

  beforeEach(async () => {
    // Mendapatkan akun yang dibutuhkan
    [admin, member1, member2] = await ethers.getSigners();

    // Deploy kontrak Voting
    Voting = await ethers.getContractFactory("ZKLiteVotingDAO");
    voting = await Voting.deploy();
    await voting.waitForDeployment();

    // Menambahkan member
    await voting.connect(admin).addMember(member1.address);
    await voting.connect(admin).addMember(member2.address);
  });

  it("should allow members to create proposal and vote", async () => {
    const now = Math.floor(Date.now() / 1000); // Mendapatkan timestamp saat ini
    const start = now + 2; // Voting dimulai 2 detik setelah sekarang
    const end = now + 600; // Voting berakhir 600 detik setelah mulai

    // Membuat proposal
    await voting
      .connect(member1)
      .createProposal("Proposal 1", start, end, quorum, pass);

    // Tunggu hingga voting bisa dimulai
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Tunggu 3 detik untuk memulai voting

    const nullifier1 = ethers.keccak256(ethers.toUtf8Bytes("vote1"));
    const nullifier2 = ethers.keccak256(ethers.toUtf8Bytes("vote2"));

    // Member 1 memberi suara YES
    await voting.connect(member1).submitVote(1, nullifier1, true);

    // Member 2 memberi suara NO
    await voting.connect(member2).submitVote(1, nullifier2, false);

    // Memeriksa hasil voting
    const result = await voting.getProposalResult(1);
    expect(result).to.equal("Rejected"); // Karena YES = 1 dan NO = 1, dengan passPct = 60%, hasilnya harus "Rejected"
  });

  it("should reject double voting with same nullifier", async () => {
    const now = Math.floor(Date.now() / 1000); // Mendapatkan timestamp saat ini
    const start = now + 2; // Voting dimulai 2 detik setelah sekarang
    const end = now + 600; // Voting berakhir 600 detik setelah mulai

    // Membuat proposal
    await voting
      .connect(member1)
      .createProposal("Proposal 2", start, end, quorum, pass);

    // Tunggu hingga voting bisa dimulai
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Tunggu 3 detik untuk memulai voting

    const nullifier = ethers.keccak256(ethers.toUtf8Bytes("voteX"));

    // Member 1 memberi suara YES
    await voting.connect(member1).submitVote(1, nullifier, true);

    // Menolak double vote dari member 2 dengan nullifier yang sama
    await expect(
      voting.connect(member2).submitVote(1, nullifier, false)
    ).to.be.revertedWith("Double vote");
  });

  it("should not allow vote before start or after end", async () => {
    const now = Math.floor(Date.now() / 1000); // Mendapatkan timestamp saat ini
    const start = now + 10; // Voting dimulai 10 detik setelah sekarang
    const end = now + 15; // Voting berakhir 15 detik setelah mulai

    // Membuat proposal
    await voting
      .connect(member1)
      .createProposal("Proposal 3", start, end, quorum, pass);

    // Pastikan voting belum bisa dilakukan (waktu terlalu awal)
    const earlyHash = ethers.keccak256(ethers.toUtf8Bytes("early"));

    // Tunggu hingga voting bisa dimulai (pastikan waktu mulai setelah 10 detik)
    await new Promise((resolve) => setTimeout(resolve, 12000)); // Tunggu hingga start + 10 detik

    // Member 1 memberi suara YES setelah voting dimulai
    await voting.connect(member1).submitVote(1, earlyHash, true);

    // Tunggu lebih lama (setelah waktu berakhir)
    const lateHash = ethers.keccak256(ethers.toUtf8Bytes("late"));
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Tunggu 5 detik setelah voting ditutup

    // Pastikan voting ditolak setelah waktu berakhir
    await expect(
      voting.connect(member1).submitVote(1, lateHash, true)
    ).to.be.revertedWith("Too late"); // Ini memastikan bahwa voting tidak bisa dilakukan setelah waktu berakhir
  });

  it("should return 'Quorum not met' if votes < quorum", async () => {
    const now = Math.floor(Date.now() / 1000); // Mendapatkan timestamp saat ini
    const start = now + 2; // Voting dimulai 2 detik setelah sekarang
    const end = now + 600; // Voting berakhir 600 detik setelah mulai

    // Membuat proposal dengan quorum 100% (hanya 1 suara yang dibutuhkan)
    await voting.connect(member1).createProposal(
      "Proposal 4",
      start,
      end,
      100, // quorum 100%
      50 // pass 50%
    );

    // Tunggu hingga voting bisa dimulai
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Tunggu 3 detik untuk memulai voting

    const hash = ethers.keccak256(ethers.toUtf8Bytes("only1vote"));

    // Member 1 memberi suara YES
    await voting.connect(member1).submitVote(1, hash, true);

    // Memeriksa hasil voting setelah quorum tidak tercapai
    const result = await voting.getProposalResult(1);
    expect(result).to.equal("Quorum not met"); // Karena hanya ada 1 suara, quorum 100% tidak tercapai
  });
});
