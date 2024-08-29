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
});
