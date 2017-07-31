/*
 * @Author: hwj
 * @Date: 2017-07-26 17:42:05
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-31 11:35:37
 */
'use strict';
const jwt = require('jsonwebtoken');

module.exports = app => {
  class User extends app.Service {
    async register(account, pwd, n) {
      pwd = this.encodePassword(pwd);
      try {
        // 开启一个事务
        return await app.transaction(async t => {
          // 创建一个用户
          const user = await this.ctx.model.User.create(
            {
              name: n,
              phone: account,
              password: pwd,
              sex: 1,
            },
            { transaction: t }
          );
          return user;
        });
      } catch (e) {
        throw e;
      }
    }

    /**
     * 用户登录
     * @param {String} account 账号
     * @param {String} pwd 密码
     * @return {User} 登录后的用户信息
     */
    async login(account, pwd) {
      pwd = this.encodePassword(pwd);
      let user = await app.model.User.findOne({
        where: { phone: account, password: pwd },
      });
      if (user) {
        user = await this.updateToken(user);
      }
      return user;
    }

    /**
     * 绑定用户的设备Id
     * @param {User} user 当前的用户
     * @param {String} pushId 设备Id
     * @return {User} 绑定后的用户
     */
    async bind(user, pushId) {
      if (!pushId) {
        return null;
      }

      // 判断有没有其他的用户绑定了这个pushId
      // 避免出现推送的混乱
      return await app.transaction(async t => {
        // 创建一个用户
        pushId = pushId.toLocaleLowerCase();
        const users = await app.model.User.findAll({
          where: {
            pushId,
            id: {
              $ne: user.id,
            },
          },
        });

        for (const key in users) {
          if (users.hasOwnProperty(key)) {
            const u = users[key];
            app.model.User.update(
              { pushId: null },
              { where: { id: u.id }, transaction: t }
            );
          }
        }
        if (pushId === user.pushId) {
          return user;
        }
        if (user.pushId) {
          // TODO 给之前的设备推送退出的消息
        }

        // 更新用户的pushId
        user.pushId = pushId;
        const result = await app.model.User.update(
          { pushId },
          { where: { id: user.id }, transaction: t }
        );
        if (result > 0) {
          return user;
        }
        return null;
      });
    }

    /**
     * 根据电话号码查询用户
     * @param {String} phone 电话号码
     * @return {User} 查询到的用户
     */
    async findByPhone(phone) {
      return await app.model.User.findOne({ where: { phone } });
    }

    /**
     * 根据name查询用户
     * @param {String} name 用户名
     * @return {User} 查询到的用户
     */
    async findByName(name) {
      return await app.model.User.findOne({ where: { name } });
    }

    /**
     * 通过Token查询用户
     * @param {String} token Token令牌
     * @return {User} 查询到的用户
     */
    async findByToken(token) {
      return await app.model.User.findOne({ where: { token } });
    }

    /**
     * 对密码进行加密
     * @param {String} pwd 密码
     * @return {String} 加密后的密码
     */
    encodePassword(pwd) {
      return this.ctx.helper.base64(this.ctx.helper.md5(pwd));
    }
    /**
     * 更新用户的Token
     * @param {User} user 用户
     * @return {User} 更新完成的用户
     */
    async updateToken(user) {
      const keys = app.config.keys;
      const token = jwt.sign({ phone: user.phone, name: user.name }, keys);
      user.token = token;
      return await app.transaction(async t => {
        // 更新用户Token
        const result = await app.model.User.update(
          { token },
          {
            where: {
              id: user.id,
            },
            transaction: t,
          }
        );
        if (result > 0) {
          return user;
        }
        return null;
      });
    }
  }
  return User;
};
