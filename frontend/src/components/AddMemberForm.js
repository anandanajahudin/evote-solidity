import { useState } from "react";

function AddMemberForm({ contract }) {
  const [memberAddress, setMemberAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.addMember(memberAddress);
      await tx.wait();
      alert(`✅ Member ${memberAddress} added successfully.`);
      setMemberAddress("");
    } catch (err) {
      console.error("Add member error:", err);
      alert(err?.reason || err?.message || "❌ Failed to add member.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h2>Add DAO Member (Admin only)</h2>
      <input
        type="text"
        placeholder="0x1234... Ethereum Address"
        value={memberAddress}
        onChange={(e) => setMemberAddress(e.target.value)}
        required
        style={{ width: "300px", padding: "5px" }}
      />
      <button type="submit" style={{ marginLeft: "10px" }}>
        Add
      </button>
    </form>
  );
}

export default AddMemberForm;
