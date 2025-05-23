import { useState } from "react";

function VoteForm({ contract }) {
  const [proposalId, setProposalId] = useState("");
  const [voteYes, setVoteYes] = useState(true);
  const [nullifierHash, setNullifierHash] = useState("");

  const submitVote = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.submitVote(proposalId, nullifierHash, voteYes);
      await tx.wait();
      alert("Vote submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to vote");
    }
  };

  return (
    <form onSubmit={submitVote}>
      <h2>Submit Vote</h2>
      <input
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        placeholder="Proposal ID"
        required
      />
      <input
        value={nullifierHash}
        onChange={(e) => setNullifierHash(e.target.value)}
        placeholder="Nullifier Hash"
        required
      />
      <label>
        Vote Yes?
        <input
          type="checkbox"
          checked={voteYes}
          onChange={() => setVoteYes(!voteYes)}
        />
      </label>
      <button type="submit">Vote</button>
    </form>
  );
}

export default VoteForm;
