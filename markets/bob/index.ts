import { eBobNetwork, IAaveConfiguration } from "./../../helpers/types";
import AaveMarket from "../aave";
import {
  strategyAAVE,
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
    AAVE: strategyAAVE
  },
  ReserveAssets: {
    [eBobNetwork.testnet]: {
      USDC: "0x14E986C4a733B555c317D95Fe0FC5bFB5a7D166C",
      DAI: "0xcb913C75362A7Fd39de6A5DDE4341F370F5B4419",
      WETH: "0x327E7E4A9e054ecC67dFa9E3Af158347116321Bf",
      AAVE: "0xF1b760dcB43A93694333A0E0ABc20F4D3e611985"
    },
    [eBobNetwork.testnet_old]: {
      USDC: "0x509AeFe02953BC2fB8abCa53Fd83C94D86c05922",
      DAI: "0x4e4e256D3a9789329AB540a7a3b2cd0c03C40431",
      WETH: "0x5546cB953770BA6Aa78FdbaEFB3450F87d97dDBC",
    },
    [eBobNetwork.main]: {
      //TODO: complete with assets
    },
  },
  EModes: {
    StableEMode: {
      id: "1",
      ltv: "9700",
      liquidationThreshold: "9750",
      liquidationBonus: "10100",
      label: "Stablecoins",
      assets: ["USDC", "DAI"],
    },
  },
  ChainlinkAggregator: {
    [eBobNetwork.testnet_old]: {
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
    },
    [eBobNetwork.testnet]: {
      DAI: "0xb062542b2A173fe90E885C1A2bF6C87F842167d0",
      USDC: "0xb062542b2A173fe90E885C1A2bF6C87F842167d0",
      AAVE: "0x61f72e0419c2D3073bA4A78CB3f2075625Ff6f5B",
      WETH: "0x5281b36049dDdcb2161dACab4ec5e80b638459c6",
    },
    [eBobNetwork.main]: {
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
    },
  },
};

export default BobConfig;
