import { useState } from "react";

function CreateProposalForm({ contract, onCreated }) {
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quorum, setQuorum] = useState(50);
  const [passPct, setPassPct] = useState(50);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Konversi waktu ke detik (timestamp)
    const startTime = Math.floor(new Date(start).getTime() / 1000);
    const endTime = Math.floor(new Date(end).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);

    // Validasi input
    if (!description.trim()) {
      alert("Description is required.");
      return;
    }
    if (startTime <= now) {
      alert("Start time must be in the future.");
      return;
    }
    if (endTime <= startTime) {
      alert("End time must be after start time.");
      return;
    }
    if (quorum <= 0 || quorum > 100 || passPct <= 0 || passPct > 100) {
      alert("Quorum and pass percentage must be between 1 and 100.");
      return;
    }

    try {
      const tx = await contract.createProposal(
        description,
        startTime,
        endTime,
        quorum,
        passPct
      );
      await tx.wait();
      alert("✅ Proposal created successfully!");
      // Reset form
      setDescription("");
      setStart("");
      setEnd("");
      setQuorum(50);
      setPassPct(50);

      if (onCreated) onCreated(); // beri tahu parent untuk refresh list
    } catch (err) {
      console.error("❌ Error creating proposal:", err);
      alert(
        "Failed to create proposal. Make sure you have permission and enough ETH."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h2>Create Proposal</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Proposal Description"
          required
        />
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </label>
        <label>
          End Time:
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </label>
        <label>
          Quorum (%):
          <input
            type="number"
            min="1"
            max="100"
            value={quorum}
            onChange={(e) => setQuorum(Number(e.target.value))}
            required
          />
        </label>
        <label>
          Pass Percentage (%):
          <input
            type="number"
            min="1"
            max="100"
            value={passPct}
            onChange={(e) => setPassPct(Number(e.target.value))}
            required
          />
        </label>
        <button type="submit">🚀 Create Proposal</button>
      </div>
    </form>
  );
}

export default CreateProposalForm;
