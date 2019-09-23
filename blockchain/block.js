const { GENESIS_DATA, MINE_RATE } = require('../config');
const { keccakHash } = require('../util');
const Transaction = require('../transaction');
const Trie = require('../store/trie');

const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt('f'.repeat(HASH_LENGTH), 16);
const MAX_NONCE_VALUE = 2 ** 64;
class Block {
  constructor({ blockHeaders, transactionSeries }) {
    this.blockHeaders = blockHeaders;
    this.transactionSeries = transactionSeries;
  }

  static calculateBlockTargetHash({ lastBlock }) {
    const value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(16);

    if (value.length > HASH_LENGTH) {
      return 'f'.repeat(HASH_LENGTH);
    }

    return '0'.repeat(HASH_LENGTH - value.length) + value;
  }

  static adjustDifficulty({ lastBlock, timestamp }) {
    const  { difficulty } = lastBlock.blockHeaders;

    if ((timestamp - lastBlock.blockHeaders.timestamp) > MINE_RATE) {
      return difficulty -1;
    }

    if(difficulty < 1) {
      return 1;
    }
    // Increase difficulty otherwise
    return difficulty + 1;
  }

  static mineBlock({ 
    lastBlock, 
    beneficiary, 
    transactionSeries,
    stateRoot 
  }) {
    const target = Block.calculateBlockTargetHash({ lastBlock });
    const transactionsTrie = Trie.buildTrie({ items: transactionSeries });
    let timestamp, truncatedBlockHeaders, header, nonce, underTargetHash;

    do {
      timestamp = Date.now();
      truncatedBlockHeaders = {
        parentHash: keccakHash(lastBlock.blockHeaders),
        beneficiary,
        difficulty: Block.adjustDifficulty({ lastBlock, timestamp }),
        number: lastBlock.blockHeaders.number + 1,
        timestamp,  
        transactionsRoot: transactionsTrie.rootHash,
        stateRoot
      };
      header = keccakHash(truncatedBlockHeaders);
      nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
  
      underTargetHash = keccakHash(header + nonce);
      // Execute While loop when the underTargetHash is > target - keep executing the code
    } while (underTargetHash > target);

      return new this({
        blockHeaders: {
          ...truncatedBlockHeaders, 
          nonce
        },
          transactionSeries
      });
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static validateBlock({ lastBlock, block, state }) {
    return new Promise((resolve, reject) => {
      // Check the genesis block is valid
      if (keccakHash(block) === keccakHash(Block.genesis())) {
        return resolve();
      }
      
      // Check that header's hash formatted correctly
      if (keccakHash(lastBlock.blockHeaders) !== block.blockHeaders.parentHash) {
        return reject(new Error("The parent hash must be a hash of the last block's headers"));
      }
      // The block number was incremented by 1
      if(block.blockHeaders.number !== lastBlock.blockHeaders.number + 1) {
        return reject(new Error('The block must increment the number by 1'));
      }
      // The difficulty rate increment/decrement by 1
      if (Math.abs(lastBlock.blockHeaders.difficulty - block.blockHeaders.difficulty) > 1) {
        return reject(new Error('The difficulty must only adjust by 1'));
      }

      const rebuildTransactionsTrie = Trie.buildTrie({ 
        items: block.transactionSeries
      });

      if (rebuildTransactionsTrie.rootHash !== block.blockHeaders.transactionsRoot) {
        return reject(
          new Error(
            `The rebuilt transactions root does not match the block's` +
            `transactions root: ${block.blockHeaders.transactionsRoot}`
          )
        );
      }

      // The block meets the POW requirement - recalc. the target for the block based on the presented last block. 
      // Then we recalculate the underTargetHash, based on the headers from the newly presented block.
      // Then we will check that the calculated underTargetHash actually falls under the calculated block's targetHash.

      // minedBlock produces an underTargetHashValue that falls below the block target hash
      const target = Block.calculateBlockTargetHash({ lastBlock });
      // Recreate the underTarget hash based on the values found in the minedBlock
      const { blockHeaders } = block;
      const { nonce } = blockHeaders;
      const truncatedBlockHeaders = { ...blockHeaders };
      delete truncatedBlockHeaders.nonce;
      const header = keccakHash(truncatedBlockHeaders);
      const underTargetHash = keccakHash(header + nonce);

      if (underTargetHash > target) {
        return reject(
          new Error(
            'The block does not meet the POW requirement'
        ));
      }

      Transaction.validateTransactionSeries({
        state, transactionSeries: block.transactionSeries
      }).then(resolve)
        .catch(reject);
    });
  }

  // The method in the block class called runBlock. This takes an object with the block field and state field.
  static runBlock({ block, state }) {
    for (let transaction of block.transactionSeries) {
      Transaction.runTransaction({ transaction, state });
    }
  }
}

module.exports = Block;
