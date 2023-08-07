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
  const uri = "https://ipfs.io/ipfs/QmWiiXXcPp7MzGHouXZV4f1j5irfwq3BZrNjP8B253p8Zz/";
  const contract = await SupplyChainContract.deploy(tokenAddress,uri);
  await contract.deployed();
    console.log("Contract Address", contract.address);//0xf586A6F38C49E2772Ce0a36b003C4648B824Ad58
    console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(40000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: contract.address,
      constructorArguments: [tokenAddress,uri],
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