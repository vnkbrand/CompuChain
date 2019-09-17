# COMPUCHAIN

A complete Proof-of-Stake blockchain.

A fully-functional decentralised computer that is based on Ethereum's architecture.

## The scope of this project includes:

1. The language for smart contracts.
2. The development and implementation of the blockchain.
3. A system that supports a network of servers.
4. Transaction and Account objects.
5. The state management object. 

All of these allow for a fully-functional decentralised computer.

## Ethereum - High-Level

ETH is its own computer, utilsing all machines on its network using its blockchain.

Uses the blockchain to store transactional data. These are transactions of state and allows all computers to sync.

# SMART CONTRACT LANGUAGE

const STOP = 'STOP';
const ADD = 'ADD';
const PUSH = 'PUSH';

class Interpreter {
  constructor() {
    this.state = {
      programCounter: 0,
      stack: [],
      code: []
    };
  }

  runCode(code) {
    this.state.code = code;

    while (this.state.programCounter < this.state.code.length) {
      const opCode = this.state.code[this.state.programCounter];

      try {
        switch (opCode) {
          case STOP:
            throw new Error('Execution is complete');
          case PUSH:
            this.state.programCounter++;
            const value = this.state.code[this.state.programCounter];
            this.state.stack.push(value);
            break;
          case ADD:
            const a = this.state.stack.pop();
            const b = this.state.stack.pop();

            this.state.stack.push(a+b);
            break;
          default:
            break;
          }
        } catch (error) {
          return this.state.stack[this.state.stack.length-1];
        }

      this.state.programCounter++;
    }
  }
}

const code = [PUSH, 2, PUSH, 3, ADD, STOP];
const interpreter = new Interpreter();
interpreter.runCode(code);

OUTPUT => 5

*This is a working interpreter and is the foundation for a working smart contract language.

# ADDING MUL & DIV

const STOP = 'STOP';
const ADD = 'ADD';
const SUB = 'SUB';
const MUL = 'MUL';
const DIV = 'DIV';
const PUSH = 'PUSH';

class Interpreter {
  constructor() {
    this.state = {
      programCounter: 0,
      stack: [],
      code: []
    };
  }

  runCode(code) {
    this.state.code = code;

    while (this.state.programCounter < this.state.code.length) {
      const opCode = this.state.code[this.state.programCounter];

      try {
        switch (opCode) {
          case STOP:
            throw new Error('Execution is complete');
          case PUSH:
            this.state.programCounter++;
            const value = this.state.code[this.state.programCounter];
            this.state.stack.push(value);
            break;
          case ADD:
          case SUB:
          case MUL:
          case DIV:
            const a = this.state.stack.pop();
            const b = this.state.stack.pop();

            let result;

            if (opCode === ADD) result = a + b;
            if (opCode === SUB) result = a - b;
            if (opCode === MUL) result = a * b;
            if (opCode === DIV) result = a / b;

            this.state.stack.push(result);
            break;
          default:
            break;
          }
        } catch (error) {
          return this.state.stack[this.state.stack.length-1];
        }

      this.state.programCounter++;
    }
  }
}

let code = [PUSH, 2, PUSH, 3, ADD, STOP];
let result = new Interpreter().runCode(code);
console.log('Result of 3 ADD 2:', result);

code = [PUSH, 2, PUSH, 3, SUB, STOP];
result = new Interpreter().runCode(code);
console.log('Result of 3 SUB 2:', result);

code = [PUSH, 2, PUSH, 3, MUL, STOP];
result = new Interpreter().runCode(code);
console.log('Result of 3 MUL 2:', result);

code = [PUSH, 2, PUSH, 3, DIV, STOP];
result = new Interpreter().runCode(code);
console.log('Result of 3 DIV 2:', result);

**********************************************

# ADDING JEST TEST

1. Initialise a skeleton JS project

npm init -y

2. Install Jest module

npm i jest --save

3. Amend package.json file

"test": "jest --watchAll"

4. Create test file

index.test.js

 Methodology of Testing

 Jest uses:

 1. describe() - takes 2 arguments.
 a. A string that describes a set of tests that the describe block will contain
 b. A callback function that contains the actual test

 The body of the callback function contains further testing blocks - further describe functions

## One Suite of Tests

