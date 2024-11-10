async function main() {
    const RatedElection = await ethers.deployContract(process.env.CONTRACT_NAME);
    await RatedElection.waitForDeployment();
    console.log("Contrato implantado em: ", RatedElection.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });