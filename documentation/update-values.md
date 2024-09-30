# Hardhat Tasks Documentation for Managing aTokens, Strategies, and E-Modes

### Overview

This documentation provides detailed instructions on utilizing various Hardhat tasks to manage and configure different aspects of the Aave protocol. These tasks include adding and removing aTokens, reviewing and fixing interest rate strategies, and managing eMode categories. Each task is designed to interact with the core components of the Aave protocol, ensuring that your configurations align with the desired market parameters.

## Red Button

> The Red Button is a Hardhat task designed to enable or disable reserve assets within the Aave protocol. This task interacts with the Pool Configurator to either pause or unpause all reserves or a specific reserve asset based on the provided flags.

### Functionality

- **Task Name**: `red-button`
- **Description**: The task allows you to either enable (unpause) or disable (pause) reserve assets in the Aave protocol.

### Flags and Parameters

- **Flags**:
  - `--enable`: Enables (unpauses) the reserve assets.
  - `--disable`: Disables (pauses) the reserve assets.

- **Optional Parameter**:
  - `--asset`: The address of the specific reserve asset to enable or disable. If this parameter is not provided, the task will apply the action to all reserve assets.

### Execution

1. **Enable All Reserve Assets**:

   ```bash
   npx hardhat red-button --enable --network "bob-sepolia"
    ```

2. **Disable All Reserve Assets:**:

   ```bash
   npx hardhat red-button --disable --network "bob-sepolia"
    ```

3. **Enable a Specific Reserve Asset:**:

   ```bash
   npx hardhat red-button --enable --asset <ASSET_ADDRESS> --network "bob-sepolia"
    ```

4. **Disable a Specific Reserve Asset:**:

   ```bash
   npx hardhat red-button --disable --asset <ASSET_ADDRESS> --network "bob-sepolia"
    ```

## Remove aTokens

> The **Remove aTokens** task is designed to facilitate the removal of specific aTokens from the Aave protocol's reserve configuration. It interacts with various components, such as the Pool Configurator and the Pool Addresses Provider, to effectively remove the aTokens and update the protocol configuration accordingly.

### Functionality

- **Task Name**: `remove-atokens`
- **Description**: This task enables you to remove specific aTokens from the Aave protocol's reserve configuration.

### Flags and Parameters

- **No specific flags**: This task doesn't seem to utilize command-line flags but rather operates based on the configuration and contracts set up within the script.

- **Internal Parameters**: The script likely uses internal parameters defined within the configuration or setup files to specify which aTokens should be removed.

### Execution

To execute this task, follow these steps:

1. **Ensure Configuration**:
   Ensure that the configuration is correctly set up within the script and that the aTokens to be removed are properly identified.

2. **Run the Task**:
   Execute the task using Hardhat in the terminal:

   ```bash
   npx hardhat remove-atokens --network "bob-sepolia"
    ```

## Documentation for Review E-Mode

> The **Review E-Mode** task is designed to review and potentially fix specific eMode categories within the Aave protocol. This task interacts with the Pool Configurator and other related contracts to verify and correct the configuration of eMode categories.

### Functionality

- **Task Name**: `review-e-mode`
- **Description**: This task reviews the configuration of eMode categories and can apply fixes if required.

### Flags and Parameters

- **Flags**:
  - `--fix`: Applies fixes to the eMode category if discrepancies are found.

- **Parameters**:
  - `--id`: The ID of the eMode category to be reviewed.

### Execution

To execute this task, follow these steps:

1. **Review an E-Mode Category**:
   Execute the task using Hardhat in the terminal:

   ```bash
   npx hardhat review-e-mode --id <CATEGORY_ID> --network "bob-sepolia"
    ```

2. **Review and Fix an E-Mode Category**: To review and apply fixes, use the --fix flag:
   Execute the task using Hardhat in the terminal:

   ```bash
   npx hardhat review-e-mode --id <CATEGORY_ID> --fix --network "bob-sepolia"

    ```

## Documentation for Review Rate Strategies

> The **Review Rate Strategies** task is designed to review and potentially fix the interest rate strategies for each reserve within a specified Aave market. The task interacts with the Pool Configurator and related contracts to verify and update the interest rate strategies according to the market's configuration.

### Functionality

- **Task Name**: `review-rate-strategies`
- **Description**: This task reviews the interest rate strategies of reserves and can apply fixes by deploying new strategies if discrepancies are found.

### Flags and Parameters

- **Flags**:
  - `--fix`: Applies fixes by deploying a new InterestRateStrategy contract according to the market configuration.
  - `--deploy`: Deploys a new InterestRateStrategy contract without fixing it.
  
- **Optional Parameters**:
  - `--checkOnly`: A comma-separated list of token symbols to limit the review to specific tokens (e.g., `DAI,USDC,ETH`).

### Execution

To execute this task, follow these steps:

1. **Review Interest Rate Strategies**:
   Execute the task using Hardhat in the terminal:

   ```bash
   npx hardhat review-rate-strategies --network "bob-sepolia"
    ```

2. **Review and Fix Interest Rate Strategies**: To review and apply fixes, use the --fix flag:

   Execute the task using Hardhat in the terminal:

   ```bash
    npx hardhat review-rate-strategies --fix --network "bob-sepolia"
    ```

3. **Review Specific Tokens**: To review specific tokens, use the --checkOnly parameter:

   Execute the task using Hardhat in the terminal:

   ```bash
    npx hardhat review-rate-strategies --checkOnly DAI,USDC,ETH --network "bob-sepolia"
    ```

## Documentation for Review Strategies

> The **Review Strategies** task is designed to review and potentially update the interest rate strategies for each reserve within a specified Aave market. The task interacts with the Pool Configurator and related contracts to ensure that the interest rate strategies align with the market's current configuration.

### Functionality

- **Task Name**: `review-strategies`
- **Description**: This task reviews the interest rate strategies of reserves and can update them if they do not match the desired configuration.

### Flags and Parameters

- **No specific flags or parameters**: This task is designed to review and potentially update the strategies based on the market's configuration set in the environment variables.

### Execution

To execute this task, follow these steps:

1. **Review Interest Rate Strategies**:
   Execute the task using Hardhat in the terminal:

   ```bash
   npx hardhat review-strategies --network "bob-sepolia"
    ```

## Documentation for Add aTokens

> The **Add aTokens** task is designed to facilitate the addition of specific aTokens to the Aave protocol's reserve configuration. It interacts with various components, such as the Pool Configurator and the Pool Addresses Provider, to effectively add the aTokens and update the protocol configuration accordingly.

### Functionality

- **Task Name**: `add-atokens`
- **Description**: This task enables you to add specific aTokens to the Aave protocol's reserve configuration.

### Flags and Parameters

- **No specific flags**: This task doesn't seem to utilize command-line flags but rather operates based on the configuration and contracts set up within the script.

- **Internal Parameters**: The script likely uses internal parameters defined within the configuration or setup files to specify which aTokens should be added.

### Execution

To execute this task, follow these steps:

1. **Ensure Configuration**:
   Ensure that the configuration is correctly set up within the script and that the aTokens to be added are properly identified.

2. **Run the Task**:
   Execute the task using Hardhat in the terminal:

   ```bash
   npx hardhat add-atokens --network "bob-sepolia"
    ```