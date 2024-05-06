import { 
	ContractFunctionParameters,
	ContractExecuteTransaction, 
	ContractId,
	ContractCallQuery,
	Address
} from "@hashgraph/sdk";
import { fetchTransactionRecord } from "../../utils";


async function isAdmin(walletData, accountId, contractId) {
	console.log(`\n=======================================`);
	console.log(`- Checking Admin privilage in the contract...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("loginAdmin")
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	const contractExecRx = await contractExecSubmit.getReceiptWithSigner(signer);

  console.log(`- Is admin returns: ${contractExecRx.returnValues[0]}`);

	return contractExecRx.returnValues[0] === 2;
}

async function isRegisteredFcn(walletData, accountId, contractId, isFaculty) {
	console.log(`\n=======================================`);
	console.log(`- Checking if registeres in the contract...`);

	const functionCall = isFaculty ? "loginFaculty" : "loginProjectStaff";

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(100000)
		.setFunction(functionCall)
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);

	const result = await fetchTransactionRecord(contractExecSubmit.transactionId);
	const returnValue = Number(result.actions[0].result_data);
	console.log(`- Is registered returns: ${returnValue}`);
	return returnValue === 2;
}

async function registerFacultyFcn(walletData, accountId, contractId, name, department, email) {
	console.log(`\n=======================================`);
	console.log(`- Registering the faculty in the contract...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("registerFaculty", new ContractFunctionParameters().addString(name).addString(department).addString(email))
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	const contractExecRx = await contractExecSubmit.getReceiptWithSigner(signer);

	console.log(`receipt: ${contractExecRx}`);

	console.log(`- Is admin returns: ${contractExecRx.returnValues[0]}`);

	return contractExecRx.returnValues[0] === 2;
}

async function registerStaffFcn(walletData, accountId, contractId, name, email) {
	console.log(`\n=======================================`);
	console.log(`- Registering the staff in the contract...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Execute a contract function (transfer)
	const contractExecTx = await new ContractExecuteTransaction()
		.setContractId(ContractId.fromString(contractId))
		.setGas(3000000)
		.setFunction("registerProjectStaff", new ContractFunctionParameters().addString(name).addString(email))
		.freezeWithSigner(signer);

	const contractExecSign = await contractExecTx.signWithSigner(signer);
	const contractExecSubmit = await contractExecSign.executeWithSigner(signer);
	const contractExecRx = await contractExecSubmit.getReceiptWithSigner(signer);

	console.log(`- Is admin returns: ${contractExecRx.returnValues[0]}`);

	return contractExecRx.returnValues[0] === 2;
}

export {
  isAdmin,
	isRegisteredFcn,
	registerFacultyFcn,
	registerStaffFcn
};
