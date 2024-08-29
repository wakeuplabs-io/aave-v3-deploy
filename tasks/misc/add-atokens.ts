import { eNetwork } from "./../../helpers/types";
import {
  getReserveAddresses,
  loadPoolConfig,
} from "../../helpers/market-config-helpers";
import { task } from "hardhat/config";
import {
  getAddressFromJson,
} from "../../helpers/utilities/tx";
import { MARKET_NAME } from "../../helpers/env";
import { FORK } from "../../helpers/hardhat-config-helpers";
import {
  INCENTIVES_PROXY_ID,
  TREASURY_PROXY_ID,
  initReservesByHelper,
} from "../../helpers";

task(`add-atokens`, ``).setAction(
  async (_, { deployments, getNamedAccounts, ...hre }) => {
    const network = FORK ? FORK : (hre.network.name as eNetwork);

    const { deployer } = await getNamedAccounts();

    const poolConfig = await loadPoolConfig(MARKET_NAME);

    const reservesAddresses = await getReserveAddresses(poolConfig, network);

    const treasuryAddress = await getAddressFromJson(
      network,
      TREASURY_PROXY_ID
    );

    const incentivesController = await getAddressFromJson(
      network,
      INCENTIVES_PROXY_ID
    );

    await initReservesByHelper(
      poolConfig.ReservesConfig,
      reservesAddresses,
      poolConfig.ATokenNamePrefix,
      poolConfig.StableDebtTokenNamePrefix,
      poolConfig.VariableDebtTokenNamePrefix,
      poolConfig.SymbolPrefix,
      deployer,
      treasuryAddress,
      incentivesController,
    );
  }
);