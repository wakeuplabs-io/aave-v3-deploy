// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract EACAggregatorProxy {
    uint8 private constant DECIMALS = 18;
    int256 private latestAnswerValue;
    uint256 private latestRoundId;
    uint256 private latestTimestampValue;

    constructor() {
      latestAnswerValue = int256(2 * 10 ** DECIMALS);
    }

    function decimals() external view returns (uint8) {
        return DECIMALS;
    }

    function latestAnswer() external view returns (int256) {
        return latestAnswerValue;
    }

    function latestTimestamp() external view returns (uint256) {
        return latestTimestampValue;
    }

    function latestRound() external view returns (uint256) {
        return latestRoundId;
    }

    function getAnswer(uint256 roundId) external view returns (int256) {
        // Implement the logic to retrieve the answer for a specific roundId
        return 0; // Replace with actual logic
    }

    function getTimestamp(uint256 roundId) external view returns (uint256) {
        // Implement the logic to retrieve the timestamp for a specific roundId
        return 0; // Replace with actual logic
    }

    function updateAnswer(int256 _answer) external {
        latestAnswerValue = _answer;
        latestRoundId++;
        latestTimestampValue = block.timestamp;
        emit AnswerUpdated(_answer, latestRoundId, latestTimestampValue);
        emit NewRound(latestRoundId, msg.sender);
    }

    event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp);
    event NewRound(uint256 indexed roundId, address indexed startedBy);
}
