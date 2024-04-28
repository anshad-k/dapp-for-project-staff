import { ContractFunctionParameters, ContractExecuteTransaction } from "@hashgraph/sdk";

async function getFacultyDetailsFcn(walletData, accountId, contractId) {
	console.log(`\n=======================================`);
	console.log(`- Getting the faculty details in the contract...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(300000000)
		.setFunction("getAllFaculties", new ContractFunctionParameters())
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	const contractExecRx = await provider.getTransactionReceipt(contractExecSubmit.transactionId);

  console.log(`- Faculty details: ${contractExecRx.returnValues[0]}`);

	return contractExecRx.returnValues[0];
}

export default getFacultyDetailsFcn;
