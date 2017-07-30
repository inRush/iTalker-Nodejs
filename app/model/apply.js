/*
 * @Author: hwj
 * @Date: 2017-07-25 11:06:27
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-25 17:12:38
 */

'use strict';

module.exports = app => {
  const { STRING, INTEGER, UUIDV4, TEXT } = app.Sequelize;

  const Apply = app.model.define(
    'Apply',
    {
      id: {
        type: STRING,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      description: {
        type: STRING,
        allowNull: false,
      },
      attach: {
        type: TEXT,
      },
      type: {
        type: INTEGER,
        allowNull: false,
      },
      targetId: {
        type: STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'TB_APPLY',
      underscored: false,
    }
  );

  Apply.associate = function() {
    app.model.User.hasMany(Apply, {
      as: 'Applys',
      foreignKey: 'applicantId',
    });
  };

  return Apply;
};
