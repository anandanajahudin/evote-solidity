import { useState } from "react";

function CreateProposalForm({ contract }) {
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quorum, setQuorum] = useState(50);
  const [passPct, setPassPct] = useState(50);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = Math.floor(new Date(start).getTime() / 1000);
    const endTime = Math.floor(new Date(end).getTime() / 1000);
    try {
      const tx = await contract.createProposal(
        description,
        startTime,
        endTime,
        quorum,
        passPct
      );
      await tx.wait();
      alert("Proposal created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create proposal");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Proposal</h2>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        required
      />
      <input
        type="number"
        value={quorum}
        onChange={(e) => setQuorum(e.target.value)}
        placeholder="Quorum %"
        required
      />
      <input
        type="number"
        value={passPct}
        onChange={(e) => setPassPct(e.target.value)}
        placeholder="Pass %"
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateProposalForm;
