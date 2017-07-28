/*
 * @Author: hwj
 * @Date: 2017-07-25 11:39:16
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-25 16:20:04
 */

'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, BLOB } = app.Sequelize;

  const PushHistory = app.model.define(
    'PushHistory',
    {
      id: {
        type: STRING,
        primaryKey: true,
      },
      entity: {
        type: BLOB,
        allowNull: false,
      },
      entityType: {
        type: INTEGER,
        allowNull: false,
      },
      pushId: {
        type: STRING,
      },
      arrivalAt: {
        type: DATE,
      },
    },
    {
      tableName: 'TB_PUSH_HISTORY',
      underscored: false,
    }
  );

  PushHistory.associate = function() {
    app.model.User.hasMany(PushHistory, {
      as: 'ReceiveHisrotys',
      foreignKey: 'receiverId',
    });

    app.model.User.hasMany(PushHistory, {
      as: 'SendHistorys',
      foreignKey: 'senderId',
    });
  };

  return PushHistory;
};
