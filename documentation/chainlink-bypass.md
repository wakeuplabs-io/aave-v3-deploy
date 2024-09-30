# Chainlink Bypass

Aave relies on Chainlink oracles by default, requiring specific contract addresses to configure and deploy the UIPoolDataProvider. The following configuration defines the required contract addresses:

```typescript
// src/helpers/contants.ts
export const chainlinkAggregatorProxy: Record<string, string> = {
}

export const chainlinkEthUsdAggregatorProxy: Record<string, string> = {
}
```

To enable the use of UIPoolDataProvider without relying on Chainlink, a mock contract has been implemented to bypass the requirement for live Chainlink data. This contract acts as a placeholder during deployment, emulating the behavior of a Chainlink aggregator.

## EACAggregatorProxy Contract

The EACAggregatorProxy contract mimics the behavior of a Chainlink proxy, managing and retrieving the latest price-related data. It is necessary to deploy UiPoolDataProviderV3 and UiIncentiveDataProviderV3 without requiring a live connection to Chainlink.

```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/// @title EACAggregatorProxy Contract
/// @notice This contract acts as a bypass of a chainlink proxy to manage and retrieve the latest price-related data.
/// @dev This contract stores the latest answer, round ID, and timestamp. It also includes placeholder functions for round-specific data retrieval.
/// @dev This contract is deployed to deploy UiPoolDataProviderV3 and UiIncentiveDataProviderV3
contract EACAggregatorProxy {
    /// @notice The number of decimals used for the price data
    uint8 private constant DECIMALS = 18;

    /// @dev Stores the latest price value
    int256 private latestAnswerValue;

    /// @dev Stores the latest round ID
    uint256 private latestRoundId;

    /// @dev Stores the timestamp of the latest update
    uint256 private latestTimestampValue;

    /// @notice Initializes the contract with a default latest answer value
    constructor() {
        latestAnswerValue = int256(2 * 10 ** DECIMALS); // Default initial value
    }

    /// @notice Returns the number of decimals used by the aggregator
    /// @return The number of decimals (18)
    function decimals() external view returns (uint8) {
        return DECIMALS;
    }

    /// @notice Returns the latest price value
    /// @return The latest answer as an `int256`
    function latestAnswer() external view returns (int256) {
        return latestAnswerValue;
    }

    /// @notice Returns the timestamp of the latest update
    /// @return The latest timestamp as a `uint256`
    function latestTimestamp() external view returns (uint256) {
        return latestTimestampValue;
    }

    /// @notice Returns the latest round ID
    /// @return The latest round ID as a `uint256`
    function latestRound() external view returns (uint256) {
        return latestRoundId;
    }

    /// @notice Retrieves the price value for a specific round ID
    /// @dev This is a placeholder function. The actual implementation should fetch the correct value.
    /// @param roundId The ID of the round to query
    /// @return The answer for the given round ID (currently returns 0)
    function getAnswer(uint256 roundId) external view returns (int256) {
        // Implement the logic to retrieve the answer for a specific roundId
        return 0; // Replace with actual logic
    }

    /// @notice Retrieves the timestamp for a specific round ID
    /// @dev This is a placeholder function. The actual implementation should fetch the correct timestamp.
    /// @param roundId The ID of the round to query
    /// @return The timestamp for the given round ID (currently returns 0)
    function getTimestamp(uint256 roundId) external view returns (uint256) {
        // Implement the logic to retrieve the timestamp for a specific roundId
        return 0; // Replace with actual logic
    }

    /// @notice Emitted when the answer is updated
    /// @param current The updated answer
    /// @param roundId The round ID associated with the update
    /// @param timestamp The timestamp when the update occurred
    event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp);

    /// @notice Emitted when a new round starts
    /// @param roundId The ID of the new round
    /// @param startedBy The address that started the new round
    event NewRound(uint256 indexed roundId, address indexed startedBy);
}
```

### Important Considerations

- **Data Simulation:** The contract provides static or placeholder data as it is not connected to a live oracle. Some responses from UIPoolDataProvider might contain empty or placeholder data fields.
- **Customization:** Placeholder functions (getAnswer, getTimestamp) are available for further development if you wish to simulate round-specific data retrieval.


## UIPoolDataProvider

The following fields in UIPoolDataProvider are impacted by the Chainlink bypass implementation:

```typescript
baseCurrencyInfo.networkBaseTokenPriceInUsd = networkBaseTokenPriceInUsdProxyAggregator
      .latestAnswer();
    baseCurrencyInfo.networkBaseTokenPriceDecimals = networkBaseTokenPriceInUsdProxyAggregator
      .decimals();

baseCurrencyInfo
  .marketReferenceCurrencyPriceInUsd = marketReferenceCurrencyPriceInUsdProxyAggregator
  .latestAnswer();
```

### Affected Fields
**networkBaseTokenPriceInUsd:** This field retrieves the latest price of the base token in USD using the latestAnswer() function from the mock networkBaseTokenPriceInUsdProxyAggregator. This value will be a placeholder since the aggregator is not connected to a live oracle.

**networkBaseTokenPriceDecimals:** The number of decimal places for the base token price is obtained from the decimals() function of the mock aggregator. This value will remain constant as defined in the mock contract.

**marketReferenceCurrencyPriceInUsd:** Similar to the base token price, this field fetches the latest price of the market reference currency in USD from the latestAnswer() function of the marketReferenceCurrencyPriceInUsdProxyAggregator, which also provides a placeholder value.


## Useful links

- [UIPoolDataProviderV3](https://github.com/aave/aave-v3-periphery/blob/803c3e7d6d1c6da8d91411f4d085494f7189ea0b/contracts/misc/UiPoolDataProviderV3.sol#L22): Implementation of UIpoolDataProvider and uses of the aggregators.