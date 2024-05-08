const {
	Client,
	ContractCreateFlow,
	Hbar,
} = require("@hashgraph/sdk");
require("dotenv").config();
const fs = require("fs");

const contractABI = require("./src/contracts/projectStaffContractIITM.json");

function getAdmin() {
	const myAccountId = process.env.ADMIN_ACCOUNT_ID;
  const myPrivateKey = process.env.ADMIN_PRIVATE_KEY;
	if(!myAccountId || !myPrivateKey == null) {
		console.log(`- Admin account ID and private key required for contract deployment`);
		process.exit(1);
	}
	return [myAccountId, myPrivateKey];
}

// module.exports = {getAdmin};

function getAdminClient() {
	const [myAccountId, myPrivateKey] = getAdmin();
	const client = Client.forTestnet();
	client.setOperator(myAccountId, myPrivateKey);
	return client;
}

async function adminContractDeploy() {
	console.log(`\n=======================================`);
	console.log(`- Deploying smart contract on Hedera...`);

	const client = getAdminClient();
	const bytecode = contractABI.data.bytecode.object;
		
	const contractCreate = new ContractCreateFlow()
		.setGas(3000000)
		.setBytecode(bytecode);

	const contractCreateResp = await contractCreate.execute(client);
	const contractCreateRx = await contractCreateResp.getReceipt(client);

	const cId = contractCreateRx.contractId;
	console.log(`- The smart contract ID is: ${cId}`);
	console.log(`- The smart contract ID in Solidity format is: ${cId.toSolidityAddress()} \n`);

	fs.writeFileSync('./src/contracts/contractId.js', `export const contractId = "${cId}";`);

	return[cId, contractCreateResp.transactionId];
}

adminContractDeploy();