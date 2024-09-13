import { ONE_ADDRESS, waitForTx, ZERO_ADDRESS } from "../../helpers";
import { makeSuite, TestEnv } from "../utils/make-suite";
import { expect } from "chai";

makeSuite('AaveOracle', (testEnv: TestEnv) => {
  const assetPrice = '1000000000000000000';
  const CALLER_NOT_RISK_OR_POOL_ADMIN = '4';
  const CALLER_NOT_ASSET_LISTING_OR_POOL_ADMIN = '5';
  const INCONSISTENT_PARAMS_LENGTH = '76';


  describe("Get prices", () => {
    it('Get price of BASE_CURRENCY asset', async () => {
      const { oracle } = testEnv;
  
      // Check returns the fixed price BASE_CURRENCY_UNIT
      expect(await oracle.getAssetPrice(await oracle.BASE_CURRENCY())).to.be.eq(
        await oracle.BASE_CURRENCY_UNIT()
      );
    });
  
    it('Get price of BASE_CURRENCY asset with registered asset source for its address', async () => {
      const { deployer, poolAdmin, oracle, weth, wethChainlinkAggregator } = testEnv;
  
      // Add asset source for BASE_CURRENCY address
      await expect(
        oracle.connect(poolAdmin.signer).setAssetSources([weth.address], [wethChainlinkAggregator.address])
      )
        .to.emit(oracle, 'AssetSourceUpdated')
        .withArgs(weth.address, wethChainlinkAggregator.address);
  
      await waitForTx(
        await wethChainlinkAggregator.connect(deployer.signer).updatePrice(assetPrice)
      )
    
      // Check returns the fixed price BASE_CURRENCY_UNIT
      expect(await oracle.getAssetPrice(weth.address)).to.be.eq(
        assetPrice
      );
    });
  
    
    it('Get price of asset with no asset source', async () => {
      const { deployer, oracle, fallbackOracle, dai, poolAdmin } = testEnv;
      const fallbackPrice = '12';
  
      await waitForTx(
        await oracle
        .connect(poolAdmin.signer)
        .setAssetSources([dai.address], [ZERO_ADDRESS])
      )
  
      // Register price on FallbackOracle
      expect(await fallbackOracle.connect(deployer.signer).setAssetPrice(dai.address, fallbackPrice));
  
      // Asset has no source
      expect(await oracle.getSourceOfAsset(dai.address)).to.be.eq(ZERO_ADDRESS);
  
      // Returns 0 price
      expect(await oracle.getAssetPrice(dai.address)).to.be.eq(fallbackPrice);
    });
  
    it('Get price of asset with 0 price and no fallback price', async () => {
      const { deployer, poolAdmin, oracle, dai, daiChainlinkAggregator } = testEnv;
  
      await waitForTx(
        await daiChainlinkAggregator.connect(deployer.signer).updatePrice(0)
      )
      await waitForTx(
        await oracle.connect(poolAdmin.signer).setFallbackOracle(ZERO_ADDRESS)
      )
  
      // Add asset source
      await expect(
        oracle
          .connect(poolAdmin.signer)
          .setAssetSources([dai.address], [daiChainlinkAggregator.address])
      )
        .to.emit(oracle, 'AssetSourceUpdated')
        .withArgs(dai.address, daiChainlinkAggregator.address);
  
      expect(await oracle.getSourceOfAsset(dai.address)).to.be.eq(daiChainlinkAggregator.address);
      await expect(oracle.getAssetPrice(dai.address)).revertedWith('92')
    });
  
    it('Get price of asset with 0 price but non-zero fallback price', async () => {
      const { deployer, poolAdmin, dai, fallbackOracle, oracle, daiChainlinkAggregator } = testEnv;
      await waitForTx(
        await daiChainlinkAggregator.connect(deployer.signer).updatePrice(0)
      )
      await waitForTx(
        await oracle.connect(poolAdmin.signer).setFallbackOracle(fallbackOracle.address)
      )
      const fallbackPrice = "12";
  
      // Register price on FallbackOracle
      expect(await fallbackOracle.connect(deployer.signer).setAssetPrice(dai.address, fallbackPrice));
  
      // Add asset source
      await expect(
        oracle
          .connect(poolAdmin.signer)
          .setAssetSources([dai.address], [daiChainlinkAggregator.address])
      )
        .to.emit(oracle, 'AssetSourceUpdated')
        .withArgs(dai.address, daiChainlinkAggregator.address);
  
      expect(await oracle.getSourceOfAsset(dai.address)).to.be.eq(daiChainlinkAggregator.address);
      expect(await oracle.getAssetPrice(dai.address)).to.be.eq(fallbackPrice);
    });      
  })

  describe("Only owner: success cases", () => {
    it('Owner update the FallbackOracle', async () => {
      const { poolAdmin, oracle, fallbackOracle } = testEnv;
  
      await waitForTx(
        await oracle.connect(poolAdmin.signer).setFallbackOracle(fallbackOracle.address)
      )
      expect(await oracle.getFallbackOracle()).to.be.eq(fallbackOracle.address);
  
      // Update oracle source
      await expect(oracle.connect(poolAdmin.signer).setFallbackOracle(ONE_ADDRESS))
        .to.emit(oracle, 'FallbackOracleUpdated')
        .withArgs(ONE_ADDRESS);
  
      expect(await oracle.getFallbackOracle()).to.be.eq(ONE_ADDRESS);

      await waitForTx(
        await oracle.connect(poolAdmin.signer).setFallbackOracle(fallbackOracle.address)
      )
    });

    it('Owner set a new asset source', async () => {
      const { deployer, poolAdmin, fallbackOracle, oracle: aaveOracle, dai, daiChainlinkAggregator } = testEnv;

      await waitForTx(
        await aaveOracle
        .connect(poolAdmin.signer)
        .setAssetSources([dai.address], [ZERO_ADDRESS])
      )

      const fallbackPrice = await fallbackOracle.connect(deployer.address).getAssetPrice(dai.address);

      // Asset has no source
      expect(await aaveOracle.getSourceOfAsset(dai.address)).to.be.eq(ZERO_ADDRESS);
      const priorSourcePrice = await aaveOracle.getAssetPrice(dai.address);
      const priorSourcesPrices = (await aaveOracle.getAssetsPrices([dai.address])).map((x) =>
        x.toString()
      );
      expect(priorSourcePrice).to.equal(fallbackPrice.toString());
      expect(priorSourcesPrices).to.eql([fallbackPrice.toString()]);

      // Add asset source
      await expect(
        aaveOracle
          .connect(poolAdmin.signer)
          .setAssetSources([dai.address], [daiChainlinkAggregator.address])
      )
        .to.emit(aaveOracle, 'AssetSourceUpdated')
        .withArgs(dai.address, daiChainlinkAggregator.address);


      await waitForTx(
        await daiChainlinkAggregator.connect(deployer.signer).updatePrice(assetPrice)
      )

      const sourcesPrices = await (
        await aaveOracle.getAssetsPrices([dai.address])
      ).map((x) => x.toString());
      expect(await aaveOracle.getSourceOfAsset(dai.address)).to.be.eq(daiChainlinkAggregator.address);
      expect(await aaveOracle.getAssetPrice(dai.address)).to.be.eq(assetPrice);
      expect(sourcesPrices).to.eql([assetPrice]);
    });

    it('Owner update an existing asset source', async () => {
      const { deployer, poolAdmin, oracle, dai, daiChainlinkAggregator } = testEnv;

      // Update DAI source
      await expect(
        oracle.connect(poolAdmin.signer).setAssetSources([dai.address], [daiChainlinkAggregator.address])
      )
        .to.emit(oracle, 'AssetSourceUpdated')
        .withArgs(dai.address, daiChainlinkAggregator.address);

        await waitForTx(
          await daiChainlinkAggregator.connect(deployer.signer).updatePrice(assetPrice)
        )
    
      expect(await oracle.getSourceOfAsset(dai.address)).to.be.eq(daiChainlinkAggregator.address);
      expect(await oracle.getAssetPrice(dai.address)).to.be.eq(assetPrice);
    });

    it('An owner user set a grace period', async () => {
      const { users, oracle, deployer, poolAdmin } = testEnv;

      await waitForTx(
        await oracle.connect(poolAdmin.signer).setGracePeriod(100)
      )

      expect(await oracle.getGracePeriod()).to.be.eq(100);
    });

  })

  describe("Only owner: failure cases", () => {
    it('Owner tries to set a new asset source with wrong input params (revert expected)', async () => {
      const { poolAdmin, oracle, dai} = testEnv;
  
      await expect(
        oracle.connect(poolAdmin.signer).setAssetSources([dai.address], [])
      ).to.be.revertedWith(INCONSISTENT_PARAMS_LENGTH);
    });  

    it('A non-owner user tries to set a new asset source (revert expected)', async () => {
      const { users, oracle, dai, daiChainlinkAggregator } = testEnv;
      const user = users[0];

      await expect(
        oracle.connect(user.signer).setAssetSources([dai.address], [daiChainlinkAggregator.address])
      ).to.be.revertedWith(CALLER_NOT_ASSET_LISTING_OR_POOL_ADMIN);
    });

    it('A non-owner user tries to set a grace period (revert expected)', async () => {
      const { users, oracle } = testEnv;
      const nonOwner = users[0];

      await expect(
        oracle.connect(nonOwner.signer).setGracePeriod(100)
      ).to.be.revertedWith(CALLER_NOT_RISK_OR_POOL_ADMIN);
    });
  
    it('A non-owner tries to update the FallbackOracle (revert expected)', async () => {
      const { users, poolAdmin, oracle, fallbackOracle } = testEnv;
      const nonOwner = users[0];

      await expect(
        oracle.connect(nonOwner.signer).setFallbackOracle(ONE_ADDRESS)
      ).to.be.revertedWith(CALLER_NOT_ASSET_LISTING_OR_POOL_ADMIN);
    });
  })
});
