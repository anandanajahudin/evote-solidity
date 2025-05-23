# eVote - Decentralized Voting Application

**eVote** is a decentralized voting application (DApp) built using Solidity smart contracts and a React.js frontend. This project enables users to vote securely and transparently on the blockchain.

## Key Features

- **Decentralized Voting**: Ensures vote integrity without third-party interference.
- **Vote Delegation**: Users can delegate their votes to others.
- **Chairperson Role**: The chairperson can grant voting rights to users.
- **Interactive User Interface**: Built with React.js for a responsive and intuitive user experience.

## Technologies Used

- [Solidity](https://soliditylang.org/): Smart contract programming language.
- [Hardhat](https://hardhat.org/): Ethereum development environment.
- [React.js](https://reactjs.org/): JavaScript library for building user interfaces.
- [Ethers.js](https://docs.ethers.io/): Library for interacting with the Ethereum blockchain.
- [MetaMask](https://metamask.io/): Crypto wallet for managing Ethereum accounts.

## Project Structure

evote-solidity/
├── backend/ # Solidity smart contracts and Hardhat scripts
├── frontend/ # React.js application
├── server/ # Backend server (if any)
├── README.md # Project documentation
└── .gitignore # Git ignore file

## Installation and Usage

### Prerequisites

- Node.js and npm
- MetaMask
- Hardhat

### Setup Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/anandanajahudin/evote-solidity.git
   cd evote-solidity

   ```

2. **Install Dependencies**

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install

   ```

3. **Start a Local Hardhat Node**

   ```bash
   cd ../backend
   npx hardhat node

   ```

4. **Deploy Smart Contract**

   ```bash
   cd backend
   npx hardhat run scripts/deploy.js --network localhost

   ```

5. **Configure the Frontend**

- Copy the ABI from backend/artifacts/contracts/YourContract.sol/YourContract.json to frontend/src/ABI/YourContract.json.

- Create a contract-address.json file in frontend/src/ABI/ with the following content:

  ```bash
  {
  "YourContract": "YOUR_CONTRACT_ADDRESS"
  }
  ```

6. **Run the Frontend**
   ```bash
   npm start
   ```
   Access the app at http://localhost:3000.
