// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/IAccessControl.sol";

interface IPriceOracle is IAccessControl {
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