import mosca from 'mosca';

require('file-loader?emitFile=false!./mosca.html'); // eslint-disable-line
require('file-loader?emitFile=false!../icons/mosca.png'); // eslint-disable-line
require.context('../locales', true, /mosca\.json/) // eslint-disable-line

module.exports = function(RED) { // eslint-disable-line
  function MoscaNode(config) {
    RED.nodes.createNode(this, config);

    const moscaConfig = { port: config.port };
    const backend = RED.nodes.getNode(config.backend);
    if (backend) {
      if (backend.backendType === 'mongo') {
        if (!backend.mongo) {
          this.status({ fill: 'red', shape: 'ring', text: 'Invalid Configuration' });
          return;
        }

        moscaConfig.backend = {
          type: 'mongo',
          url: backend.mongo.url,
          pubsubCollection: backend.mongo.pubsubCollection,
        };
      }
    }

    // if (config.persistence) {
    //   switch (config.persistence.factory) {
    //     case 'memory':
    //       config.persistence.factory = mosca.persistence.Memory;
    //       break;
    //     case 'levelup':
    //       config.persistence.factory = mosca.persistence.LevelUp;
    //       break;
    //     case 'redis':
    //       config.persistence.factory = mosca.persistence.Redis;
    //       break;
    //     case 'mongodb':
    //       config.persistence.factory = mosca.persistence.Mongo;
    //       break;
    //     default:
    //       break;
    //   }
    // }

    let server = new mosca.Server(moscaConfig);
    let clientCounter = 0;

    server.on('error', (error) => {
      this.status({ fill: 'red', shape: 'ring', text: 'Error' });
      this.send({
        status: 'error',
        error,
      });
    });

    server.on('ready', () => {
      this.status({ fill: 'green', shape: 'dot', text: 'Ready' });
      this.send({
        status: 'ready',
        message: 'Mosca mqtt broker is up and running',
      });
    });

    server.on('published', (packet, client) => {
      this.send({
        status: 'published',
        config,
        client,
        packet,
      });
    });

    server.on('clientConnected', (client) => {
      ++clientCounter;
      this.status({
        fill: 'green',
        shape: 'dot',
        text: `${clientCounter} client${clientCounter > 1 ? 's' : ''} connected`,
      });
      this.send({
        status: 'clientConnected',
        client,
      });
    });

    server.on('clientDisconnected', (client) => {
      --clientCounter;
      this.status({
        fill: 'green',
        shape: 'dot',
        text: `${clientCounter} client${clientCounter > 1 ? 's' : ''} connected`,
      });
      this.send({
        status: 'clientDisconnected',
        client,
      });
    });

    this.on('input', (message) => {
      server.publish(message, () => {
        this.send({
          status: 'publish',
          message,
        });
      });
    });

    this.on('close', () => {
      server.close();
    });
  }

  function MoscaBackendNode(config) {
    RED.nodes.createNode(this, config);
    this.backendType = config.backend_type;
    this.mongo = {
      url: config.backend_mongo_url,
      pubsubCollection: config.backend_mongo_pubsub_collection,
    };
  }

  RED.nodes.registerType('mosca-backend', MoscaBackendNode);
  RED.nodes.registerType('mosca', MoscaNode);
};
