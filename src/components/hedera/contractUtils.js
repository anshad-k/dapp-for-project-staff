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
		.setGas(200000)
		.setFunction("login", new ContractFunctionParameters())
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);

	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	console.log("result data: ", result.actions[0].result_data);
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

	return returnValue === 2;
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

	return returnValue === 2;
}

export async function addProject(walletData, accountId, contractId, project) {
	console.log(`\n=======================================`);
	console.log(`- Adding a project in the contract...`);

	const signer = getSigner(walletData, accountId);

	if(project.startDate > project.endDate || project.salary <= 0 || project.staffIds.length === 0 || project.facultyIds.length === 0) {
		console.log(`Invalid project data...`);
		return false;
	}
	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("addProject", 
			new ContractFunctionParameters()
				.addString(project.title)
				.addString(project.description)
				.addUint64(project.startDate)
				.addUint64(project.endDate)
				.addUint32(project.salary)
				.addUint16Array(project.staffIds)
				.addUint16Array(project.facultyIds)
		)
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	
	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = Number(result.actions[0].result_data);

	return returnValue === 2;
}

export async function extendProject(walletData, accountId, contractId, projectId, endDate) {
	console.log(`\n=======================================`);
	console.log(`- Extending a project in the contract...`);

	const signer = getSigner(walletData, accountId);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("getExtendedPeriod", 
			new ContractFunctionParameters()
				.addUint16(projectId)
				.addUint64(endDate)
		)
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	
	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = Number(result.actions[0].result_data);

	return returnValue === 2;
}

export async function approveProject(walletData, accountId, contractId, projectId, approval) {
	console.log(`\n=======================================`);
	console.log(`- Approving a project in the contract...`);

	const signer = getSigner(walletData, accountId);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("approveProject", 
			new ContractFunctionParameters()
				.addUint16(projectId)
				.addBool(approval)
		)
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	
	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = Number(result.actions[0].result_data);

	return returnValue === 2;
}
