/*
 * @Author: hwj
 * @Date: 2017-07-23 12:56:28
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-30 17:29:05
 */
'use strict';
const Response = require('../model/api/base/response');
const AccountRsp = require('../model/api/account/accountRsp');

async function bindPushId(ctx, user, res, pushId) {
  user = await ctx.service.user.bind(user, pushId);

  // 绑定失败,返回服务器异常
  if (!user) {
    res.status = 500;
    res.result = Response.buildServiceError();
    return;
  }
  // 绑定成功
  const rsp = new AccountRsp(user, true);
  res.result = Response.buildOk(rsp);
}

module.exports = app => {
  class UserController extends app.Controller {
    /**
     * 用户进行登录操作
     */
    async login() {
      // 校验参数
      const res = this.ctx.validate({
        account: { type: 'string', phone: true, require: true, noEmpty: true },
        password: { type: 'string', require: true, noEmpty: true },
        pushId: { type: 'string', noEmpty: true },
      });
      if (res.status !== 200) {
        this.ctx.status = res.status;
        this.ctx.body = Response.buildParameterError(res.result);
        return;
      }

      const params = res.result;
      // 登录账户
      const user = await this.ctx.service.user.login(
        params.account,
        params.password
      );
      if (user) {
        if (params.pushId) {
          // 绑定成功
          await bindPushId(this.ctx, user, res, params.pushId);
        } else {
          const rsp = new AccountRsp(user);
          res.result = Response.buildOk(rsp);
        }
      } else {
        res.status = 422;
        res.result = Response.buildLoginError();
      }

      this.ctx.status = res.status;
      this.ctx.body = res.result;
    }
    /**
     * 创建用户
     */
    async register() {
      const res = this.ctx.validate({
        account: { type: 'string', phone: true, require: true, noEmpty: true },
        password: { type: 'string', require: true, noEmpty: true },
        name: { type: 'string', require: true, noEmpty: true },
        pushId: { type: 'string', noEmpty: true },
      });
      if (res.status !== 200) {
        this.ctx.status = res.status;
        this.ctx.body = Response.buildParameterError(res.result);
        return;
      }
      const params = res.result;

      let user = await this.ctx.service.user.findByPhone(params.account);
      if (user) {
        this.ctx.status = 422;
        this.ctx.body = Response.buildHaveAccountError();
        return;
      }

      user = await this.ctx.service.user.findByName(params.name);
      if (user) {
        this.ctx.status = 422;
        this.ctx.body = Response.buildHaveNameError();
        return;
      }

      // 注册用户
      user = await this.ctx.service.user.register(
        params.account,
        params.password,
        params.name
      );
      if (user) {
        if (params.pushId) {
          // 绑定成功
          await bindPushId(this.ctx, user, res, params.pushId);
        } else {
          const rsp = new AccountRsp(user);
          res.result = Response.buildOk(rsp);
        }
      } else {
        res.status = 422;
        res.result = Response.buildRegisterError();
      }
      this.ctx.status = res.status;
      this.ctx.body = res.result;
    }

    /**
     * 绑定pushId
     */
    async bind() {
      const token = this.ctx.headers.token;
      // 校验参数
      const res = this.ctx.validate({
        pushId: { type: 'string', require: true, noEmpty: true },
      });
      if (res.status !== 200) {
        this.ctx.status = res.status;
        this.ctx.body = Response.buildParameterError(res.result);
        return;
      }

      const params = res.result;
      // 根据Token查找用户
      const user = await this.ctx.service.user.findByToken(token);
      if (!user) {
        this.ctx.status = 422;
        this.ctx.body = Response.buildAccountError();
        return;
      }
      // 绑定pushId
      await bindPushId(this.ctx, user, res, params.pushId);
      this.ctx.status = res.status;
      this.ctx.body = res.result;
    }
  }
  return UserController;
};
