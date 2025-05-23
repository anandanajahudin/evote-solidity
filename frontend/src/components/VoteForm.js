import { useState } from "react";

function VoteForm({ contract }) {
  const [proposalId, setProposalId] = useState("");
  const [voteYes, setVoteYes] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fungsi generate nullifierHash (32-byte hex)
  const generateNullifierHash = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return (
      "0x" +
      Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );
  };

  const submitVote = async (e) => {
    e.preventDefault();
    if (!proposalId) {
      alert("Please enter Proposal ID");
      return;
    }
    setSubmitting(true);
    try {
      // Generate nullifierHash di sini, saat tombol submit ditekan
      const nullifierHash = generateNullifierHash();

      const tx = await contract.submitVote(
        Number(proposalId),
        nullifierHash,
        voteYes
      );
      await tx.wait();
      alert("✅ Vote submitted!");
      setProposalId("");
      setVoteYes(true);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit vote");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitVote} style={{ marginTop: "20px" }}>
      <h2>Submit Vote</h2>
      <label>
        Proposal ID:
        <input
          type="number"
          min="1"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
          disabled={submitting}
        />
      </label>
      <div style={{ marginTop: "10px" }}>
        <label style={{ marginRight: "15px" }}>
          <input
            type="radio"
            name="vote"
            value="yes"
            checked={voteYes === true}
            onChange={() => setVoteYes(true)}
            disabled={submitting}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="vote"
            value="no"
            checked={voteYes === false}
            onChange={() => setVoteYes(false)}
            disabled={submitting}
          />
          No
        </label>
      </div>
      <button type="submit" disabled={submitting} style={{ marginTop: "15px" }}>
        {submitting ? "Submitting..." : "Submit Vote"}
      </button>
    </form>
  );
}

export default VoteForm;
