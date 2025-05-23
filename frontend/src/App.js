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

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const newProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await newProvider.getSigner();
          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

          if (!contractAddress) {
            alert("Kontrak address belum diatur di .env");
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
          console.error("❌ Gagal koneksi MetaMask:", error);
          alert("Gagal menghubungkan MetaMask. Pastikan MetaMask aktif.");
        }
      } else {
        alert("❗ MetaMask tidak ditemukan. Harap instal MetaMask.");
      }
    }

    connectWallet();
  }, []);

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
          <CreateProposalForm contract={contract} />
          <VoteForm contract={contract} />
          <ProposalList contract={contract} />
        </>
      )}
    </div>
  );
}

export default App;
