/*
 * @Author: hwj
 * @Date: 2017-07-23 12:56:08
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-30 19:17:32
 */
'use strict';

module.exports = app => {
  const { STRING, UUIDV4 } = app.Sequelize;

  const UserFollow = app.model.define(
    'UserFollow',
    {
      id: {
        type: STRING,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      alias: {
        type: STRING,
      },
    },
    {
      tableName: 'TB_USER_FOLLOW',
      underscored: false,
    }
  );

  UserFollow.associate = function() {
    app.model.User.hasMany(UserFollow, {
      as: 'followings',
      foreignKey: 'originId',
    });

    app.model.User.hasMany(UserFollow, {
      as: 'followers',
      foreignKey: 'targetId',
    });
  };

  return UserFollow;
};
