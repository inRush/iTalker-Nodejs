/*
 * @Author: hwj
 * @Date: 2017-07-25 11:06:27
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-25 16:19:18
 */

'use strict';

module.exports = app => {
  const { STRING, UUIDV4 } = app.Sequelize;

  const Group = app.model.define(
    'Group',
    {
      id: {
        type: STRING,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      name: {
        type: STRING(128),
        allowNull: false,
        unique: true,
      },
      description: {
        type: STRING,
        allowNull: false,
      },
      picture: {
        type: STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'TB_GROUP',
      underscored: false,
    }
  );

  Group.associate = function() {
    app.model.User.hasMany(Group, {
      as: 'Groups',
      foreignKey: 'ownerId',
    });
  };

  return Group;
};
