// SPDX-License-Identifier: MIT
// Chainlink Contracts v0.8
pragma solidity ^0.8.0;

import { AggregatorInterface } from "../chainlink/AggregatorInterface.sol";

interface IAggregatorRedstoneInterface {
  /**
   * @dev return value of single asset
   * @param asset asset address
   * @return uint256 value decimals are scaled according to convertDecimals function
   */
  function priceOf(address asset) external view returns (uint256);

  /**
   * @notice Returns block timestamp of the latest successful update
   * @return blockTimestamp The block timestamp of the latest successful update
   */
  function getBlockTimestampFromLatestUpdate() external view returns (uint256 blockTimestamp);

  function getLatestRoundId() external view returns (uint256 latestRoundId);
}

contract AggregatorRedstone is AggregatorInterface {
  IAggregatorRedstoneInterface public immutable oracle;
  address public immutable asset;

  constructor(address _oracle, address _asset) {
    oracle = IAggregatorRedstoneInterface(_oracle);
    asset = _asset;
  }

  function latestAnswer() external view returns (int256) {
    return int256(oracle.priceOf(asset));
  }

  function latestTimestamp() external view returns (uint256) {
    return oracle.getBlockTimestampFromLatestUpdate();
  }

  function latestRound() external view returns (uint256) {
    return oracle.getLatestRoundId();
  }

  function getAnswer(uint256 roundId) external pure returns (int256) {
    revert ("Not implemented");
  }

  function getTimestamp(uint256 roundId) external pure returns (uint256) {
    revert ("Not implemented");
  }
}
