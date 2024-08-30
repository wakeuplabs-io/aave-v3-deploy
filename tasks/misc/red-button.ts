import { task } from "hardhat/config";
import {
  getPoolConfiguratorProxy,
} from "../../helpers/contract-getters";
import { waitForTx } from "../../helpers/utilities/tx";

task(`red-button`, `Enable/Disable reserve assets`)
  .addFlag("enable", "Enable reserve assets")
  .addFlag("disable", "Disable reserve assets")
  .addOptionalParam("asset", "Address of the asset")
  .setAction(
    async (
      {
        enable,
        disable,
        asset,
      }: { enable: boolean; disable: boolean; asset?: string },
      hre
    ) => {
      if (!enable && !disable) {
        console.log("Missing flag enable or disable.", enable, disable);
        return;
      }

      let paused = false;
      if (enable) paused = false;
      if (disable) paused = true;

      const { deployer } = await hre.getNamedAccounts();
      const signer = await hre.ethers.getSigner(deployer);

      const poolConfiguratorProxyContract = await getPoolConfiguratorProxy();

      if (!asset) {
        console.log(
          enable
            ? `Enabling all reserve assets...`
            : `Disabling all reserve assets...`
        );

        await waitForTx(
          await poolConfiguratorProxyContract
            .connect(signer)
            .setPoolPause(paused)
        );

        console.log(`Success`);

        return;
      }

      console.log(
        enable
          ? `Enabling ${asset} reserve asset...`
          : `Disabling ${asset} reserve asset...`
      );

      await waitForTx(
        await poolConfiguratorProxyContract
          .connect(signer)
          .setReservePause(asset, paused)
      );

      console.log(`Success`);
    }
  );