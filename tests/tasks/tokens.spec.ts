import { BigNumber } from "ethers";
import { makeSuite, TestEnv } from "../utils/make-suite";
import hre from "hardhat";
import { expect } from "chai";

makeSuite("aTokens", (testEnv: TestEnv) => {
  it("add and remove aToken", async () => {
    const { deployer, usdc, uiPoolDataProvider, addressesProvider } = testEnv;

    const tokensBeforeRemoveUsdc = await uiPoolDataProvider.connect(deployer.signer).getReservesList(addressesProvider.address);
    expect(tokensBeforeRemoveUsdc.includes(usdc.address)).to.be.eql(true);
    await hre.run("remove-atokens", {
      address: usdc.address,
    });
    const tokensAfterRemoveUsdc = await uiPoolDataProvider.connect(deployer.signer).getReservesList(addressesProvider.address);
    expect(tokensAfterRemoveUsdc.includes(usdc.address)).to.be.eql(false);

    await hre.run("add-atokens");    
    const tokensAfterAddUsdc = await uiPoolDataProvider.connect(deployer.signer).getReservesList(addressesProvider.address);
    expect(tokensAfterAddUsdc.includes(usdc.address)).to.be.eql(true);
  });

  it("review address asset", async () => {
    const { deployer, usdc, uiPoolDataProvider, addressesProvider } = testEnv;

    const tokensBeforeRemoveUsdc = await uiPoolDataProvider.connect(deployer.signer).getReservesList(addressesProvider.address);
    expect(tokensBeforeRemoveUsdc.includes(usdc.address)).to.be.eql(true);
    await hre.run("review-atokens", {
      address: usdc.address,
    });
    const tokensAfterRemoveUsdc = await uiPoolDataProvider.connect(deployer.signer).getReservesList(addressesProvider.address);
    expect(tokensAfterRemoveUsdc.includes(usdc.address)).to.be.eql(false);

    await hre.run("add-atokens");    
    const tokensAfterAddUsdc = await uiPoolDataProvider.connect(deployer.signer).getReservesList(addressesProvider.address);
    expect(tokensAfterAddUsdc.includes(usdc.address)).to.be.eql(true);
  });

  it("red button: should disable and enable an asset", async () => {
    const { deployer, usdc, uiPoolDataProvider, addressesProvider } = testEnv;

    await hre.run("red-button", { disable: true, asset: usdc.address });
    const [assetsData] = await uiPoolDataProvider.connect(deployer.signer).getReservesData(addressesProvider.address);
    const dataUsdc = assetsData.find((d: any) => d.underlyingAsset === usdc.address);
    expect(dataUsdc?.isPaused).to.be.eql(true);

    await hre.run("red-button", { enable: true, asset: usdc.address });
    const [assetsDataAfterEnabling] = await uiPoolDataProvider.connect(deployer.signer).getReservesData(addressesProvider.address);
    const dataUsdcAfterEnabling = assetsDataAfterEnabling.find((d: any) => d.underlyingAsset === usdc.address);
    expect(dataUsdcAfterEnabling?.isPaused).to.be.eql(false);
  });
});
