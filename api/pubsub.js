const PubNub = require('pubnub');

const credentials = {
  publishKey:'pub-c-d3011bbc-42e4-4e7d-b4c5-706932dd8e43',
  subscribeKey:'sub-c-32252e2e-d536-11e9-a219-a2442d3e7ccc',
  secretKey: 'sec-c-NmZmNTJhYjQtNjRiYi00ODdhLTgxNDEtMzZjZDVlZTk4OTZj'
};

const CHANNELS_MAP = {
  TEST: 'TEST',
  BLOCK: 'BLOCK'
};

class PubSub {
  constructor({ blockchain }) {
    this.pubnub = new PubNub(credentials);
    this.blockchain = blockchain;
    this.subscribeToChannels();
    this.listen();
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: Object.values(CHANNELS_MAP)
    });
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }

  listen() {
    this.pubnub.addListener({
      message: messageObject => {
        const { channel, message } = messageObject;
        const parsedMessage = JSON.parse(message);
        
        console.log('Message received. Channel:', channel);

        switch (channel) {
          case CHANNELS_MAP.BLOCK:
            console.log('block message', message);

            this.blockchain.addBlock({ block: parsedMessage })
              .then(() => console.log('New block accepted'))
              .catch(error => console.error('New block rejected:', error.message));
            break;
          default:
            return;
        }
      }
    });
  }

  broadcastBlock(block) {
    this.publish({
      channel: CHANNELS_MAP.BLOCK,
      message: JSON.stringify(block)
    })
  }
};

module.exports = PubSub;
