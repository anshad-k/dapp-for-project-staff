import { ContractFunctionParameters, ContractExecuteTransaction, ContractId, AccountId } from "@hashgraph/sdk";
import Long from "long";

export async function makePayment(walletData, accountId, contractId, staffAddress, amount) {
	console.log(`\n=======================================`);
	console.log(`- making payments to staffs in the contract...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	const receipient = new AccountId(staffAddress);
	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("makePayments")
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);

	const result = await provider.getTransactionReceipt(contractExecSubmit.transactionId);
	console.log(`Result:\n ${JSON.stringify(result)}`);
}

