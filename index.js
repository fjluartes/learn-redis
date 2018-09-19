'use strict';

const Hapi = require('hapi');

const server = new Hapi.server({
  host: 'localhost',
  port: 8080
});

const init = async () => {
  server.route(require('./routes'));

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