describe('Interpreter', () => {
  describe('runCode()', () => {
    describe('and the code includes the ADD', () => {
      it('adds two values', () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, ADD, STOP])
        ).toEqual(5);
      });
    });

    describe('and the code includes the SUB', () => {
      it('subtracts one value from another', () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, SUB, STOP])
        ).toEqual(1);
      });
    });

    describe('and the code includes the MUL', () => {
      it('multiplies two values', () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, MUL, STOP])
        ).toEqual(6);
      });
    });

    describe('and the code includes the DIV', () => {
      it('divides one value by another', () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, DIV, STOP])
        ).toEqual(1.5);
      });
    });

    describe('and the code includes LT', () => {
      it('checks if one value is less than another', () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, LT, STOP])
        ).toEqual(0);
      });
    });

    describe('and the code includes GT', () => {
      it('if one value is greater than another', () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, GT, STOP])
        ).toEqual(1);
      });
    });

    describe('and the code includes EQ', () => {
      it('if one value is equal to another', () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, EQ, STOP])
        ).toEqual(0);
      });
    });

    describe('and the code includes AND', () => {
      it('ands two conditions', () => {
        expect(
          new Interpreter().runCode([PUSH, 1, PUSH, 0, AND, STOP])
        ).toEqual(0);
      });
    });

    describe('and the code includes OR', () => {
      it('ors two conditions', () => {
        expect(
          new Interpreter().runCode([PUSH, 1, PUSH, 0, OR, STOP])
        ).toEqual(1);
      });
    });

    describe('and the code includes JUMP', () => {
      it('jumps to a detination', () => {
        expect(
          new Interpreter().runCode([PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, 'jump successful', STOP])
        ).toEqual('jump successful');
      });
    });

    describe('and the code includes JUMPI', () => {
      it('jumps to a destination', () => {
        expect(
          new Interpreter().runCode([PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, 'jump successful', STOP])
        ).toEqual('jump successful');
      });
    });
  });
});

# DEVELOPING THE BLOCKCHAIN

1. Creating a blockchain through an implementation of an array

  class Blockchain {
    constructor() {
      this.chain = [];
    }
  }

2. Create a database structure to represent blocks - block.js

  The Block consists of:
    - The blockHeaders
    - transaction series

3. Create the mineBlock function
  - To add a block to the chain

4. Create the hard-codes genesis block in the root - config.js

5. Setup the mineBlock functionality - util/index.js
- Add the POW functionality
- POW requires miners to solve a puzzle to mine blocks
- POW difficulty, the puzzle can be harder/easier to find
- Blocks added on time-based method
- If it takes a miner a long time to add a block, the difficulty is decreased.
- POW ensures the blocks are added at a steady rate.
- Miners sync their chains by adding the longest chain by default.
- To avoid fraudulent chains - it is expensive to add verified, long chains.

6. Create sortCharacters function for large objects

7. Create Hashing function

*Hashing and Keccak256 Hash
- generates a unique output for every unique input

*Keccak256
- 256 bits uses for the hash output - in binary
- But we see strings of 64 char's in hexidecimal form

*Install:
npm i js-sha3 --save

8. POW/Ethereum Algorithm
  a. Calculate a block target hash based on last block's difficulty value. The higher the difficulty, the smaller the hash value.

  b. Find a hash (underTargetHash) that is based on the current block that is lower than the block target hash. 
     The underTargetHash consists of all the fields in the header for the new block {timestamp, number, beneficiary, difficulty, nonce (allows miners inifite retries in generating a valid underTargerHash )}. The nonce can be changed through a loop in order to find the correct combination of a nonce value and blockHeaders that meets the difficulty requirement.
  
  *Ethereum Directed Acyclic Graph (EDAG) maintains the above in Ethereum's network.

9. Mining Functionality - block.js

*In block.js
 
 a. Combine header = keccakHash(truncatedBlockHeaders) & nonce value to calculate the actual hash that tries to meet the difficulty requirement.
 b. If the hash found falls under this target, then the block is VALID.
 c. The block is then created, based on the blockHeaders and the nonce value.

 const underTargetHash = keccakHash(header + nonce);

 10. Difficulty Settings

 Functionality is based on looking at the time difference between the new, mined block and the last block and comparing it against the mine rate value.

 The rate then increase/decreases. 

 - config.js

 If the timestamp - lastBlock.timestamp > MINE_RATE, decrease the difficulty rate:

 static adjustDifficulty({ lastBlock, timestamp }) {
    if ((timestamp - lastBlock.blockHeaders.timestamp) > MINE_RATE) {
      return difficulty -1;
    }
  }

10. Validating Blocks - network validation & chain validation

- block.js - validateBlock
- Implement a system for validating adding blocks to the chain through the network. The network will validate the block the miner added, as valid.

Ensure the new block followed the POW requirements by:
      a. The block meets the POW requirement - recalc. the target for the block based on the presented last block. 
      b. Then we recalc. the underTargetHash, based on the headers from the newly presented block.
      c. Then we will check that the calculated underTargetHash actually falls under the calculated block's targetHash.


# THE BLOCKCHAIN NETWORK

## The network consists of two parts:

### 1. A Private Application and API

