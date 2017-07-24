'use strict';

module.exports = app => {
  app.resources('user', '/api/user', 'user');
};