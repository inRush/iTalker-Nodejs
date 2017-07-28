/*
 * @Author: hwj
 * @Date: 2017-07-23 12:56:28
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-28 20:55:39
 */
'use strict';
const Response = require('../model/api/base/response');
const AccountRsp = require('../model/api/account/accountRsp');

module.exports = app => {
  class UserController extends app.Controller {
    /**
     * 用户进行登录操作
     */
    async login() {
      this.ctx.status = 200;
      const { phone, password } = this.ctx.request.body;
      if (!phone || !password) {
        this.ctx.body = Response.buildParameterError();
        return;
      }

      const user = await this.ctx.service.user.login(phone, password);
      if (user) {
        const rsp = new AccountRsp(user);
        this.ctx.body = Response.buildOk(rsp);
      } else {
        this.ctx.body = Response.buildLoginError();
      }
    }

    /**
     * 创建用户
     */
    async create() {
      this.ctx.status = 200;
      try {
        const { phone, password, name } = this.ctx.request.body;
        let user = await this.ctx.service.user.findByPhone(phone);
        if (user) {
          this.ctx.body = Response.buildHaveAccountError();
          return;
        }

        user = await this.ctx.service.user.findByName(name);
        if (user) {
          this.ctx.body = Response.buildHaveNameError();
          return;
        }

        user = await this.ctx.service.user.register(phone, password, name);
        if (user) {
          const rsp = new AccountRsp(user);
          this.ctx.body = Response.buildOk(rsp);
        } else {
          this.ctx.body = Response.buildRegisterError();
        }
      } catch (e) {
        e.status = 500;
        throw e;
      }
    }
  }
  return UserController;
};