This serves as a miner's individual node in the network.

With this API, the miner will be able to act with their own instances of the core data structures in the system. Each miner will have their own instance of the Blockchain class.

The API will be available through HTTP, mainly through POST/GET requests.

- npm i express --save (allows creation of API)
- create /api/index.js

### 2. Pub/Sub Messaging Layer

This will handle all the messaging in the network, between the nodes.

This will enable nodes to send statuses and transactions to each other. 

Server-to-Server comm through the Publisher/Subscriber pattern.

These are based on messaging channels with Publishers publishing messages and the channel then broadcasts the message.

It is up to the Subscriber to listen to new messages on their subscribed channels.

There can be a plethora of channels and the subscriber can subscribe to as many as they want.

The Publisher is intentional in broadcasting messages to selected channels and this reduces work on the channels.

It fits the model of the nodes broadcasting their specific messages.

#### Structure of Blockchain Channel

The blockchain channel will handle the connections of all the nodes on the network. The node that adds the new block will broadcast this to the channel.

The block data will be contained in the message and all nodes will pick up these specific messages and then update their blockchain instances.

#### PubNub

1. Create an account in the app
2. Navigate to the dashboard and create a new app.
3. Have access to the keys for this project

Install pubnub - npm i pubnub --save

/api/pubsub.js
* build channels and methodology

#### Peer Synchronisation

To allow new nodes to be sync'd to the blockchain, when added.

Their blockchain instance needs to be up-to-date.

So we request the BC data from the root node and place it into the peer, when it begins.

Need to add new Components:

1. Ability to conduct a request from server to server.
- npm i request --save
- Add to api/index.js
*Gives ability to make HTTP requests and allow a request to the root node and get the up-to-date chain.

2. New method for BC that replaces the entire chain array

# ACCOUNTS AND TRANSACTIONS

Together these support a Cryptocurrency. 

Each miner has their own unique account, where they can receive rewards for mining a block.

Another key factor will be to describe changes in state. Transactions record state changes.

## Accounts

### 2 Types of Accounts

1. A regular account to represent an individual. Collect currency and exchange currency.

2. Smart contract account. Once these accounts are on the blockchain, regular accounts can interact with them by sending currency.

### Fields

#### keyPair
Ensure that the account will be owned by 1 individual only. Consists of public (account) and private key (never shared and allows the account to generate unique signatures to auth transactions.)

The main use for generating signatures is to authorise transactions. The account will authorise a transaction, by generating a unique signature for it.

By applying the PRIVATE KEY of the account and the TRANSACTION DATA, through an algorithm, the signature is generated. It is important the signature is based on the original transaction data. If there is any change to the original data, a different signature will be generated.

With the SIGNATURE generated, any individual can use the PUBLIC KEY of the individual who signed it, to verify it. 

The public key is used to decrypt the signature and read the data behind it. If the data does not match then one of two events happened:

1. The original data was tampered with after the data was signed by the sender.
2. The signature was generated by a private key that does not correspond with the public key that is presented by the individual who wants to initiate the transaction.

Steps:

1. Install elliptic
npm i elliptic --save

2. util/index.js
* Add EC

3. Create Account Directory and Files
* And add STARTING_BALANCE for accounts in /config

### Main Functionality for Account Objects
*In account/index.js

Add 2 methods:

1. Create unqiue signatures for the account
2. Verify the signatures of other accounts

*Add sign method

### Transactions
Will serve 2 overall purposed:

1. Exchange currency between accounts which will establish the underlying cryptocurrency.
2. The state of the network (balances) or new account creations (at first receipt)

The methods and test used are to ensure that correct, non-tampered transactions (data and signatures) are sent.

There are 2 types of transactions:

1. validateStandardTransaction
2. validateCreateAccountTransaction

#### Transaction-queue.js
Will serve to add transactions to a queue/pool.

1. Create transaction-queue.js
2. Add logic and endpoints to api/index.js

#### Sharing transactions in the network

1. Add an endpoints that allows a miner to conduct a transaction with their application account.
- api/index.js - account/transaction (POST request)
- create own endpoint tester in root - /api-test.js
  *This is to test acccount creation & standard transactions

2. Ensure transactions are broadcasted through the pubsub layer
- All miners are made aware of txn's generated to each node.
- When receiving a new txn, the miner adds to their own queue. Ensuring all miners have an updated queue.

* Add TRANSACTION channel to pubsub.js

#### Block TransactionSeries
*Including transactions in blocks.

This will allow new peers to have access to full history of valid txn's

1. Add to blockchain/block.js
2. Add clearBlockTransactions to ensure transactions are cleared, once mined.

# WORLD STATE AND RUNNING BLOCKS OF TRANSACTIONS








