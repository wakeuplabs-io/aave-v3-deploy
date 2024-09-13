import { BigNumber } from "ethers";
import { makeSuite, TestEnv } from "../utils/make-suite";
import { expect } from "chai";
import { waitForTx } from "../../helpers";
import { supply } from "../utils/supply";
import { parseEther } from "ethers/lib/utils";

enum RateMode {
  STABLE = 1,
  VARIABLE = 2
}

makeSuite("Aave Oracle", (testEnv: TestEnv) => {
  const zero = BigNumber.from("0");
  const depositSize = BigNumber.from(parseEther("10"));

  describe("Price Oracle in stale state", () => {
    it("should revert when getting price", async () => {
      const { weth, dai, oracle } = testEnv;

      expect(weth).to.not.be.undefined;
      expect(oracle).to.not.be.undefined;
  
  
      await expect(oracle.getAssetPrice(dai.address)).rejectedWith("92");  
    });

    it("should user be able to supply", async () => {
      const { deployer: user, dai, aDai, pool } = testEnv;
    
      const aTokensBalanceBeforeSupply = await aDai.balanceOf(user.address);
      // Approve and Deposit with USDC
      await supply(dai, user, depositSize, pool);
  
      const aTokensBalance = await aDai.balanceOf(user.address);
  
      expect(aTokensBalance).to.be.gt(aTokensBalanceBeforeSupply);
      expect(aTokensBalance).to.be.gte(depositSize);  
    });

    it("should user not be able to borrow", async () => {
      const { deployer, users, dai, aDai, pool } = testEnv;
    
      const borrowSize = BigNumber.from(parseEther("1"));
      const user = users[0];
  
      const poolService = await pool.connect(user.signer);
 
      await supply(dai, user, depositSize, pool);
      await supply(dai, deployer, depositSize, pool);
  
      const aTokensBalance = await aDai.balanceOf(user.address);
  
      expect(aTokensBalance).to.be.gt(zero);
      expect(aTokensBalance).to.be.gte(depositSize);
  
      // Set collateral
      await waitForTx(
        await poolService.setUserUseReserveAsCollateral(dai.address, true)
      );
  
      // Borrow DAI with DAI as collateral
      await expect(poolService.borrow(dai.address, borrowSize, RateMode.VARIABLE, "0", user.address)).rejectedWith("92");  
    });
  });

  describe("Price oracle with price updated", () => {
    it("Check Assets price", async () => {
      const { deployer, weth, dai, oracle, daiChainlinkAggregator } = testEnv;

      const newPrice = 11 * 10e8;

      await waitForTx(
        await daiChainlinkAggregator.connect(deployer.signer).updatePrice(newPrice)
      )

      const priceDAI = await oracle.getAssetPrice(dai.address);
      expect(priceDAI).to.be.eq(newPrice);
    });

    it("Fail because of stale price", async () => {
      const { deployer, weth, dai, usdc, oracle, daiChainlinkAggregator, usdcChainlinkAggregator, wethChainlinkAggregator } = testEnv;

      expect(weth).to.not.be.undefined;
      expect(oracle).to.not.be.undefined;

      await oracle.getAssetPrice(dai.address);
    });
  });
});
