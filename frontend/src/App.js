import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingABI from "./abis/Voting.json";

import CreateProposalForm from "./components/CreateProposalForm";
import VoteForm from "./components/VoteForm";
import ProposalList from "./components/ProposalList";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [refresh, setRefresh] = useState(0); // Trigger refresh untuk update ProposalList

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const newProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await newProvider.getSigner();
          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

          if (!contractAddress) {
            alert("Contract address is not set in .env");
            return;
          }

          const votingContract = new ethers.Contract(
            contractAddress,
            VotingABI.abi,
            signer
          );

          const userAddress = await signer.getAddress();

          setProvider(newProvider);
          setAccount(userAddress);
          setContract(votingContract);
        } catch (error) {
          console.error("Failed to connect MetaMask:", error);
          alert("Failed to connect MetaMask. Please check your wallet.");
        }
      } else {
        alert("MetaMask not found. Please install MetaMask.");
      }
    }

    connectWallet();
  }, []);

  // Fungsi untuk dipassing ke CreateProposalForm supaya refresh ProposalList setelah create proposal
  const handleProposalCreated = () => {
    setRefresh((r) => r + 1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Evote DApp</h1>

      {account ? (
        <p>✅ Connected: {account}</p>
      ) : (
        <p>⏳ Connecting to MetaMask...</p>
      )}

      {!contract ? (
        <p>🔌 Waiting for contract connection...</p>
      ) : (
        <>
          {/* Passing onCreated callback ke CreateProposalForm */}
          <CreateProposalForm
            contract={contract}
            onCreated={handleProposalCreated}
          />
          <VoteForm
            contract={contract}
            onVoteSuccess={() => setRefresh((r) => r + 1)} // trigger refresh setelah vote sukses
          />
          {/* Pastikan ProposalList menerima refresh sebagai dependency */}
          <ProposalList contract={contract} refresh={refresh} />
        </>
      )}
    </div>
  );
}

export default App;
