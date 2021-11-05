const { version } = require('../../package.json');
// const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Trove API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `https://morning-tundra-25451.herokuapp.com/v1/docs`,
    },
  ],
};

module.exports = swaggerDef;
