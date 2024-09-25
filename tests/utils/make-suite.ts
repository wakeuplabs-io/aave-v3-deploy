import {
  ConfigNames,
  isTestnetMarket,
  loadPoolConfig,
} from "./../../helpers/market-config-helpers";
import { Signer } from "ethers";
import { evmRevert, evmSnapshot } from "../../helpers/utilities/tx";
import { tEthereumAddress } from "../../helpers/types";
import { IPriceOracle, Pool, UiPoolDataProviderV3 } from "../../typechain";
import { AaveProtocolDataProvider } from "../../typechain";
import { AToken } from "../../typechain";
import { PoolConfigurator } from "../../typechain";

import { parseEther } from "ethers/lib/utils";
import { PoolAddressesProvider } from "../../typechain";
import { PoolAddressesProviderRegistry } from "../../typechain";
import {
  AaveOracle,
  IERC20,
  StableDebtToken,
  VariableDebtToken,
  WETH9,
  WrappedTokenGatewayV3,
  Faucet,
} from "../../typechain";
import {
  FALLBACK_ORACLE_ID,
  ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
  POOL_CONFIGURATOR_PROXY_ID,
  POOL_DATA_PROVIDER,
  POOL_PROXY_ID,
} from "../../helpers/deploy-ids";
import {
  getAToken,
  getERC20,
  getFaucet,
  getStableDebtToken,
  getVariableDebtToken,
  getWETH,
} from "../../helpers/contract-getters";

import { ethers, deployments } from "hardhat";
import { getEthersSigners } from "../../helpers/utilities/signer";
import { MARKET_NAME } from "../../helpers/env";

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  deployer: SignerWithAddress;
  poolAdmin: SignerWithAddress;
  emergencyAdmin: SignerWithAddress;
  riskAdmin: SignerWithAddress;
  users: SignerWithAddress[];
  pool: Pool;
  configurator: PoolConfigurator;
  oracle: AaveOracle;
  helpersContract: AaveProtocolDataProvider;
  weth: WETH9;
  aWETH: AToken;
  variableDebtWeth: VariableDebtToken;
  dai: IERC20;
  aDai: AToken;
  variableDebtDai: VariableDebtToken;
  stableDebtDai: StableDebtToken;
  aUsdc: AToken;
  variableDebtUsdc: VariableDebtToken;
  stableDebtUsdc: StableDebtToken;
  usdc: IERC20;
  aave: IERC20;
  addressesProvider: PoolAddressesProvider;
  registry: PoolAddressesProviderRegistry;
  wrappedTokenGateway: WrappedTokenGatewayV3;
  faucetOwnable: Faucet;
  uiPoolDataProvider: UiPoolDataProviderV3;
}

let HardhatSnapshotId: string = "0x1";
const setHardhatSnapshotId = (id: string) => {
  HardhatSnapshotId = id;
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  poolAdmin: {} as SignerWithAddress,
  emergencyAdmin: {} as SignerWithAddress,
  riskAdmin: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  pool: {} as Pool,
  configurator: {} as PoolConfigurator,
  helpersContract: {} as AaveProtocolDataProvider,
  oracle: {} as AaveOracle,
  weth: {} as WETH9,
  aWETH: {} as AToken,
  variableDebtWeth: {} as VariableDebtToken,
  dai: {} as IERC20,
  aDai: {} as AToken,
  variableDebtDai: {} as VariableDebtToken,
  stableDebtDai: {} as StableDebtToken,
  aUsdc: {} as AToken,
  usdc: {} as IERC20,
  aave: {} as IERC20,
  addressesProvider: {} as PoolAddressesProvider,
  registry: {} as PoolAddressesProviderRegistry,
  wrappedTokenGateway: {} as WrappedTokenGatewayV3,
  faucetOwnable: {} as Faucet,
} as TestEnv;

