/*
 * @Author: hwj
 * @Date: 2017-07-26 17:42:05
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-28 21:37:54
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
     * 根据电话号码查询用户
     * @param {String} p 电话号码
     * @return {User} 查询到的用户
     */
    async findByPhone(p) {
      return await app.model.User.findOne({ where: { phone: p } });
    }

    /**
     * 根据name查询用户
     * @param {String} n 用户名
     * @return {User} 查询到的用户
     */
    async findByName(n) {
      return await app.model.User.findOne({ where: { name: n } });
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
      user.dataValues.token = token;
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
