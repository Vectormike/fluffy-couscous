const { version } = require('../../package.json');
// const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Trove API documentation',
    version,
  },
  host: 'morning-tundra-25451.herokuapp.com',
  basePath: '/',
  servers: [
    {
      url: `https://morning-tundra-25451.herokuapp.com/v1/docs`,
    },
  ],
};

module.exports = swaggerDef;
