class TransactionQueue {
  constructor() {
    this.transactionMap = {};
  }

  // Store UNIQUE transactions, by their id in a transactionMap Object
  add(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  // Get the object map of transactions
  getTransactionSeries() {
    return Object.values(this.transactionMap);
  }

  clearBlockTransactions({ transactionSeries }) {
    for (let transaction of transactionSeries) {
      delete this.transactionMap[transaction.id];
    }
  }
}

module.exports = TransactionQueue;