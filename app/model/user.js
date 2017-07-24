/*
 * @Author: hwj
 * @Date: 2017-07-23 12:56:23
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-24 23:16:56
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, NOW } = app.Sequelize;

  const User = app.model.define(
    'User',
    {
      id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      name: {
        type: STRING(128),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: STRING(62),
        allowNull: false,
        unique: true,
        validate: {
          is: [ /^1[34578]\d{9}$/ ],
        },
      },
      password: {
        type: STRING,
        allowNull: false,
      },
      portrait: {
        type: STRING,
      },
      description: {
        type: STRING,
      },
      sex: {
        type: INTEGER,
        allowNull: false,
      },
      token: {
        type: STRING,
        unique: true,
      },
      pushId: {
        type: STRING,
      },
      createAt: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
      },
      updateAt: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
      },
      lastReceivedAt: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
      },
    },
    {
      tableName: 'TB_USER',
      timestamps: false,
    }
  );

  return User;
};
