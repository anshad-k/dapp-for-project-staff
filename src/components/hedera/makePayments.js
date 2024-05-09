import { TransferTransaction, AccountId, Hbar, PrivateKey, Client } from "@hashgraph/sdk";

function getAdmin() {
	const myAccountId = "0.0.4235870"
  const myPrivateKey = "3030020100300706052b8104000a0422042065679b60a5562e11ed1beb7e02e2d5b84aaa0cd03eed109be5b22e07eef8a53b";
	if(!myAccountId || !myPrivateKey == null) {
		console.log(`- Admin account ID and private key required for contract deployment`);
		process.exit(1);
	}
	return [myAccountId, myPrivateKey];
}

export async function paySalary(walletData, accountId, receiver, amount) {
	console.log(`\n=======================================`);
	console.log(`- Paying salary for a project in the contract...`);

	const [adminAccountId, adminPrivateKey] = getAdmin();

	const client = Client.forTestnet();
	client.setOperator(adminAccountId, adminPrivateKey);


	//Execute a contract function (transfer)
	const transferTx = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(accountId), Hbar.fromTinybars(-1 * amount))
        .addHbarTransfer(AccountId.fromString(receiver), Hbar.fromTinybars(amount))
        .freezeWith(client);
    const transferSign = await transferTx.sign(PrivateKey.fromString(adminPrivateKey));
    const transferSubmit = await transferSign.execute(client);
		const transferReceipt = await transferSubmit.getReceipt(client);

		const result = transferReceipt.status.toString();
		console.log(`- The transfer status is: ${result}`);
		return result == "SUCCESS";
}

