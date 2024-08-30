import { eNetwork } from "./../../helpers/types";
import {
  getPoolConfiguratorProxy,
} from "../../helpers/contract-getters";
import { task } from "hardhat/config";
import { FORK } from "../../helpers/hardhat-config-helpers";

task(`remove-atokens`, ``)
  .addParam("address")
  .setAction(
    async (
      { address }: { address: string },
      { deployments, getNamedAccounts, ...hre }
    ) => {
      const poolConfig = await getPoolConfiguratorProxy();

      const tx = await poolConfig.dropReserve(address, {
        gasLimit: 5000000,
      });

      console.log(tx.hash);

      await tx.wait();

      console.log("done!");
    }
  );