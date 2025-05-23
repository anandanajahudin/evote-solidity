import { useState } from "react";

function VoteForm({ contract }) {
  const [proposalId, setProposalId] = useState("");
  const [voteYes, setVoteYes] = useState(true);
  const [nullifierHash, setNullifierHash] = useState("");

  const submitVote = async (e) => {
    e.preventDefault();

    if (!/^0x[0-9a-fA-F]{64}$/.test(nullifierHash)) {
      alert(
        "❗ Nullifier Hash must be a valid 0x-prefixed 32-byte hex string."
      );
      return;
    }

    try {
      const tx = await contract.submitVote(
        Number(proposalId),
        nullifierHash,
        voteYes
      );
      await tx.wait();
      alert("✅ Vote submitted!");
    } catch (err) {
      console.error(err);
      alert(
        "❌ Failed to vote. Please check the proposal ID, hash, or your membership."
      );
    }
  };

  return (
    <form
      onSubmit={submitVote}
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        🗳️ Submit Vote
      </h2>

      <label style={{ display: "block", marginBottom: "10px", color: "#555" }}>
        Proposal ID:
        <input
          type="number"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          placeholder="Enter proposal ID"
          required
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "10px", color: "#555" }}>
        Nullifier Hash:
        <input
          value={nullifierHash}
          onChange={(e) => setNullifierHash(e.target.value)}
          placeholder="0x..."
          required
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontFamily: "monospace",
          }}
        />
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          color: "#555",
        }}
      >
        <input
          type="checkbox"
          checked={voteYes}
          onChange={() => setVoteYes(!voteYes)}
          style={{ marginRight: "10px" }}
        />
        Vote Yes
      </label>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit Vote
      </button>
    </form>
  );
}

export default VoteForm;
