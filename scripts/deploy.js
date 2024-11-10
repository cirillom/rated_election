async function main() {
    const IdentityManager = await ethers.deployContract("IdentityManager");
    await IdentityManager.waitForDeployment();
    console.log("Contrato implantado em: ", IdentityManager.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });