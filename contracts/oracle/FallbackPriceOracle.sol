// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {IFallbackPriceOracle} from "./IFallbackPriceOracle.sol";

contract FallbackPriceOracle is AccessControl, IFallbackPriceOracle {
    bytes32 public constant OWNER_ADMIN = keccak256("OWNER_ADMIN");

    // Map of asset prices (asset => price)
    mapping(address => uint256) internal prices;
    mapping(address => uint256) internal lastUpdated;

    uint256 internal ethPriceUsd;

    event AssetPriceUpdated(address asset, uint256 price, uint256 timestamp);
    event EthPriceUpdated(uint256 price, uint256 timestamp);

    constructor() {
        _grantRole(OWNER_ADMIN, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function getAssetPrice(
        address asset
    ) external view override returns (uint256) {
        return prices[asset];
    }

    function setAssetPrice(
        address asset,
        uint256 price
    ) external override onlyRole(OWNER_ADMIN) {
        prices[asset] = price;
        lastUpdated[asset] = block.timestamp;
        emit AssetPriceUpdated(asset, price, block.timestamp);
    }

    function getEthUsdPrice() external view returns (uint256) {
        return ethPriceUsd;
    }

    function setEthUsdPrice(uint256 price) external onlyRole(OWNER_ADMIN) {
        ethPriceUsd = price;
        emit EthPriceUpdated(price, block.timestamp);
    }
}