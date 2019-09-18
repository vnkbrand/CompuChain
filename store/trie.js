const _ = require('lodash');
const { keccakHash } = require('../util');

class Node {
  constructor() {
    this.value = null;
    this.childMap = {};
  }
}

class Trie {
  constructor() {
    this.head = new Node();
    this.generateRootHash();
  }

  generateRootHash() {
    this.rootHash = keccakHash(this.head);
  }

  // Retrieve value from tire, using the reference (key)
  get({ key }) {
    let node = this.head;

    for (let character of key) {
      if (node.childMap[character]) {
        node = node.childMap[character];
      }
    }

    return _.cloneDeep(node.value);
  }

  // Put method stores value in the trie, giving a reference
  put({ key, value }) {
    let node = this.head;

    for (let character of key) {
      if (!node.childMap[character]) {
        node.childMap[character] = new Node();
      }

      node = node.childMap[character];
    }

    node.value = value;

    this.generateRootHash();
  }
}

module.exports = Trie;
