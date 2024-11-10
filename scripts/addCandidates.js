require('dotenv').config();
const hre = require("hardhat");
const readline = require("readline");

async function main() {
    const { ethers } = hre;

    const CONTRACT_NAME = process.env.CONTRACT_NAME;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (!CONTRACT_NAME || !CONTRACT_ADDRESS) {
        console.error("Please set CONTRACT_NAME and CONTRACT_ADDRESS in your .env file.");
        process.exit(1);
    }

    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();

    const ContractFactory = await ethers.getContractFactory(CONTRACT_NAME);
    const contract = ContractFactory.attach(CONTRACT_ADDRESS).connect(signer);

    let ownerAddress;
    try {
        ownerAddress = await contract.owner();
    } catch (error) {
        console.error("Failed to fetch owner from contract:", error.message);
        process.exit(1);
    }

    // Check if the current signer is the owner
    if (signerAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
        console.error("You are not the deployer/owner of this contract. Only the deployer can add candidates.");
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
        const candidateName = await askQuestion("Enter candidate name (or 0 to finish): ");
        const trimmedName = candidateName.trim();

        if (trimmedName === "0") {
            console.log("Finished adding candidates.");
            break;
        }

        if (trimmedName.length === 0) {
            console.log("Candidate name cannot be empty. Please try again.");
            continue;
        }

        try {
            const tx = await contract.addCandidate(trimmedName);
            console.log(`Submitting transaction to add candidate: ${trimmedName}...`);
            await tx.wait();
            console.log(`Added candidate: ${trimmedName}`);
        } catch (error) {
            console.error(`Failed to add candidate "${trimmedName}":`, error.message);
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