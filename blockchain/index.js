const Block = require('./block');

class Blockchain {
  constructor({ state }) {
    this.chain = [Block.genesis()];
    this.state = state;
  }

  addBlock({ block, transactionQueue }) {
    return new Promise((resolve, reject) => {
      // Add block to chain, ONCE validated
      Block.validateBlock({
        lastBlock: this.chain[this.chain.length-1],
        block,
        state: this.state
      }).then(() => {
        this.chain.push(block);

        Block.runBlock({ block, state: this.state });

        transactionQueue.clearBlockTransactions({
          transactionSeries: block.transactionSeries
        });

        return resolve();
      }).catch(reject);
    });
  }

  replaceChain({ chain }) {
    return new Promise(async (resolve, reject) => {
      for (let i=0; i<chain.length; i++) {
        const block = chain[i];
        const lastBlockIndex = i-1;
        // Check if last block index is > 0 e.g not the genesis block as (i = -1) is invalid
        const lastBlock = lastBlockIndex >= 0 ? chain[i-1] : null;
        
        try {
          await Block.validateBlock({ lastBlock, block, state: this.state });
          Block.runBlock({ block, state: this.state });
        } catch (error) {
          return reject(error);
        }

        console.log(`*-- Validated block number: ${block.blockHeaders.number}`);
      }

      this.chain = chain;

      return resolve();
    });
  }
}

module.exports = Blockchain;
