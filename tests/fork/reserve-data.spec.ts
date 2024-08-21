import { BigNumber } from "ethers";
import { makeSuite, TestEnv } from "../utils/make-suite";
import { expect } from "chai";

makeSuite("Reserve Data", (testEnv: TestEnv) => {
  const zero = BigNumber.from("0");

  it("Get Reserves List", async () => {
    const { users, weth, dai, usdc, addressesProvider, uiPoolDataProvider } = testEnv;
    const user = users[1];

    const result = await uiPoolDataProvider.connect(user.signer).getReservesList(addressesProvider.address);

    expect(result).to.be.eql([dai.address, usdc.address, weth.address]);
  });

  it("Get Reserve Data", async () => {
    const { users, addressesProvider, uiPoolDataProvider } = testEnv;
    const user = users[1];

    const result = await uiPoolDataProvider.connect(user.signer).getReservesData(addressesProvider.address);

    expect(result.length).to.be.eql(2);
  });
});
