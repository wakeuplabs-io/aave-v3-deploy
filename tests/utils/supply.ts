import { BigNumber } from "ethers";
import { IERC20, Pool, SignerWithAddress, waitForTx } from "../../helpers";

export async function supply(asset: IERC20, user: SignerWithAddress, amount: BigNumber, pool: Pool) {
  await waitForTx(
    await asset
      .connect(user.signer)
      .approve(pool.address, amount)
  )

  await waitForTx(
    await pool.connect(user.signer).supply(asset.address, amount, user.address, 0)
  );
}
