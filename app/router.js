/*
 * @Author: hwj
 * @Date: 2017-07-26 17:42:09
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-29 09:43:56
 */
'use strict';

module.exports = app => {
  app.post('/api/login', app.controller.user.login);
  app.resources('user', '/api/user', app.controller.user);
};
