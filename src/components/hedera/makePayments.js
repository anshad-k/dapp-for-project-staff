import { ContractFunctionParameters, ContractExecuteTransaction, ContractId } from "@hashgraph/sdk";

async function makePayments(walletData, accountId, contractId) {
	console.log(`\n=======================================`);
	console.log(`- making payments to staffs in the contract...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("makePayments")
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	const contractExecRx = await provider.getTransactionReceipt(contractExecSubmit.transactionId);

  console.log(`- Faculty details: ${contractExecRx.returnValues[0]}`);

	return contractExecRx.returnValues[0];
}

export default makePayments;
