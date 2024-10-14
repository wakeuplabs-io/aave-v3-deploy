
# Aave Contracts Deployment Guide (BOB)

This guide walks you through deploying Aave contracts on the BOB testnet.

---

## 🔧 Prerequisites  
- **Node.js**: Version >= `18` is required.  
- **Dependencies**: Make sure to install all required packages using:

  ```bash
  npm install
  ```

---

## 🛠️ Environment Configuration  

1. **Create a `.env` file** in the project root with the following variables:  

   ```bash
   # Skip compilation load (must be set to true)
   SKIP_LOAD=true

   # Market name for deployment. Ensure this exists in `loadPoolConfig` function.
   MARKET_NAME=bob

   # Target chain for deployment
   FORK=bob-sepolia | bob

   # Wallet seed phrase
   MNEMONIC=

   # Etherscan API key for contract verification (optional)
   ETHERSCAN_KEY=

   # Enable or disable the permissioned faucet feature
   PERMISSIONED_FAUCET=false
   ```

2. **Double-check** that `SKIP_LOAD=true` is set. This ensures the project doesn’t run unnecessary load tasks during compilation.

---

## 🚀 Deployment Steps  

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Deploy the contracts:**

   ```bash
   npm run deploy -- --network bob-sepolia
   ```

---

## 📝 Configuration  

- Make sure to replace mainnet values with valid data in the following folders/files.

### `hardhat.config.ts`
---

Config the network in `hardhat.config.ts`

Update the hardhat.config.ts file to include the new network configuration.

```typescript
export default {
...
  networks: {
    [eBobNetwork.testnet]: getCommonNetworkConfig(eBobNetwork.testnet, 111),
  }
...
 etherscan: {
    apiKey: ETHERSCAN_KEY,
    customChains: [{
        network: eBobNetwork.testnet,
        chainId: 111,
        urls: {
          apiURL: "https://testnet-explorer.gobob.xyz/api",
          browserURL: "https://testnet-explorer.gobob.xyz/",
        },
      }]
 }
 ...
}
```

### `helpers/constants.ts`
---

2. Update Constants:
    - WRAPPED_NATIVE_TOKEN_PER_NETWORK
    - ETHEREUM_SHORT_EXECUTOR

### `helpers/hardhat-config-helpers.ts`
---

- Add Network Configuration:

Ensure that the new network is configured correctly by adding the following parameters:

 - NETWORKS_RPC_URL
 - LIVE_NETWORKS: true
 - GAS_PRICE_PER_NET

### `helpers/market-config-helpers.ts`
---

1. **Add New Market Configuration in helpers/market-config-helpers.ts:** If a new market is required, it should be added here. The market configuration for bob has already been included.

### `markets/aave/commons.ts`
---
2. **Enable L2 Deployment Flag for the Pool:** Set the flag to deploy the pool for Layer 2 (L2) networks. This configuration is located in `markets/aave/commons.ts`.

### **Configure the New Market:**
---

Main configurations for the new market are found in the `markets/bob` folder. Key files include:
- markets/bob/index.ts: Contains all data related to the market configuration.
- markets/bob/reservesConfig.ts: Contains information about each strategy used for each reserve asset.


## StrategyUSDC Parameters Summary

Here is a brief explanation of each parameter in the `strategyUSDC` configuration:

Example: 
```typescript

export const strategyUSDC: IReserveParams = {
  strategy: rateStrategyStableOne,
  baseLTVAsCollateral: "8250",
  liquidationThreshold: "8500",
  liquidationBonus: "10400",
  liquidationProtocolFee: "1000",
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  flashLoanEnabled: false,
  reserveDecimals: "18",
  aTokenImpl: eContractid.AToken,
  reserveFactor: "1000",
  supplyCap: "2000000000",
  borrowCap: "0",
  debtCeiling: "0",
  borrowableIsolation: true,
};

```

1. **`strategy`**  
   - Strategy for calculating interest rates, using `rateStrategyStableOne`.

2. **`baseLTVAsCollateral`**  
   - **Loan-to-Value (LTV)** ratio: **82.5%**.  
   - This is the max amount of collateral value that can be borrowed.

3. **`liquidationThreshold`**  
   - Threshold to trigger liquidation: **85%**.  
   - The percentage at which a loan is considered under-collateralized and may be liquidated.

4. **`liquidationBonus`**  
   - Liquidator bonus: **4%**.  
   - Incentive added to the discounted collateral for liquidators.

5. **`liquidationProtocolFee`**  
   - Protocol fee: **1%**.  
   - A portion of liquidation proceeds goes to the protocol.

6. **`borrowingEnabled`**  
   - **Borrowing is enabled** for this asset.

7. **`stableBorrowRateEnabled`**  
   - **Stable borrowing rates** are available.

8. **`flashLoanEnabled`**  
   - **Flash loans are disabled** for this asset.

9. **`reserveDecimals`**  
   - Asset decimals: **18** (represents token precision).

10. **`aTokenImpl`**  
   - Contract used for the aToken implementation, in this case: `eContractid.AToken`.

11. **`reserveFactor`**  
   - Reserve factor: **10%**.  
   - A portion of the interest paid by borrowers goes to the reserve.

12. **`supplyCap`**  
   - Max supply: **2,000,000,000** tokens.

13. **`borrowCap`**  
   - **Borrowing cap**: **0** (no borrowing limit imposed).
   - The maximum amount of this asset that can be borrowed from the protocol. Zero means no limit.

14. **`debtCeiling`**  
   - Max debt limit: **0** (no ceiling on debt issued).
   - The maximum amount of debt that can be issued for this asset.

15. **`borrowableIsolation`**  
   - **Borrowable in isolation mode**: Enabled.  
   - Indicate if this asset operates in isolation mode, where it can't be combined with other assets as collateral.

### Interest Rate Strategy Parameters

![image](./assets/interest-rate-model.png)

- **Optimal Utilization Rate** (%):  
  _The optimal usage percentage of the pool to maintain ideal interest rates._
- **Base Variable Borrow Rate** (%):  
  _The starting interest rate for variable borrowing, in percentage._
- **Stable Borrow Rate Slope 1** (%):  
  _The interest rate increase before reaching optimal utilization, in percentage._
- **Stable Borrow Rate Slope 2** (%):  
  _The interest rate increase after optimal utilization, in percentage._
- **Variable Borrow Rate Slope 1** (%):  
  _The variable interest rate slope before optimal utilization, in percentage._
- **Variable Borrow Rate Slope 2** (%):  
  _The variable interest rate slope after optimal utilization, in percentage._
- **Base Stable Rate Offset (%)**: 
_An offset added to the base variable borrow rate to determine the base stable borrow rate._
- **Stable Rate Excess Offset (%):** 
_An additional offset applied to stable borrow rates when the stable borrow utilization exceeds the optimal ratio._
- **Optimal Stable to Total Debt Ratio (%):** 
_The optimal ratio of stable debt to total debt within the reserve._

## Note


