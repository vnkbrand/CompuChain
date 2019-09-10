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




