import { deployments } from "hardhat";
import { initializeMakeSuite, ititializeOracle } from "./utils/make-suite";

before(async () => {
  // Deploy Aave Market as fixture
  await deployments.fixture();

  await initializeMakeSuite();
  console.log("\n***************");
  console.log("Setup finished");
  console.log("***************\n");
});
