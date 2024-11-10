const { v4: uuidv4 } = require('uuid');

const names = [
    "Ana Silva",
    "Carlos Souza",
    "Maria Oliveira",
    "Lucas Almeida",
    "Fernanda Costa",
    "Roberto Santos",
    "Patrícia Lima",
    "Mariana Ferreira",
    "Diego Ramos",
    "Miguel Henriques",
];

async function main() {
    const contractAddress = "0x05d91B9031A655d08E654177336d08543ac4B711";
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    const contract = IdentityManager.attach(contractAddress);

    for (const name of names) {
        const id = uuidv4();

        const tx = await contract.createIdentity(id, name);
        await tx.wait();

        console.log(`Identidade criada: ${id}, ${name}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });