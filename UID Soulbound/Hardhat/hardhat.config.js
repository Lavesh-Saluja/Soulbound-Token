require("@nomiclabs/hardhat-waffle");
// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config({ path: ".env" });

const QUICKNODE_HTTP_URL = process.env.URL;
const PRIVATE_KEY = process.env.KEY;
const POLYGON_KEY = process.env.POLYGON_KEY;

module.exports = {
  solidity: "0.8.15",
  networks: {
    polygonTestnet: {
      url: QUICKNODE_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: POLYGON_KEY,
  },
};