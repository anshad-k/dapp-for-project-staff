import { 
	ContractFunctionParameters,
	ContractExecuteTransaction, 
	ContractId,
} from "@hashgraph/sdk";
import { fetchTransactionRecord } from "../../utils";

function getSigner(walletData, accountId) {
	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	return hashconnect.getSigner(provider);
}

export async function userLogin(walletData, accountId, contractId) {
	console.log(`\n=======================================`);
	console.log(`- User logging in the contract...`);

	const signer = getSigner(walletData, accountId);

	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(100000)
		.setFunction("loginUser")
		.freezeWithSigner(signer);
	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);

	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = Number(result.actions[0].result_data);

	return returnValue;
}

export async function registerFacultyFcn(walletData, accountId, contractId, name, department, email) {
	console.log(`\n=======================================`);
	console.log(`- Registering the faculty in the contract...`);

	const signer = getSigner(walletData, accountId);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("registerFaculty", new ContractFunctionParameters().addString(name).addString(department).addString(email))
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	
	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = Number(result.actions[0].result_data);

	return returnValue[0] === 2;
}

export async function registerStaffFcn(walletData, accountId, contractId, name, email) {
	console.log(`\n=======================================`);
	console.log(`- Registering the staff in the contract...`);

	const signer = getSigner(walletData, accountId);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("registerProjectStaff", new ContractFunctionParameters().addString(name).addString(email))
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	
	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = Number(result.actions[0].result_data);

	return returnValue[0] === 2;
}
