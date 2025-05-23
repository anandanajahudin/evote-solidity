import React, { useEffect, useState } from "react";

const ProposalList = ({ contract, refresh }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contract) return;

    const fetchProposals = async () => {
      setLoading(true);
      try {
        const countBN = await contract.proposalCount();
        // proposalCount biasanya BigNumber, convert ke number
        const count = countBN.toNumber ? countBN.toNumber() : Number(countBN);

        const fetched = [];
        for (let i = 1; i <= count; i++) {
          const proposal = await contract.proposals(i);
          const result = await contract.getProposalResult(i);

          // proposal fields kemungkinan BigNumber, convert ke string/number
          fetched.push({
            id: proposal.id.toNumber
              ? proposal.id.toNumber()
              : Number(proposal.id),
            description: proposal.description,
            voteYes: proposal.voteYes.toNumber
              ? proposal.voteYes.toNumber()
              : Number(proposal.voteYes),
            voteNo: proposal.voteNo.toNumber
              ? proposal.voteNo.toNumber()
              : Number(proposal.voteNo),
            open: proposal.open,
            result,
          });
        }

        setProposals(fetched);
      } catch (err) {
        console.error("Error fetching proposals", err);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [contract, refresh]);

  if (loading) {
    return <p>Loading proposals...</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>🗳️ Proposal List</h2>
      {proposals.length === 0 ? (
        <p>No proposals found.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {proposals.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>Proposal #{p.id}</h3>
              <p>
                <strong>Description:</strong>{" "}
                {p.description || "No description available"}
              </p>
              <p>
                ✅ <strong>Yes:</strong> {p.voteYes} | ❌ <strong>No:</strong>{" "}
                {p.voteNo}
              </p>
              <p>
                📊 <strong>Result:</strong>{" "}
                {p.result === "Accepted"
                  ? "✅ Accepted"
                  : p.result === "Rejected"
                  ? "❌ Rejected"
                  : p.result === "Tie"
                  ? "🤝 Tie"
                  : p.result === "Quorum not met"
                  ? "⚠️ Quorum not met"
                  : "⏳ Pending"}
              </p>
              <p>
                <strong>Status:</strong> {p.open ? "Open" : "Closed"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalList;
