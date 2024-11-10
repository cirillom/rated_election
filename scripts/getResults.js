// scripts/getResults.js
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

    const winner = await ratedElection.getWinner();
    console.log("Election Winner:");
    console.log(`Name: ${winner.winnerName}`);
    console.log(`Total Rating: ${winner.winnerRating}`);
    console.log("-----------------------------------");
    console.log("");

    const candidates = await ratedElection.getAllCandidates();

    const candidatesWithAvg = candidates.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        totalRating: Number(candidate.totalRating.toString()),
    }));

    candidatesWithAvg.sort((a, b) => b.totalRating - a.totalRating);

    console.log("Candidates Sorted by Total Rating (Highest to Lowest):");
    candidatesWithAvg.forEach((candidate, index) => {
        console.log(`${index + 1}º: ${candidate.name} (${candidate.totalRating})`);
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
