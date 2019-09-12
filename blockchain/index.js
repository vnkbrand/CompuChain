const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ block }) {
    return new Promise((resolve, reject) => {
      // Add block to chain, ONCE validated
      Block.validateBlock({
        lastBlock: this.chain[this.chain.length-1],
        block
      }).then(() => {
        this.chain.push(block);

        return resolve();
      }).catch(reject);
    });
  }
}

module.exports = Blockchain;
