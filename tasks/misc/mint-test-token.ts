import { task } from "hardhat/config";
import { waitForTx, ZERO_ADDRESS } from "../../helpers";

task('mint', 'Mint test token')
    .addParam('faucet', 'Faucet contract address')
    .addParam('token', 'Token contract address')
    .addOptionalParam('to', 'recipient address', ZERO_ADDRESS)
    .addOptionalParam('amount', 'amount to mint', '1')
    .setAction(async (taskArgs, hre) => {
        let { faucet, token, to, amount } = taskArgs;
        const [signer] = await hre.ethers.getSigners();

        if (to === ZERO_ADDRESS) {
            to = signer.address;
        }

        const amountBn = hre.ethers.BigNumber.from(amount);
        const weiAmount = amountBn.mul(hre.ethers.BigNumber.from(10).pow(18));

        const faucetContract = new hre.ethers.Contract(faucet, [
            'function getMaximumMintAmount() view returns (uint256)',
            'function setMaximumMintAmount(uint256 amount)',
            'function isMintable(address token) view returns (bool)',
            'function setMintable(address token, bool mintable)',
            'function mint(address token, address to, uint256 amount)'], signer);

        if (!(await faucetContract.isMintable(token))) {
            const setMintableTx = await faucetContract.setMintable(token, true);
            console.log('Setting mintable to true', setMintableTx.hash);
            await waitForTx(setMintableTx);
        }

        if (amountBn.gt(await faucetContract.getMaximumMintAmount())) {
            const setMaxTx = await faucetContract.setMaximumMintAmount(amountBn);
            console.log('Setting maximum mint amount', setMaxTx.hash);
            await waitForTx(setMaxTx);
        }

        console.log('Minting', amount, 'tokens to', to);
        const tx = await faucetContract.mint(token, to, weiAmount);
        console.log('tx', tx.hash)
        const receipt = await waitForTx(tx);
        console.log('Status', receipt.status);
    });
