import { task } from "hardhat/config";

task('drop-reserve', 'Drops a reserve from the pool')
  .addParam('reserve', 'The address of the reserve to drop')
  .setAction(async (taskArgs: { reserve: string }, hre) => {
  console.log(`\n- Dropping reserve from the pool:`, taskArgs.reserve);

  // Get PoolConfigurator instance
  const { getPoolConfiguratorProxy, waitForTx } = require('../../helpers');

  // Get the PoolConfigurator contract
  const poolConfigurator = await getPoolConfiguratorProxy();

  // Placeholder: replace 'dropReserve' with the actual method name if different
  const reserveAddress = taskArgs.reserve;
  if (!reserveAddress) {
    throw new Error('Missing required argument: reserve');
  }
  const tx = await waitForTx(await poolConfigurator.dropReserve(reserveAddress));

  console.log(`Finished dropping reserve. Tx hash: ${tx.transactionHash}`);
});
