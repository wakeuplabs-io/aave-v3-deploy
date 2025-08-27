import { task } from "hardhat/config";

task(
  `deploy-mockAggregator`,
  `Deploys the MockAggregator contract`
).setAction(async (_, hre) => {
  if (!hre.network.config.chainId) {
    throw new Error("INVALID_CHAIN_ID");
  }

  console.log(`\n- MockAggregator deployment`);
  const { deployer } = await hre.getNamedAccounts();
  const artifact = await hre.deployments.deploy("MockAggregator", {
    from: deployer,
    args: [hre.ethers.BigNumber.from('3000').mul(hre.ethers.BigNumber.from('10').pow(8))],
  });

  console.log("MockAggregator deployed at:", artifact.address);
  console.log(`\tFinished MockAggregator deployment`);
});
