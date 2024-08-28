import { MOCK_FALLBACK_ORACLE_PRICES, POOL_ADMIN } from "./../../helpers/constants";
import { FORK } from "./../../helpers/hardhat-config-helpers";
import { getFallbackOracle } from "./../../helpers/contract-getters";
import { task } from "hardhat/config";
import { ConfigNames, loadPoolConfig } from "../../helpers";
import { MARKET_NAME } from "../../helpers/env";

task(`initialize-prices-fallback-oracle`)
  .setAction(async (_, hre) => {
    const network = FORK || hre.network.name;
    const config = await loadPoolConfig(MARKET_NAME as ConfigNames);
    const reservesTokens = config.ReserveAssets?.[network] ?? {};

    const fallbackOracle = await getFallbackOracle();

    const promises = Object.keys(reservesTokens).map((tokenSymbol) => 
      fallbackOracle.setAssetPrice(reservesTokens[tokenSymbol], MOCK_FALLBACK_ORACLE_PRICES[tokenSymbol])
    );
  
    await Promise.all(promises);
  });
