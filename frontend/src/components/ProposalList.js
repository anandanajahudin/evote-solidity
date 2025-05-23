import React, { useEffect, useState } from "react";

const ProposalList = ({ contract }) => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const count = await contract.proposalCount();

        const fetched = [];
        for (let i = 1; i <= count; i++) {
          const proposal = await contract.proposals(i);
          const result = await contract.getProposalResult(i);
          fetched.push({ ...proposal, result });
        }

        setProposals(fetched);
      } catch (err) {
        console.error("Error fetching proposals", err);
      }
    };

    if (contract) fetchProposals();
  }, [contract]);

  return (
    <div>
      <h2>Proposal List</h2>
      {proposals.length === 0 ? (
        <p>No proposals found.</p>
      ) : (
        <ul>
          {proposals.map((p) => (
            <li key={p.id}>
              <strong>ID #{p.id}</strong>: {p.description} <br />✅ Yes:{" "}
              {p.voteYes.toString()} | ❌ No: {p.voteNo.toString()} <br />
              📊 Result: {p.result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProposalList;
