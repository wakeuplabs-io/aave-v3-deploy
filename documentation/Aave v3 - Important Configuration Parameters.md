# Aave v3 - Important Configuration Parameters

## By Market/Network
- **faucet**: Provides small amounts of tokens for testing on test networks.
- **collateralRepay**: Allows loan repayment using collateral assets.
- **permissions**: Manages access control and permissions within the protocol.

## By Asset/Reserve

### Configuration Parameters
- **EMode (Efficiency Mode)**: Increases borrowing power for correlated assets.
- **flashLoanEnabled**: Allows borrowing without collateral within a single transaction.
- **borrowingEnabled**: Permits borrowing against the asset.
- **stableBorrowRateEnabled**: Enables borrowing at a stable interest rate.
- **borrowableIsolation**: Limits borrowing to specific correlated assets for risk management.

### Reserve Strategy
- **optimalUsageRatio**
- **baseVariableBorrowRate**
- **variableRateSlope1**
- **variableRateSlope2**
- **stableRateSlope1**
- **stableRateSlope2**
- **baseStableRateOffset**
- **stableRateExcessOffset**
- **optimalStableToTotalDebtRatio**

### Other Reserve Configs
- **baseLTVAsCollateral**
- **liquidationThreshold**
- **liquidationBonus**
- **liquidationProtocolFee**
- **reserveDecimals**
- **aTokenImpl**
- **reserveFactor**
- **supplyCap**
- **borrowCap**
- **debtCeiling**
