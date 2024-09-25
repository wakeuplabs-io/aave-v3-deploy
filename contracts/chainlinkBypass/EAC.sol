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
