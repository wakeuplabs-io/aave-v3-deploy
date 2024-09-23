// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/IAccessControl.sol";

interface IFallbackPriceOracle is IAccessControl {
    /// @notice Emitted when an asset's price is updated
    /// @param asset The address of the asset
    /// @param price The updated price of the asset
    /// @param timestamp The timestamp of the update
    event AssetPriceUpdated(address indexed asset, uint256 price, uint256 timestamp);

    /// @notice Emitted when the ETH to USD price is updated
    /// @param price The updated ETH to USD price
    /// @param timestamp The timestamp of the update
    event EthPriceUpdated(uint256 price, uint256 timestamp);

    /**
     * @notice Returns the asset price in the base currency
     * @param asset The address of the asset
     * @return The price of the asset
     **/
    function getAssetPrice(address asset) external view returns (uint256);

    /**
     * @notice Set the price of the asset
     * @param asset The address of the asset
     * @param price The price of the asset
     **/
    function setAssetPrice(address asset, uint256 price) external;
}