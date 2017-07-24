'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_iTalker_inrush';

  // add your config here
  // config.mysql = {
  //   client: {
  //     // host
  //     host: '127.0.0.1',
  //     // port
  //     port: '3306',
  //     // username
  //     user: 'root',
  //     // password
  //     password: '',
  //     // database
  //     database: 'italker',
  //   },
  //   // load into app, default is open
  //   app: true,
  //   // load into agent, default is close
  //   agent: false,
  // };

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'italker_test',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '',
  };
  return config;
};
