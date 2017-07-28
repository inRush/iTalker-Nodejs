'use strict';

// had enabled by egg
// exports.static = true;

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};
exports.security = false;

exports.proxyworker = {
  enable: true,
  package: 'egg-development-proxyworker',
};
