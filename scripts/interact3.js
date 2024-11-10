// Identidade criada: 1245afe3-d7d6-4acf-966e-ac95dfbd7f0c, Ana Silva
// Identidade criada: 9aa4c89e-1157-40d4-b0f9-fa5ea57e561c, Carlos Souza
// Identidade criada: 338480a6-1824-40f7-bc9e-1c946f865e0e, Maria Oliveira
// Identidade criada: efb6137f-3fac-445b-91b5-5da1c21e55a8, Lucas Almeida
// Identidade criada: 23daef15-c36b-4049-9d37-564d844e8f38, Fernanda Costa
// Identidade criada: 85e6d975-51b3-4f36-b51c-b39a8936ee98, Roberto Santos
// Identidade criada: c7c0305b-624a-40a2-b427-5752dee8fc33, Patrícia Lima
// Identidade criada: 10ec01cf-f1e4-437f-824f-8728b57702d5, Mariana Ferreira
// Identidade criada: dc3de7ba-6a1f-4f75-beed-c2a92e101c5e, Diego Ramos
// Identidade criada: 8e1162e5-1659-4689-9cbb-8aba753aa858, Miguel Henriques

async function main() {
    const contractAddress = "0x05d91B9031A655d08E654177336d08543ac4B711";
    const IdentityManager = await ethers.getContractFactory("IdentityManager");
    const contract = IdentityManager.attach(contractAddress);

    const id = '8e1162e5-1659-4689-9cbb-8aba753aa858';

    try {
        const name = await contract.getNameFromId(id);
        console.log(`Nome recuperado para o ID ${id}: ${name}`);
    } catch (error) {
        console.error("Erro ao recuperar o nome:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });