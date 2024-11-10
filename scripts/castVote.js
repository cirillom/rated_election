// scripts/castVote.js

const hre = require("hardhat");
const readline = require("readline");

// Function to prompt user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

async function main() {
    const CONTRACT_NAME = process.env.CONTRACT_NAME;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (!CONTRACT_NAME || !CONTRACT_ADDRESS) {
        console.error("Please set CONTRACT_NAME and CONTRACT_ADDRESS in your .env file.");
        process.exit(1);
    }

    const RatedElection = await ethers.getContractFactory(CONTRACT_NAME);
    const contractAddress = CONTRACT_ADDRESS;
    const ratedElection = RatedElection.attach(contractAddress);

    const candidates = await ratedElection.getAllCandidates();
    console.log("Candidates:");
    candidates.forEach(candidate => {
        console.log(`ID: ${candidate.id}, Name: ${candidate.name}`);
    });

    const privateKeyInput = await askQuestion("\nEnter your private key (without 0x): ");
    const privateKey = privateKeyInput.trim();

    if (!/^([A-Fa-f0-9]{64})$/.test(privateKey)) {
        console.log("Invalid private key format.");
        rl.close();
        return;
    }

    const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider);
    const voterAddress = await wallet.getAddress();

    const isAuthorized = await ratedElection.authorizedVoters(voterAddress);
    if (!isAuthorized) {
        console.log(`Address ${voterAddress} is not authorized to vote.`);
        rl.close();
        return;
    }

    console.log(`\nCasting votes for voter: ${voterAddress}`);
    const contractWithSigner = ratedElection.connect(wallet);
    for (const candidate of candidates) {
        let rating;
        while (true) {
            const answer = await askQuestion(`Enter rating for ${candidate.name} (0-10): `);
            rating = parseInt(answer);
            if (!isNaN(rating) && rating >= 0 && rating <= 10) {
                break;
            }
            console.log("Invalid rating. Please enter a number between 0 and 10.");
        }

        try {
            const tx = await contractWithSigner.rateCandidate(candidate.id, rating);
            await tx.wait();
            console.log(`Rated ${candidate.name} with ${rating}`);
        } catch (error) {
            console.error(`Failed to rate ${candidate.name}:`, error.message);
        }
    }

    rl.close();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
