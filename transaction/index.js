const uuid = require('uuid/v4');
const Account = require('../account');

const TRANSACTION_TYPE_MAP = {
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  TRANSACT: 'TRANSACT'
};

class Transaction {
  constructor({ id, from, to, value, data, signature }) {
    this.id = id || uuid();
    this.from = from || '-';
    this.to = to || '-';
    this.value = value || 0;
    this.data = data || '-';
    this.signature = signature || '-';
  }

  static createTransaction({ account, to, value }) {
    if (to) {
      const transactionData = {
        id: uuid(),
        from: account.address,
        to,
        value,
        data: {  type: TRANSACTION_TYPE_MAP.TRANSACT }
      };

      return new Transaction({
        ...transactionData,
        signature: account.sign(transactionData)
      });
    }

    return new Transaction({
      data: {
        type: TRANSACTION_TYPE_MAP.CREATE_ACCOUNT,
        accountData: account.toJSON()
      }
    })
  }

  static validateStandardTransaction({ transaction }) {
    return new Promise((resolve, reject) => {
      // Ensure signature is valid against address & data
      const { from, signature } = transaction;
      const transactionData = { ...transaction };
      // delete the signature from the above transaction data object, since it is included already
      delete transactionData.signature;

      // Verify signature
      // Invalid
      if (!Account.verifySignature({ publicKey: from, data: transactionData, signature })
      ) {
        return reject(new Error(`Transaction: ${id} signature is invalid`));
      }
      // Valid
      return resolve();
    });
  }

  static validateCreateAccountTransaction({ transaction }) {
    return new Promise(( resolve, reject ) => {
      const expectedAccountDataFields = Object.keys(new Account().toJSON());
      const fields = Object.keys(transaction.data.accountData);
      // Check that same amount of fields
      if (fields.length !== expectedAccountDataFields.length) {
        return reject(new Error(`The transaction account data has an incorrect number of fields`));
      }
      // Check all fields are present within the expected account data fields
      fields.forEach(field => {
        if (!expectedAccountDataFields.includes(field)) {
          return reject(new Error(`The field: ${field}, is unexpected for account data`));
        }
      });

      return resolve();
    });
  }

  static runTransaction({ state, transaction }) {
    switch(transaction.data.type) {
      case TRANSACTION_TYPE_MAP.TRANSACT:
        Transaction.runStandardTransaction({ state, transaction });
        console.log(' -- Updated account data to reflect the standard transaction.');
        break;
        case TRANSACTION_TYPE_MAP.CREATE_ACCOUNT:
          Transaction.runCreateAccountTransaction({ state, transaction });
          console.log(' -- Stored the account data.');
          break;
      default:
        break;
    }
  }

  static runStandardTransaction({ state, transaction }) {
    const fromAccount = state.getAccount({ address: transaction.from });
    const toAccount = state.getAccount({ address: transaction.to });

    const { value } = transaction;

    fromAccount.balance -= value;
    toAccount.balance += value;

    state.putAccount({ address: transaction.from, accountData: fromAccount });
    state.putAccount({ address: transaction.to, accountData: toAccount });
  }

  static runCreateAccountTransaction({ state, transaction }) {
    const { accountData } = transaction.data;
    const { address } = accountData;

    state.putAccount({ address, accountData });
  }
}

module.exports = Transaction;