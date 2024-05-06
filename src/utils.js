const axios = require('axios').default;

export const ProjectStatus = Object.freeze({
  PENDING: 0, 
  APPROVED: 1, 
  REJECTED: 2, 
  COMPLETED: 3,
  EXTENSION: 4
});


function formatTransactionId(transactionId) {
	const [userId, transaction] = transactionId.split('@')
	return [userId, ...transaction.split('.')].join('-');
}

const delay = ms => new Promise(res => setTimeout(res, ms));

export async function fetchTransactionRecord(transactionID) {
	await delay(3000);
	const transactionId = formatTransactionId(transactionID);
	const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/results/${transactionId}/actions`;
	const result = await axios.get(url)
		.then(resp => resp.data)
		.catch(err => {console.error(err)});
	return result;
}
