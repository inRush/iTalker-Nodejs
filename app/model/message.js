/*
 * @Author: hwj
 * @Date: 2017-07-25 11:20:20
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-25 16:19:36
 */

'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, TEXT } = app.Sequelize;

  const Message = app.model.define(
    'Message',
    {
      id: {
        type: STRING,
        primaryKey: true,
      },
      arttach: {
        type: STRING,
      },
      type: {
        type: INTEGER,
        allowNull: false,
      },
      content: {
        type: TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'TB_MESSAGE',
      underscored: false,
    }
  );

  Message.associate = function() {
    app.model.User.hasMany(Message, {
      as: 'ReceiveMessages',
      foreignKey: 'receiverId',
    });

    app.model.User.hasMany(Message, {
      as: 'SendMessages',
      foreignKey: 'senderId',
    });

    app.model.Group.hasMany(Message, {
      as: 'Messages',
      foreignKey: 'groupId',
    });
  };

  Message.TYPE_STR = 1; // 字符串类型
  Message.TYPE_PIC = 2; // 图片类型
  Message.TYPE_FILE = 3; // 文件类型
  Message.TYPE_AUDIO = 4; // 语音类型
  return Message;
};
