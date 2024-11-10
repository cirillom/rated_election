const { v4: uuidv4 } = require('uuid');

async function main() {
    const contractAddress = "0x05d91B9031A655d08E654177336d08543ac4B711";
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    const contract = IdentityManager.attach(contractAddress);

    const id = uuidv4();
    // const id = 'coloque o id aqui :)';
    const name = "Jo Ueyama";

    const tx = await contract.createIdentity(id, name);
    await tx.wait();

    console.log(`Identidade criada: ${id}, ${name}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });