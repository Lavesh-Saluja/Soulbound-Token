// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  const SupplyChainContract = await hre.ethers.getContractFactory("SoulBound");
  const tokenAddress = "0x1B9C02eBD8eb81464d2C262C5Dddd316c867BB0f";
  const contract = await SupplyChainContract.deploy(tokenAddress);
  await contract.deployed();
    console.log("Contract Address", contract.address);//0x7bC303c4D4CB493D650a14C3C347BC810482C302
    console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(40000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: contract.address,
      constructorArguments: [tokenAddress],
    contract: "contracts/SoulBound.sol:SoulBound"
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});