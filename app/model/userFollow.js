/*
 * @Author: hwj
 * @Date: 2017-07-23 12:56:08
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-24 23:21:48
 */
'use strict';

module.exports = app => {
  const { STRING, DATE, UUID, UUIDV4, NOW } = app.Sequelize;

  const UserFollow = app.model.define(
    'UserFollow',
    {
      id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      originId: {
        type: UUID,
        references: {
          model: 'TB_USER',
          key: 'id',
        },
      },
      targetId: {
        type: UUID,
        references: {
          model: 'TB_USER',
          key: 'id',
        },
      },
      alias: {
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
    },
    {
      tableName: 'TB_USER_FOLLOW',
      timestamps: false,
    }
  );

  return UserFollow;
};
