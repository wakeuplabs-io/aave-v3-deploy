// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Dependencies
import "@openzeppelin/contracts/access/AccessControl.sol";

// Libraries
import {Errors} from '../libraries/helpers/Errors.sol';

// Interfaces
import {IFallbackPriceOracle} from "./IFallbackPriceOracle.sol";
import { PriceOracleSentinel } from './PriceOracleSentinel.sol';
import { IPoolAddressesProvider } from '../interfaces/IPoolAddressesProvider.sol';

contract FallbackPriceOracle is AccessControl, IFallbackPriceOracle, PriceOracleSentinel {
    bytes32 public constant OWNER_ADMIN = keccak256("OWNER_ADMIN");

    mapping(address => uint256) internal prices;
    mapping(address => uint256) internal lastUpdated;

    uint256 internal ethPriceUsd;
    uint256 internal lastEthPriceUsdUpdate;

    event AssetPriceUpdated(address asset, uint256 price, uint256 timestamp);
    event EthPriceUpdated(uint256 price, uint256 timestamp);

  /**
   * @notice Constructor
   * @param provider The address of the new PoolAddressesProvider
   * @param gracePeriod Time in seconds after which the oracle is considered unhealthy
   */
    constructor(
        IPoolAddressesProvider provider,
        uint256 gracePeriod
    ) PriceOracleSentinel(provider, gracePeriod) {
        _grantRole(OWNER_ADMIN, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @inheritdoc IFallbackPriceOracle
    function getAssetPrice(
        address asset
    ) external view override returns (uint256) {
        bool stale = _isUpAndGracePeriodPassed(prices[asset], lastUpdated[asset]);
        if (stale) {
            revert(Errors.AGGREGATOR_IS_STALE);
        }

        return prices[asset];
    }

    /// @inheritdoc IFallbackPriceOracle
    function setAssetPrice(
        address asset,
        uint256 price
    ) external override onlyRole(OWNER_ADMIN) {
        prices[asset] = price;
        lastUpdated[asset] = block.timestamp;
        emit AssetPriceUpdated(asset, price, block.timestamp);
    }

    function getEthUsdPrice() external view returns (uint256) {
        bool stale = _isUpAndGracePeriodPassed(ethPriceUsd, lastEthPriceUsdUpdate);
        if (stale) {
            revert(Errors.AGGREGATOR_IS_STALE);
        }

        return ethPriceUsd;
    }

    function setEthUsdPrice(uint256 price) external onlyRole(OWNER_ADMIN) {
        ethPriceUsd = price;
        emit EthPriceUpdated(price, block.timestamp);
    }
}