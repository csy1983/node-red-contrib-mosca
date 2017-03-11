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
      if (backend.backendType === 'mongodb') {
        if (!backend.mongodb) {
          this.status({ fill: 'red', shape: 'ring', text: 'Invalid backend configuration' });
          return;
        }

        moscaConfig.backend = {
          type: 'mongodb',
          url: backend.mongodb.url,
          pubsubCollection: backend.mongodb.pubsubCollection,
        };
      }
    }

    const persistence = RED.nodes.getNode(config.persistence);
    if (persistence) {
      if (persistence.factory === 'mongodb') {
        if (!persistence.mongodb) {
          this.status({ fill: 'red', shape: 'ring', text: 'Invalid persistence configuration' });
          return;
        }

        moscaConfig.persistence = {
          factory: mosca.persistence.Mongo,
          url: persistence.mongodb.url,
        };
      }
    }

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
    this.mongodb = {
      url: config.backend_mongodb_url,
      pubsubCollection: config.backend_mongodb_pubsub_collection,
    };
  }

  function MoscaPersistenceNode(config) {
    RED.nodes.createNode(this, config);
    this.factory = config.persistence_factory;
    this.mongodb = {
      url: config.persistence_mongodb_url,
    };
  }

  RED.nodes.registerType('mosca', MoscaNode);
  RED.nodes.registerType('mosca-backend', MoscaBackendNode);
  RED.nodes.registerType('mosca-persistence', MoscaPersistenceNode);
};
