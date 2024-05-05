import {bytecode} from "./components/hedera/contractData.js";
import {
	Client,
	ContractCreateFlow,
	Hbar,
	ContractDeleteTransaction,
	ContractId,
	PrivateKey,
	AccountId
} from "@hashgraph/sdk";


function getAdmin() {
	const myAccountId = "0.0.4235870";
  const myPrivateKey = "3030020100300706052b8104000a0422042065679b60a5562e11ed1beb7e02e2d5b84aaa0cd03eed109be5b22e07eef8a53b";
	return [myAccountId, myPrivateKey];
}

export function getAdminClient() {
	const [myAccountId, myPrivateKey] = getAdmin();
	const client = Client.forTestnet();
	client.setOperator(myAccountId, myPrivateKey);

  // Set default max transaction fee & max query payment
  client.setMaxTransactionFee(new Hbar(100));
  client.setMaxQueryPayment(new Hbar(50));
	return client;
}

async function adminContractDeploy() {
	console.log(`\n=======================================`);
	console.log(`- Deploying smart contract on Hedera...`);

	const client = getAdminClient();
		
	const contractCreate = new ContractCreateFlow()
		.setGas(3000000)
		.setBytecode(bytecode);

	const contractCreateResp = await contractCreate.execute(client);
	const contractCreateRx = await contractCreateResp.getReceipt(client);

	const cId = contractCreateRx.contractId;
	console.log(`- The smart contract ID is: ${cId}`);
	console.log(`- The smart contract ID in Solidity format is: ${cId.toSolidityAddress()} \n`);

	return [cId, contractCreateResp.transactionId];
}

async function adminContractDelete(contract_id) {
	console.log(`\n=======================================`);
	console.log(`- Deleting the smart contract ${contract_id}...`);

	if(!contract_id) {
		console.log(`- Contract ID is required to delete the contract`);
		return;
	}

	const [myAccountId, myPrivateKey] = getAdmin();
	const client = getAdminClient();

	const transaction = new ContractDeleteTransaction()
		.setContractId(ContractId.fromString(contract_id))
		.setTransferAccountId(AccountId.fromString(myAccountId))
		.freezeWith(client);

	const contractDeleteSign = await transaction.sign(PrivateKey.fromString(myPrivateKey));

	const contractDeleteResp = await contractDeleteSign.execute(client);
	const contractDeleteRx = await contractDeleteResp.getReceipt(client);

	console.log(`- Contract deletion: ${contractDeleteRx.status.toString()}`);

}

export { adminContractDelete, adminContractDeploy };
