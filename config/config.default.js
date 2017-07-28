'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_iTalker_inrush';

  // 配置数据库信息
  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'italker_test',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '',
  };

  // 设置中间件
  config.middleware = [ 'errorHandler', 'trim' ];

  // 开启调试端口
  config.proxyworker = {
    port: 10086,
  };

  return config;
};
