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
  ReserveAssets: {
    [eBobNetwork.testnet]: {
      // USDT: "0x763A9126B8cc85E50592e1705858f6338E7732f7",
      USDC: "0x14E986C4a733B555c317D95Fe0FC5bFB5a7D166C",
      DAI: "0xcb913C75362A7Fd39de6A5DDE4341F370F5B4419",
      WETH: "0x8CEc2719a2e896A11eA3f10406EfDb6Ad87281D9",
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
      DAI: "0x009a8793e5f751A76d627b3c6aDC620b46385e70",
      USDC: "0x009a8793e5f751A76d627b3c6aDC620b46385e70",
      WETH: "0x009a8793e5f751A76d627b3c6aDC620b46385e70",
    },
    [eBobNetwork.main]: {
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
    },
  },
};

export default BobConfig;
