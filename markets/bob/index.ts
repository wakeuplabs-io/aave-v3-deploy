import { eBobNetwork, IAaveConfiguration } from "./../../helpers/types";
import AaveMarket from "../aave";
import {
  strategyDAI,
  strategyUSDC,
  strategyWETH,
} from "./reservesConfig";
import { ZERO_ADDRESS } from "../../helpers";

export const BobConfig: IAaveConfiguration = {
  ...AaveMarket,
  TestnetMarket: false,
  ProviderId: 111,
  MarketId: "Build on Bitcoin",
  WrappedNativeTokenSymbol: "WETH",
  ReservesConfig: {
    DAI: strategyDAI,
    USDC: strategyUSDC,
    WETH: strategyWETH,
  },
  ReserveFactorTreasuryAddress: {
    // [eBobNetwork.testnet]: "0xb7ba1Dea4a3745e58959a2091b47096cc197be5A", // config just mainnet. testnet is deployer (01_treasury.ts)
  },
  ParaswapRegistry: {
    // [eBobNetwork.testnet]: "0xb7ba1Dea4a3745e58959a2091b47096cc197be5A",
  },
  ReserveAssets: {
    // [eBobNetwork.main]: {
    // },
    [eBobNetwork.testnet]: {
      // USDC: ZERO_ADDRESS,
      // DAI: ZERO_ADDRESS,
      // WETH: ZERO_ADDRESS,
      USDC: "0x509AeFe02953BC2fB8abCa53Fd83C94D86c05922",
      DAI: "0x4e4e256D3a9789329AB540a7a3b2cd0c03C40431",
      WETH: "0x936EA1bCF82Fbc1Dbe24c6AA140f136A7De15C2E",
    },
  },
  EModes: {
  },
  ChainlinkAggregator: {
    [eBobNetwork.testnet]: {
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
    },
  },
};

export default BobConfig;
