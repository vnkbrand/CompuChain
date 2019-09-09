<!-- COMPUCHAIN-->

A complete Proof-of-Stake blockchain.

A fully-functional decentralised computer that is based on Ethereum's architecture.

The scope of this project includes:

1. The language for smart contracts.
2. The development and implementation of the blockchain.
3. A system that supports a network of servers.
4. Transaction and Account objects.
5. The state management object. 

All of these allow for a fully-functional decentralised computer.

<!-- Ethereum High Level -->
ETH is its own computer, utilsing all machines on its network using its blockchain.

Uses the blockchain to store transactional data. These are transactions of state and allows all computers to sync.

<!-- Smart Contract Language -->

Build the language at: https://repl.it/@DavidJoseph3/lightning-smart-contract

<!-- Foundation -->

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

<!-- Adding MUL & DIV -->

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

<!-- Smart Contracts Language using Ethereum Documentation -->

1. White Paper - high-level overview of Ethereum. 
2. Yellow Paper - more advanced. Source of a lot of the implementation details for the code in this project.
3. Beige Paper - translation of the yellow paper to make it more digestible.

<!-- Beigepaper -->

Utilise:
1. Smartchain opcodes
- Mathematics (STOP, ADD...)
- Comparisons (LT, GT...)
- Moving (JUMP, JUMPI) - loops



