import { BigNumber } from "ethers";
import { makeSuite, TestEnv } from "../utils/make-suite";
import { expect } from "chai";

makeSuite("Price Oracle", (testEnv: TestEnv) => {
  const zero = BigNumber.from("0");

  it("Check Assets price", async () => {
    const { weth, dai, usdc, oracle } = testEnv;

    if (!weth || !oracle) {
      console.error("weth or oracle not found in testEnv");
      return;
    }

    const priceWETH = await oracle.getAssetPrice(weth.address);
    expect(priceWETH.gt(zero)).to.be.true;

    const priceUSDC = await oracle.getAssetPrice(usdc.address);
    expect(priceUSDC.gt(zero)).to.be.true;

    const priceDAI = await oracle.getAssetPrice(dai.address);
    expect(priceDAI.gt(zero)).to.be.true;
  });
});
