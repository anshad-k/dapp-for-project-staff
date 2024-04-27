import { ContractDeleteTransaction } from "@hashgraph/sdk";

async function contractDeleteFcn(walletData, accountId, contractId) {
	console.log(`\n=======================================`);
	console.log(`- Deleting the smart contract...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Execute a contract function (transfer)
	const contractDeleteTx = await new ContractDeleteTransaction()
		.setContractId(contractId)
		.freezeWithSigner(signer);

	const contractDeleteSign = await contractDeleteTx.signWithSigner(signer);
	const contractDeleteSubmit = await contractDeleteSign.executeWithSigner(signer);
	const contractDeleteRx = await provider.getTransactionReceipt(contractDeleteSubmit.transactionId);
	console.log(`- Contract deletion: ${contractDeleteRx.status.toString()}`);

	return contractDeleteSubmit.transactionId;
}

export default contractDeleteFcn;
