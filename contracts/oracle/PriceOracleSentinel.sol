// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

// Dependencies
import {AggregatorInterface} from '../dependencies/chainlink/AggregatorInterface.sol';

// Libraries
import {Errors} from '../libraries/helpers/Errors.sol';

// Interfaces
import {IACLManager} from '../interfaces/IACLManager.sol';
import {IPoolAddressesProvider} from '../interfaces/IPoolAddressesProvider.sol';
import {IPriceOracleSentinel} from '../interfaces/IPriceOracleSentinel.sol';
import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';
import {IAaveOracle} from '../interfaces/IAaveOracle.sol';

/**
 * @title AaveOracle
 * @author Aave
 * @notice Contract to get asset prices, manage price sources and update the fallback oracle
 * - Use of Chainlink Aggregators as first source of price
 * - If the returned price by a Chainlink aggregator is <= 0, the call is forwarded to a fallback oracle
 * - Owned by the Aave governance
 */
contract PriceOracleSentinel is IPriceOracleSentinel {
  IACLManager private aclManager;
  uint256 internal _gracePeriod;

  /**
   * @dev Only risk or pool admin can call functions marked by this modifier.
   */
  modifier onlyRiskOrPoolAdmins() {
    require(
      aclManager.isRiskAdmin(msg.sender) || aclManager.isPoolAdmin(msg.sender),
      Errors.CALLER_NOT_RISK_OR_POOL_ADMIN
    );
    _;
  }

  /**
   * @notice Constructor
   * @param provider The address of the new PoolAddressesProvider
   */
  constructor(
    IPoolAddressesProvider provider,
    uint256 gracePeriod
  ) {
    aclManager = IACLManager(provider.getACLManager());
    _gracePeriod = gracePeriod;
  }

  /**
   * @notice Checks the sequencer oracle is healthy: is up and grace period passed.
   * @return True if the SequencerOracle is up and the grace period passed, false otherwise
   */
  function _isUpAndGracePeriodPassed(uint256 latestAnswer, uint256 lastUpdate) internal view returns (bool) {
    return latestAnswer == 0 || block.timestamp - lastUpdate > _gracePeriod; //TODO: check the answer is not 0. Before it was &&
  }

  /// @inheritdoc IPriceOracleSentinel
  function setGracePeriod(uint256 newGracePeriod) public onlyRiskOrPoolAdmins {
    _gracePeriod = newGracePeriod;
    emit GracePeriodUpdated(newGracePeriod);
  }

  /// @inheritdoc IPriceOracleSentinel
  function getGracePeriod() public view returns (uint256) {
    return _gracePeriod;
  }
}
