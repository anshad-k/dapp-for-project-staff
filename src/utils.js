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

export async function fetchTransactionRecord(transactionID) {
	const transactionId = formatTransactionId(transactionID);
	const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/results/${transactionId}/actions`;
	const result = await fetch(url)
		.then(resp => resp.json())
		.catch(err => {console.error(err)});
	return result;
}
