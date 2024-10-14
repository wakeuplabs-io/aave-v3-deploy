
# Testing Deploy: AAVE Asset Configuration and Oracle Mocks

## Overview  
This README provides details about a new deployment that adds AAVE assets with borrowing disabled and implements DIA oracle mocks for testing purposes. It also includes the necessary configuration for creating a new subgraph and to configurate it on the dApp.  

---

## Key Features  
1. **DIA Oracle Mocks:**  
   - Mocks are deployed for **testing purposes**.
   - These mocks support an **extra parameter** to update prices dynamically.  
2. **Subgraph implementation**

## Asset and Oracle Addresses

| **Asset** | **Asset Address** | **Oracle Address** |
|------------|-------------------|---------------------|
| **USDC**   | `0x14E986C4a733B555c317D95Fe0FC5bFB5a7D166C` | `0xb062542b2A173fe90E885C1A2bF6C87F842167d0` |
| **DAI**    | `0xcb913C75362A7Fd39de6A5DDE4341F370F5B4419` | `0xb062542b2A173fe90E885C1A2bF6C87F842167d0` |
| **WETH**   | `0x327E7E4A9e054ecC67dFa9E3Af158347116321Bf` | `0x5281b36049dDdcb2161dACab4ec5e80b638459c6` |
| **AAVE**   | `0xF1b760dcB43A93694333A0E0ABc20F4D3e611985` | `0x61f72e0419c2D3073bA4A78CB3f2075625Ff6f5B` |

---

## Subgraph Configuration  

To set up a new subgraph, use the following addresses and configuration:  

```json
{
  "network": "bob-testnet",
  "node": {
    "address": "",
    "log_level": "debug"
  },
  "PoolAddressesProviderRegistry": {
    "address": "0xf2EAdD2B240c0497debDD401Ea6e169D715cf46b",
    "startBlock": 3108310
  },
  "AaveOracle": {
    "address": "0x94172B8a7fa43803349cC7BDF143611066b8Ef9C",
    "startBlock": 3108310
  },
  "RewardsController": {
    "address": "0x959C3B5845A2D83217360505fBB3415cB6D92731",
    "startBlock": 3108310
  }
}
```

### Subgraph Components  
- **Network:** `bob-testnet`  
- **PoolAddressesProviderRegistry:**  
  - Address: `0xf2EAdD2B240c0497debDD401Ea6e169D715cf46b`  
  - Start Block: `3108310`  
  - Link to deploy logs: https://github.com/DistributedCollective/sovryn-money-market/blob/deploy-aave-token/deployments/bob-sepolia/PoolAddressesProviderRegistry.json
- **AaveOracle:**  
  - Address: `0x94172B8a7fa43803349cC7BDF143611066b8Ef9C`  
  - Start Block: `3108310`
  - Link to deploy logs: https://github.com/DistributedCollective/sovryn-money-market/blob/deploy-aave-token/deployments/bob-sepolia/AaveOracle-bob.json
- **RewardsController:**  
  - Address: `0x959C3B5845A2D83217360505fBB3415cB6D92731`  
  - Start Block: `3108310`
  - Link to deploy logs: https://github.com/DistributedCollective/sovryn-money-market/blob/deploy-aave-token/deployments/bob-sepolia/IncentivesV2-Implementation.json
  

---

## Deployment Instructions  

Keep in mind you should make this steps for each new deploy.

1. **Configure the Subgraph:**
   - Deploy the subgraph using the provided network, addresses, and start blocks.
   - Set `log_level` to `debug` for detailed logging during development.
2. **Configure env Dapp:**

```
  REACT_APP_RATES_HISTORY_API_URL=https://bob-mm-cache.test.sovryn.app/data/rates-history
  REACT_APP_GRAPH_BOB=https://bob-ambient-subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/bob-ambient-subgraph
```
3. ** Configure constants: **

`apps/frontend/src/constants/aave.ts`

```typescript
export const AAVE_CONTRACT_ADDRESSES = IS_MAINNET
  ? {
      POOL: '',
      WETH_GATEWAY: '',
      UI_POOL_DATA_PROVIDER: '',
      POOL_ADDRESSES_PROVIDER: '',
      VARIABLE_DEBT_ETH: '',
      WETH: '',
      TREASURY: '',
    }
  : {
      POOL: '0xd7308f0626a8e35b645Af0b7fA26Aba9CbD7e6A7',
      WETH_GATEWAY: '0x247074C89f5559c18ba34552D0C6C8995c763a0F',
      UI_POOL_DATA_PROVIDER: '0x72Bbd487e81dF47829c64B71871A6C23228dC4f9',
      POOL_ADDRESSES_PROVIDER: '0xe8b907899c42ae2fBa09010f18338d6634B9Ab05',
      VARIABLE_DEBT_ETH: '0x63719589aC40057556a791FAa701264567b5b627',
      WETH: '0x327E7E4A9e054ecC67dFa9E3Af158347116321Bf',
      TREASURY: '0xe5dc2b9044Ef3044fa5aa16050239668Eda73713',
      RATES_HISTORY_API_URL: process.env.REACT_APP_RATES_HISTORY_API_URL,
    };
```

