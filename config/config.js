const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'express-hoppier'
    },
    port: process.env.PORT || 3200,
  },

  test: {
    root: rootPath,
    app: {
      name: 'express-hoppier'
    },
    port: process.env.PORT || 3200,
  },

  production: {
    root: rootPath,
    app: {
      name: 'express-hoppier'
    },
    port: process.env.PORT ||3200,
  }
};

module.exports = config[env];
