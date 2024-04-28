import {bytecode} from "./contractData.js";
import {
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
} from "@hashgraph/sdk";

async function contractDeployFcn(walletData, accountId) {
	console.log(`\n=======================================`);
	console.log(`- Deploying smart contract on Hedera...`);

	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	//Create a file on Hedera and store the hex-encoded bytecode
	// const fileCreateTx = await new FileCreateTransaction()
	// 	.setContents(bytecode)
	// 	.freezeWithSigner(signer);
	// const fileSubmit = await fileCreateTx.executeWithSigner(signer);
	// const fileCreateRx = await provider.getTransactionReceipt(fileSubmit.transactionId);
	// const bytecodeFileId = fileCreateRx.fileId;
	// console.log(`- The smart contract bytecode file ID is: ${bytecodeFileId}`);

	// Create the smart contract
	// const contractCreateTx = await new ContractCreateTransaction()
	// 	.setBytecodeFileId(bytecodeFileId)
	// 	.setGas(3000000)
	// 	.setConstructorParameters(
	// 		new ContractFunctionParameters().addAddress(NaN)
	// 	)
	// 	.freezeWithSigner(signer);

	const contractCreateTx = await new ContractCreateTransaction()
		.setBytecode(bytecode, bytecode.length / 2)
		.setGas(3000000)
		.setConstructorParameters(
			new ContractFunctionParameters()
		)
		.freezeWithSigner(signer)

	const contractCreateSign = await contractCreateTx.signWithSigner(signer);


	const contractCreateResp = await contractCreateSign.executeWithSigner(signer);
	// const contractCreateRx = await provider.getTransactionReceipt(contractCreateSubmit.transactionId);
	const contractCreateRx = await contractCreateResp.getReceiptWithSigner(signer);
	const cId = contractCreateRx.contractId;
	const contractAddress = cId.toSolidityAddress();
	console.log(`- The smart contract ID is: ${cId}`);
	console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

	return [cId, contractCreateResp.transactionId];
}
export default contractDeployFcn;