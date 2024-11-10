// scripts/addVoters.js

require('dotenv').config();
const readline = require("readline");

async function main() {
    const CONTRACT_NAME = process.env.CONTRACT_NAME;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (!CONTRACT_NAME || !CONTRACT_ADDRESS) {
        console.error("Please set CONTRACT_NAME and CONTRACT_ADDRESS in your .env file.");
        process.exit(1);
    }
    
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();

    const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME, signer);
    const contract = ContractFactory.attach(CONTRACT_ADDRESS);

    let ownerAddress;
    try {
        ownerAddress = await contract.owner();
    } catch (error) {
        console.error("Failed to fetch owner from contract:", error.message);
        process.exit(1);
    }

    if (signerAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
        console.error("You are not the deployer/owner of this contract. Only the deployer can add voters.");
        process.exit(1);
    }

    console.log(`Authenticated as deployer: ${signerAddress}`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askQuestion = (query) => {
        return new Promise(resolve => rl.question(query, resolve));
    };

    while (true) {
        const voterAddress = await askQuestion("Enter voter address (or 0 to finish): ");
        const trimmedAddress = voterAddress.trim();

        if (trimmedAddress === "0") {
            console.log("Finished adding voters.");
            break;
        }

        let valid_address;
        try {
            valid_address = ethers.getAddress(trimmedAddress);
        } catch (error) {
            console.log("Invalid Ethereum address. Please try again.");
            continue;
        }

        try {
            const tx = await contract.addVoter(valid_address);
            console.log(`Submitting transaction to add voter: ${valid_address}...`);
            await tx.wait();
            console.log(`Added voter: ${valid_address}`);
        } catch (error) {
            console.error(`Failed to add voter "${valid_address}":`, error.message);
        }
    }

    rl.close();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in script execution:", error);
        process.exit(1);
    });
