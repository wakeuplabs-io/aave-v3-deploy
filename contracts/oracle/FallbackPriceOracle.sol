// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {IFallbackPriceOracle} from "./IFallbackPriceOracle.sol";

/// @title FallbackPriceOracle Contract
/// @notice This contract manages asset prices and the ETH to USD price, with access control for updating these prices.
/// @dev Implements IFallbackPriceOracle and uses OpenZeppelin's AccessControl for role management.
contract FallbackPriceOracle is AccessControl, IFallbackPriceOracle {
    /// @notice Identifier for the OWNER_ADMIN role
    bytes32 public constant OWNER_ADMIN = keccak256("OWNER_ADMIN");

    /// @dev Mapping of asset prices (asset => price)
    mapping(address => uint256) internal prices;

    /// @dev Stores the price of ETH in USD
    uint256 internal ethPriceUsd;

    /// @notice Constructor that grants the OWNER_ADMIN and DEFAULT_ADMIN_ROLE to the deployer
    constructor() {
        _grantRole(OWNER_ADMIN, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @inheritdoc IFallbackPriceOracle
    function getAssetPrice(address asset) external view override returns (uint256) {
        return prices[asset];
    }

    /// @inheritdoc IFallbackPriceOracle
    function setAssetPrice(address asset, uint256 price) external override onlyRole(OWNER_ADMIN) {
        prices[asset] = price;
        emit IFallbackPriceOracle.AssetPriceUpdated(asset, price, block.timestamp);
    }

    /// @notice Returns the price of ETH in USD
    /// @return The price of ETH in USD
    function getEthUsdPrice() external view returns (uint256) {
        return ethPriceUsd;
    }

    /// @notice Updates the ETH to USD price
    /// @dev Can only be called by an account with the OWNER_ADMIN role
    /// @param price The new ETH to USD price
    function setEthUsdPrice(uint256 price) external onlyRole(OWNER_ADMIN) {
        ethPriceUsd = price;
        emit IFallbackPriceOracle.EthPriceUpdated(price, block.timestamp);
    }
}