export async function initializeMakeSuite() {
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const [_deployer, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }

  const wrappedTokenGatewayArtifact = await deployments.get(
    "WrappedTokenGatewayV3"
  );
  const poolArtifact = await deployments.get(POOL_PROXY_ID);
  const configuratorArtifact = await deployments.get(
    POOL_CONFIGURATOR_PROXY_ID
  );
  const addressesProviderArtifact = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );
  const addressesPoolDataProviderArtifact = await deployments.get(
    "UiPoolDataProviderV3"
  );
  const addressesProviderRegistryArtifact = await deployments.get(
    "PoolAddressesProviderRegistry"
  );
  const priceOracleArtifact = await deployments.get(ORACLE_ID);
  const dataProviderArtifact = await deployments.get(POOL_DATA_PROVIDER);

  testEnv.deployer = deployer;
  testEnv.poolAdmin = deployer;
  testEnv.emergencyAdmin = testEnv.users[1];
  testEnv.riskAdmin = testEnv.users[2];
  testEnv.wrappedTokenGateway = (await ethers.getContractAt(
    "WrappedTokenGatewayV3",
    wrappedTokenGatewayArtifact.address
  )) as WrappedTokenGatewayV3;
  testEnv.pool = (await ethers.getContractAt(
    "Pool",
    poolArtifact.address
  )) as Pool;

  testEnv.configurator = (await ethers.getContractAt(
    "PoolConfigurator",
    configuratorArtifact.address
  )) as PoolConfigurator;

  testEnv.addressesProvider = (await ethers.getContractAt(
    "PoolAddressesProvider", addressesProviderArtifact.address
  )) as PoolAddressesProvider;

  testEnv.uiPoolDataProvider = (await ethers.getContractAt(
    "UiPoolDataProviderV3",
    addressesPoolDataProviderArtifact.address
  )) as UiPoolDataProviderV3;

  testEnv.registry = (await ethers.getContractAt("PoolAddressesProviderRegistry", addressesProviderRegistryArtifact.address)) as PoolAddressesProviderRegistry;
  testEnv.oracle = (await ethers.getContractAt(
    "AaveOracle",
    priceOracleArtifact.address
  )) as AaveOracle;

  testEnv.helpersContract = (await ethers.getContractAt(
    dataProviderArtifact.abi,
    dataProviderArtifact.address
  )) as AaveProtocolDataProvider;

  const allTokens = await testEnv.helpersContract.getAllATokens();
  const aDaiAddress = allTokens.find(
    (aToken) => aToken.symbol === "aEthDAI"
  )?.tokenAddress;
  const aUsdcAddress = allTokens.find(
    (aToken) => aToken.symbol === "aEthUSDC"
  )?.tokenAddress;
  const aWEthAddress = allTokens.find(
    (aToken) => aToken.symbol === "aEthWETH"
  )?.tokenAddress;

  const reservesTokens = await testEnv.helpersContract.getAllReservesTokens();

  const daiAddress = reservesTokens.find(
    (token) => token.symbol === "DAI"
  )?.tokenAddress;
  const {
    variableDebtTokenAddress: variableDebtDaiAddress,
    stableDebtTokenAddress: stableDebtDaiAddress,
  } = await testEnv.helpersContract.getReserveTokensAddresses(daiAddress || "");
  const usdcAddress = reservesTokens.find(
    (token) => token.symbol === "USDC"
  )?.tokenAddress;
  const {
    variableDebtTokenAddress: variableDebtUsdcAddress,
    stableDebtTokenAddress: stableDebtUsdcAddress,
  } = await testEnv.helpersContract.getReserveTokensAddresses(usdcAddress || "");

  const aaveAddress = reservesTokens.find(
    (token) => token.symbol === "AAVE"
  )?.tokenAddress;
  const wethAddress = reservesTokens.find(
    (token) => token.symbol === "WETH"
  )?.tokenAddress;

  const {
    variableDebtTokenAddress: variableDebtWEthAddress,
  } = await testEnv.helpersContract.getReserveTokensAddresses(wethAddress || "");

  if (!aDaiAddress || !aWEthAddress || !aUsdcAddress) {
    process.exit(1);
  }
  if (!daiAddress || !usdcAddress || !wethAddress) {
    process.exit(1);
  }

  testEnv.aDai = await getAToken(aDaiAddress);
  testEnv.variableDebtDai = await getVariableDebtToken(variableDebtDaiAddress);
  testEnv.variableDebtWeth = await getVariableDebtToken(variableDebtWEthAddress);
  testEnv.stableDebtDai = await getStableDebtToken(stableDebtDaiAddress);
  testEnv.aUsdc = await getAToken(aUsdcAddress);
  testEnv.variableDebtUsdc = await getVariableDebtToken(variableDebtUsdcAddress);
  testEnv.stableDebtUsdc = await getStableDebtToken(stableDebtUsdcAddress);
  testEnv.aWETH = await getAToken(aWEthAddress);

  testEnv.dai = await getERC20(daiAddress);
  testEnv.usdc = await getERC20(usdcAddress);
  testEnv.weth = await getWETH(wethAddress);

  if (isTestnetMarket(poolConfig)) {
    testEnv.faucetOwnable = await getFaucet();
  }
}

const setSnapshot = async () => {
  setHardhatSnapshotId(await evmSnapshot());
};

const revertHead = async () => {
  await evmRevert(HardhatSnapshotId);
};

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      await setSnapshot();
    });
    tests(testEnv);
    after(async () => {
      await revertHead();
    });
  });
}

export async function ititializeOracle() {
  const reservesTokens = await testEnv.helpersContract.getAllReservesTokens();

  const prices = {
    DAI: parseEther("1"),
    USDC: parseEther("1"),
    WETH: parseEther("2500"),
  };

  const addressesfallbackOracle = await deployments.get(
    FALLBACK_ORACLE_ID
  );

  const fallbackOracle = (await ethers.getContractAt(
    "contracts/oracle/FallbackPriceOracle.sol:FallbackPriceOracle",
    addressesfallbackOracle.address
  )) as IPriceOracle;


  const promises = reservesTokens.map((token) => 
    fallbackOracle.setAssetPrice(token.tokenAddress, prices[token.symbol as keyof typeof prices])
  );

  await Promise.all(promises);
}