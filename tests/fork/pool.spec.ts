import { BigNumber } from "ethers";
import { parseEther, formatEther } from "ethers/lib/utils";
import { makeSuite, TestEnv } from "../utils/make-suite";
import { expect } from "chai";
import { IERC20, SignerWithAddress, waitForTx } from "../../helpers";

enum RateMode {
  STABLE = 1,
  VARIABLE = 2
}

makeSuite("Pool", (testEnv: TestEnv) => {
  const zero = BigNumber.from("0");
  const depositSize = parseEther("10");
  
  async function supply(asset: IERC20, user: SignerWithAddress, amount: BigNumber) {
    const { pool } = testEnv;

    await waitForTx(
      await asset
        .connect(user.signer)
        .approve(pool.address, amount)
    )

    await waitForTx(
      await pool.connect(user.signer).supply(asset.address, amount, user.address, 0)
    );
  }

  async function repay(asset: IERC20, user: SignerWithAddress, amount: BigNumber, mode: RateMode) {
    const { pool } = testEnv;

    await waitForTx(
      await asset
        .connect(user.signer)
        .approve(pool.address, amount)
    )

    await waitForTx(
      await pool.connect(user.signer).repay(asset.address, amount, mode, user.address)
    );
  }
  
  it("Supply Variable DAI", async () => {
    const { users, dai,usdc, aUsdc, aDai, pool } = testEnv;
    
    const user = users[0];
    const aTokensBalanceBeforeSupply = await aDai.balanceOf(user.address);
    const balance = await dai.balanceOf(user.address);
    
    // Approve and Deposit with USDC
    await supply(dai, user, depositSize);
    await supply(usdc, user, depositSize);

    const aTokensBalance = await aDai.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(aTokensBalanceBeforeSupply);
    expect(aTokensBalance).to.be.gte(depositSize);
  });

  it("Borrow Variable DAI and replay with DAI", async () => {
    const { deployer, users, dai, aDai, pool, variableDebtDai } = testEnv;
    
    const borrowSize = BigNumber.from(parseEther("1"));
    const repaySize = borrowSize.add(borrowSize.mul(5).div(100));
    const user = users[0];

    const poolService = await pool.connect(user.signer);

    await supply(dai, user, depositSize);
    await supply(dai, deployer, depositSize);

    const aTokensBalance = await aDai.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(zero);
    expect(aTokensBalance).to.be.gte(depositSize);

    // Set collateral
    await waitForTx(
      await poolService.setUserUseReserveAsCollateral(dai.address, true)
    );

    // Borrow DAI with DAI as collateral
    await waitForTx(
      await poolService.borrow(dai.address, borrowSize, RateMode.VARIABLE, "0", user.address)
    );

    const debtBalance = await variableDebtDai.balanceOf(user.address);

    expect(debtBalance).to.be.gt(zero);

    // Partial Repay DAI loan
    const partialPayment = repaySize.div(2);

    await repay(dai, user, partialPayment, RateMode.VARIABLE);
    const debtBalanceAfterPartialRepay = await variableDebtDai.balanceOf(
      user.address
    );

    expect(debtBalanceAfterPartialRepay).to.be.lt(debtBalance);
  });

  it("Supply Stable DAI, borrow USDC and replay with DAI", async () => {
    const { deployer, users, dai, usdc, aUsdc, pool, stableDebtUsdc } = testEnv;
    
    const supplySize = BigNumber.from(parseEther("1"));
    const borrowSize = BigNumber.from(parseEther("0.00000005"));
    const repaySize = borrowSize.add(borrowSize.mul(5).div(100));
    const user = users[0];

    const poolService = await pool.connect(user.signer);

    // Approve and Deposit with USDC
    await supply(dai, user, supplySize);
    await supply(usdc, deployer, supplySize.mul(10));

    const aTokensBalance = await aUsdc.balanceOf(deployer.address);

    expect(aTokensBalance).to.be.gt(zero);
    expect(aTokensBalance).to.be.gte(depositSize);

    // Set collateral
    await waitForTx(
      await poolService.setUserUseReserveAsCollateral(dai.address, true)
    );

    // Borrow DAI with USDC as collateral
    await waitForTx(
      await poolService.borrow(usdc.address, borrowSize, RateMode.STABLE, "0", user.address)
    );

    const debtBalance = await stableDebtUsdc.balanceOf(user.address);
    expect(debtBalance).to.be.gt(zero);

    // Partial Repay DAI loan
    const partialPayment = repaySize.div(2);

    await repay(usdc, user, partialPayment, RateMode.STABLE);
    
    const debtBalanceAfterPartialRepay = await stableDebtUsdc.balanceOf(
      user.address
    );
    expect(debtBalanceAfterPartialRepay).to.be.lt(debtBalance);
  });

  it("Supply Variable DAI, borrow USDC and replay with DAI", async () => {
    const { deployer, users, weth, dai, usdc, aUsdc, pool, variableDebtUsdc } = testEnv;
    
    const borrowSize = BigNumber.from("1000000");
    const repaySize = borrowSize.add(borrowSize.mul(5).div(100));
    const user = users[0];

    const poolService = await pool.connect(user.signer);

    // Approve and Deposit with USDC
    await supply(dai, user, depositSize);
    await supply(usdc, deployer, depositSize);

    const aTokensBalance = await aUsdc.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(zero);
    expect(aTokensBalance).to.be.gte(depositSize);

    // Set collateral
    await waitForTx(
      await poolService.setUserUseReserveAsCollateral(dai.address, true)
    );

    // Borrow DAI with USDC as collateral
    await waitForTx(
      await poolService.borrow(usdc.address, borrowSize, RateMode.VARIABLE, "0", user.address)
    );

    const debtBalance = await variableDebtUsdc.balanceOf(user.address);
    expect(debtBalance).to.be.gt(zero);

    // Partial Repay DAI loan
    const partialPayment = repaySize.div(2);

    await repay(usdc, user, partialPayment, RateMode.VARIABLE);
    
    const debtBalanceAfterPartialRepay = await variableDebtUsdc.balanceOf(
      user.address
    );
    expect(debtBalanceAfterPartialRepay).to.be.lt(debtBalance);
  });
});
