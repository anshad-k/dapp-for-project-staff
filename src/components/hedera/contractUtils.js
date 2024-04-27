import { ContractFunctionParameters, ContractExecuteTransaction } from "@hashgraph/sdk";

async function isAdmin(walletData, accountId, contractId) {
	console.log(`\n=======================================`);
	console.log(`- Checking Admin privilage in the contract...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(3000000)
		.setFunction("loginAdmin", new ContractFunctionParameters())
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	const contractExecRx = await provider.getTransactionReceipt(contractExecSubmit.transactionId);

  console.log(`- Faculty details: ${contractExecRx.returnValues[0]}`);

	return contractExecRx.returnValues[0] === 2;
}

export {
  isAdmin
};
