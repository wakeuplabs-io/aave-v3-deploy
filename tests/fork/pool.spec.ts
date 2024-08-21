import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
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
    const { users, usdc, aUsdc, pool } =
    testEnv;
    
    const user = users[1];

    // Approve and Deposit with USDC
    await supply(usdc, user, depositSize);

    const aTokensBalance = await aUsdc.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(zero);
    expect(aTokensBalance).to.be.gte(depositSize);
  });

  it("Borrow Variable DAI and replay with DAI", async () => {
    const { users, dai, aDai, pool, variableDebtDai } =
    testEnv;
    
    const borrowSize = BigNumber.from(parseEther("1"));
    const repaySize = borrowSize.add(borrowSize.mul(5).div(100));
    const user = users[1];

    const poolService = await pool.connect(user.signer);

    await supply(dai, user, depositSize);

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

  it.skip("Supply Stable DAI, borrow USDC and replay with DAI", async () => {
    const { deployer, users, dai, usdc, aUsdc, pool, variableDebtDai, stableDebtDai } = testEnv;
    
    const mode: RateMode = RateMode.STABLE as RateMode;
    const debtDai = mode === RateMode.VARIABLE ? variableDebtDai : stableDebtDai;
    const borrowSize = BigNumber.from(parseEther("1"));
    const repaySize = borrowSize.add(borrowSize.mul(5).div(100));
    const user = users[1];

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
      await poolService.borrow(usdc.address, borrowSize, mode, "0", user.address)
    );

    const debtBalance = await debtDai.balanceOf(user.address);
    expect(debtBalance).to.be.gt(zero);

    // Partial Repay DAI loan
    const partialPayment = repaySize.div(2);

    await repay(dai, user, partialPayment, mode);
    
    const debtBalanceAfterPartialRepay = await debtDai.balanceOf(
      user.address
    );
    expect(debtBalanceAfterPartialRepay).to.be.lt(debtBalance);
  });

  it("Supply Variable DAI, borrow USDC and replay with DAI", async () => {
    const { deployer, users, dai, usdc, aUsdc, pool, variableDebtDai, stableDebtDai } = testEnv;
    
    const mode = RateMode.VARIABLE;
    const debtDai = mode === RateMode.VARIABLE ? variableDebtDai : stableDebtDai;
    const borrowSize = BigNumber.from(parseEther("1"));
    const repaySize = borrowSize.add(borrowSize.mul(5).div(100));
    const user = users[1];

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
      await poolService.borrow(usdc.address, borrowSize, mode, "0", user.address)
    );

    const debtBalance = await debtDai.balanceOf(user.address);
    expect(debtBalance).to.be.gt(zero);

    // Partial Repay DAI loan
    const partialPayment = repaySize.div(2);

    await repay(dai, user, partialPayment, mode);
    
    const debtBalanceAfterPartialRepay = await debtDai.balanceOf(
      user.address
    );
    expect(debtBalanceAfterPartialRepay).to.be.lt(debtBalance);
  });
});
