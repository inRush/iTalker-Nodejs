/*
 * @Author: hwj
 * @Date: 2017-07-25 11:20:20
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-25 13:41:07
 */

'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUIDV4, NOW } = app.Sequelize;

  const GroupMember = app.model.define(
    'GroupMember',
    {
      id: {
        type: STRING,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      alias: {
        type: STRING,
      },
      notifyLevel: {
        type: INTEGER,
        defaultValue: 0,
      },
      permissionType: {
        type: INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'TB_GROUP_MEMBER',
      underscored: false,
    }
  );

  GroupMember.associate = function() {
    app.model.User.hasMany(GroupMember, {
      as: 'GroupMenbers',
      foreignKey: 'userId',
    });

    app.model.Group.hasMany(GroupMember, {
      as: 'Menbers',
      foreignKey: 'groupId',
    });
  };

  GroupMember.NOTIFY_LEVEL_INVALID = -1; // 默认不接受消息
  GroupMember.NOTIFY_LEVEL_NONE = 0; // 默认通知级别
  GroupMember.NOTIFY_LEVEL_CLOSE = 1; // 接受消息不提示

  GroupMember.PERMISSION_LEVEL_NONE = 0; // 普通成员
  GroupMember.PERMISSION_LEVEL_ADMIN = 1; // 管理员
  GroupMember.PERMISSION_LEVEL_OWNER = 100; // 创建者
  return GroupMember;
};
