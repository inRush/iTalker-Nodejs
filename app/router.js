/*
 * @Author: hwj
 * @Date: 2017-07-26 17:42:09
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-30 09:27:32
 */
'use strict';

module.exports = app => {
  // 用户登录
  app.post('/api/user/login', app.controller.user.login);
  // 用户注册
  app.post('/api/user/register', app.controller.user.register);
  // 绑定设备ID
  app.post('/api/user/bind', app.controller.user.bind);
};
