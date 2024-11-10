require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, BESU_RPC_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.2",
  networks: {
    besu: {
      url: BESU_RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
