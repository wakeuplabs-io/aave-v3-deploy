import { BigNumber } from "ethers";
import { makeSuite, TestEnv } from "../utils/make-suite";
import hre from "hardhat";

makeSuite("Print Deployments", (testEnv: TestEnv) => {
  const zero = BigNumber.from("0");

  it("Check task is running", async () => {
    await hre.run("print-deployments");
  });
});
