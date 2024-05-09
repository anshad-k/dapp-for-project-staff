import { 
	ContractFunctionParameters,
  ContractExecuteTransaction,
	ContractId,
} from "@hashgraph/sdk";
import { fetchTransactionRecord } from "../../utils";
import { decodeFacultyData, decodeProjectData, decodeProjectStaffData } from "./contractDecode";

function getSigner(walletData, accountId) {
	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	return hashconnect.getSigner(provider);
}

export async function fetchFaculties(walletData, accountId, contractId) {
  console.log(`\n=======================================`);
	console.log(`- Getting the faculty details in the contract...`);

  const signer = getSigner(walletData, accountId);

  const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("getAllFaculties")
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);

	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = result.actions[0].result_data;

	const faculties = decodeFacultyData(returnValue.toString());
	console.log(`Faculties:\n `, faculties);
	return faculties;
}

export async function fetchProjectStaffs(walletData, accountId, contractId) {
  console.log(`\n=======================================`);
	console.log(`- Getting the project staffs details in the contract...`);

  const signer = getSigner(walletData, accountId);

  const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("getAllProjectStaffs")
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);

	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = result.actions[0].result_data;

	const projectStaffs = decodeProjectStaffData(returnValue.toString());
	console.log(`Project Staffs:\n `, projectStaffs);
	return projectStaffs;
}

export async function fetchProjects(walletData, accountId, contractId, fetchAll) {
  console.log(`\n=======================================`);
	console.log(`- Getting the project details in the contract...`);

  const signer = getSigner(walletData, accountId);

  const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("getAllProjects", new ContractFunctionParameters().addBool(fetchAll))
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);

	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);

	console.log(`Result:\n ${JSON.stringify(result)}`);
	const returnValue = result.actions[0].result_data;

	const projects = decodeProjectData(returnValue.toString());
	console.log(`Projects:\n `, projects);
	return projects;
}

