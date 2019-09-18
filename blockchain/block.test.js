const Block = require('./block');
const { keccakHash } = require('../util');

describe('Block', () => {
  describe('calculateBlockTargetHash()', () => {
    it('calculates the maximum hash when the last block difficulty is 1', () => {
      expect (
        Block.calculateBlockTargetHash({ lastBlock: { blockHeaders: { difficulty: 1 } } })
      ).toEqual('f'.repeat(64));
    });

    it('calculates a low hash value when the last block difficulty is high', () => {
      expect (
        Block.calculateBlockTargetHash({ lastBlock: { blockHeaders: { difficulty: 500 } } }) < '1'
      ).toBe(true);
    });
  });

  describe('mineBlock', () => {
    let lastBlock, minedBlock;

    beforeEach(() => {
      lastBlock = Block.genesis();
      minedBlock = Block.mineBlock({ 
        lastBlock, 
        beneficiary: 'beneficiary',
        transactionSeries: []
      });
    });

    it('mines a block', () => {
      expect(minedBlock).toBeInstanceOf(Block);
    });

    it('mines a block that meets the proof of work requirement', () => {
      // minedBlock produces an underTargetHashValue that falls below the block target hash
      const target = Block.calculateBlockTargetHash({ lastBlock });
      // Recreate the underTarget hash based on the values found in the minedBlock
      const { blockHeaders } = minedBlock;
      const { nonce } = blockHeaders;
      const truncatedBlockHeaders = { ...blockHeaders };
      delete truncatedBlockHeaders.nonce;
      const header = keccakHash(truncatedBlockHeaders);
      const underTargetHash = keccakHash(header + nonce);
      
      // In order to meet the POW requirement, the underTargetHash should be below the 'target' value
      expect(underTargetHash < target).toBe(true);
    });
  }); 

  describe('adjustDifficulty', () => {
    it('keeps the difficulty above 0', () => {
      expect(
        Block.adjustDifficulty({
          lastBlock: { blockHeaders: { difficulty: 0 } },
          timestamp: Date.now()
        })
      ).toEqual(1);
    });

    it('increases the difficulty for a quickly mined block', () => {
      expect(
        Block.adjustDifficulty({
          lastBlock: { blockHeaders: { difficulty: 5, timestamp: 1000 } },
          timestamp: 3000
        })
      ).toEqual(6);
    });

    it('decreases the difficulty for a slowly mined block', () => {
      expect(
        Block.adjustDifficulty({
          lastBlock: { blockHeaders: { difficulty: 5, timestamp: 1000 } },
          timestamp: 20000
        })
      ).toEqual(4);
    });
  });

  describe('validateBlock()', () => {
    let block, lastBlock;

    beforeEach(() => {
      lastBlock = Block.genesis();
      block = Block.mineBlock({ 
        lastBlock, 
        beneficiary: 'beneficiary',
        transactionSeries: []
      });
    });

    it('resolves when the block is the genesis block', () => {
      expect(Block.validateBlock({ block: Block.genesis() })).resolves;
    });

    it('resolves if the block is valid', () => {
      expect(Block.validateBlock({ lastBlock, block })).resolves;
    });

    it('rejects when the parentHash is invalid', () => {
      block.blockHeaders.parentHash = 'foo';

      expect(Block.validateBlock({ lastBlock, block }))
      .rejects
      .toMatchObject({ message: "The parent hash must be a hash of the last block's headers" });
    });

    it('rejects when the number is not increased by one', () => {
      block.blockHeaders.number = 500;

      expect(Block.validateBlock({ lastBlock, block }))
      .rejects
      .toMatchObject({ message: "The block must increment the number by 1" });
    });

    it('rejects when the difficulty adjusts by more than 1', () => {
      block.blockHeaders.difficulty = 999;

      expect(Block.validateBlock({ lastBlock, block }))
      .rejects
      .toMatchObject({ message: "The difficulty must only adjust by 1" });
    });

    it('rejects when a POW requirement is not met', () => {
      const originalCalculateBlockTargetHash = Block.calculateBlockTargetHash;

      Block.calculateBlockTargetHash = () => {
        return '0'.repeat(64)
      }

      expect(Block.validateBlock({ lastBlock, block }))
      .rejects
      .toMatchObject({ message: "The block does not meet the POW requirement" });

      Block.calculateBlockTargetHash = originalCalculateBlockTargetHash;
    });
  });
});