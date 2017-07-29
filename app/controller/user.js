/*
 * @Author: hwj
 * @Date: 2017-07-23 12:56:28
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-29 18:21:52
 */
'use strict';
const Response = require('../model/api/base/response');
const AccountRsp = require('../model/api/account/accountRsp');
function checkRegisterParam(ctx) {
  const { account, password, name } = ctx.request.body;
  const res = { status: 422, result: { account, password, name } };
  // 判断参数是否正确
  const checkEmptyResult = Response.ckeckParameterEmptyErr(res.result);
  if (checkEmptyResult) {
    res.result = checkEmptyResult;
    return res;
  }
  if (!ctx.helper.validator.isPhone(account)) {
    res.result = Response.buildParameterError(
      'Please provide correct phone number'
    );
    return res;
  }
  res.status = 0;
  return res;
}

function checkLoginParam(ctx) {
  const { account, password } = ctx.request.body;
  const res = { status: 422, result: { account, password } };
  const checkEmptyResult = Response.ckeckParameterEmptyErr(res.result);
  if (checkEmptyResult) {
    res.result = checkEmptyResult;
    return res;
  }
  res.status = 0;
  return res;
}

function checkUpdateParam(ctx) {
  const body = ctx.request.body;
  const userId = ctx.params.id;
  const token = ctx.request.header.token;
  body.userId = userId;
  body.token = token;
  const res = { status: 422, result: body };
  const checkEmptyResult = Response.ckeckParameterEmptyErr(body);
  if (checkEmptyResult) {
    res.result = checkEmptyResult;
    return res;
  }
  if (body.pushId) {
    if (typeof body.pushId !== 'string') {
      res.result = Response.buildParameterError('pushId must be a string');
      return res;
    }
  }
  res.status = 0;
  return res;
}

module.exports = app => {
  class UserController extends app.Controller {
    /**
     * 用户进行登录操作
     */
    async login() {
      this.ctx.status = 200;
      const res = checkLoginParam(this.ctx);
      if (res.status !== 0) {
        this.ctx.status = res.status;
        this.ctx.body = res.result;
        return;
      }
      const params = res.result;

      const user = await this.ctx.service.user.login(
        params.account,
        params.password
      );
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
      const res = checkRegisterParam(this.ctx);
      if (res.status !== 0) {
        this.ctx.status = res.status;
        this.ctx.body = res.result;
        return;
      }
      const params = res.result;

      let user = await this.ctx.service.user.findByPhone(params.account);
      if (user) {
        this.ctx.body = Response.buildHaveAccountError();
        return;
      }

      user = await this.ctx.service.user.findByName(params.name);
      if (user) {
        this.ctx.body = Response.buildHaveNameError();
        return;
      }
      user = await this.ctx.service.user.register(
        params.account,
        params.password,
        params.name
      );
      if (user) {
        const rsp = new AccountRsp(user);
        this.ctx.body = Response.buildOk(rsp);
      } else {
        this.ctx.body = Response.buildRegisterError();
      }
    }

    async update() {
      this.ctx.status = 200;
      const res = checkUpdateParam(this.ctx);
      if (res.status !== 0) {
        this.ctx.status = res.status;
        this.ctx.body = res.result;
        return;
      }
      const params = res.result;
      let user = await this.ctx.service.user.findByToken(params.token);
      console.log(user);
      if (user && params.pushId) {
        user = await this.ctx.service.user.bind(user, params.pushId);
      }
      if (!user) {
        this.ctx.status = 500;
        this.ctx.body = Response.buildServiceError();
        return;
      }
      const rsp = new AccountRsp(user, true);

      this.ctx.body = Response.buildOk(rsp);
    }
  }
  return UserController;
};
