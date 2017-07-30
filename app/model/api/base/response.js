/*
 * @Author: hwj
 * @Date: 2017-07-26 17:41:53
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-30 09:52:07
 * 接口API统一返回规范
 */
'use strict';
class Response {
  // 成功
  static get SUCCEED() {
    return 1;
  }
  // 未知错误
  static get ERROR_UNKNOWN() {
    return 0;
  }
  // 没有找到用户信息
  static get ERROR_NOT_FOUND_USER() {
    return 4041;
  }
  // 没有找到群信息
  static get ERROR_NOT_FOUND_GROUP() {
    return 4042;
  }
  // 没有找到群成员信息
  static get ERROR_NOT_FOUND_GROUP_MEMBER() {
    return 4043;
  }
  // 创建用户失败
  static get ERROR_CREATE_USER() {
    return 3001;
  }
  // 创建群失败
  static get ERROR_CREATE_GROUP() {
    return 3002;
  }
  // 创建群成员失败
  static get ERROR_CREATE_MESSAGE() {
    return 3003;
  }
  // 请求参数错误
  static get ERROR_PARAMETERS() {
    return 4001;
  }
  // 请求参数错误-已存在账户
  static get ERROR_PARAMETERS_EXIST_ACCOUNT() {
    return 4002;
  }
  // 请求参数错误-已存在名称
  static get ERROR_PARAMETERS_EXIST_NAME() {
    return 4003;
  }
  // 服务器错误
  static get ERROR_SERVICE() {
    return 5001;
  }
  // 账户Token错误，需要重新登录
  static get ERROR_ACCOUNT_TOKEN() {
    return 2001;
  }
  // 账户登录失败
  static get ERROR_ACCOUNT_LOGIN() {
    return 2002;
  }
  // 账户注册失败
  static get ERROR_ACCOUNT_REGISTER() {
    return 2003;
  }
  // 没有权限操作
  static get ERROR_ACCOUNT_NO_PERMISSION() {
    return 2010;
  }

  constructor(code = 1, message = 'ok', result) {
    this.code = code;
    this.message = message;
    this.result = result;
    this.time = new Date().getTime();
  }

  get isSucceed() {
    return (this._code = 1);
  }

  static buildOk(result) {
    if (!result) {
      return new Response();
    }
    return new Response(1, 'ok', result);
  }

  static buildParameterError(message) {
    return new Response(
      Response.ERROR_PARAMETERS,
      `Parameters Error. ${message}`
    );
  }

  static buildHaveAccountError() {
    return new Response(
      Response.ERROR_PARAMETERS_EXIST_ACCOUNT,
      'Already have this account.'
    );
  }

  static buildHaveNameError() {
    return new Response(
      Response.ERROR_PARAMETERS_EXIST_NAME,
      'Already have this name.'
    );
  }

  static buildServiceError(message) {
    return new Response(Response.ERROR_SERVICE, `Service Error. ${message}`);
  }

  static buildNotFoundUserError(str) {
    return new Response(
      Response.ERROR_NOT_FOUND_USER,
      str != null ? str : 'Not Found User.'
    );
  }

  static buildNotFoundGroupError(str) {
    return new Response(
      Response.ERROR_NOT_FOUND_GROUP,
      str != null ? str : 'Not Found Group.'
    );
  }

  static buildNotFoundGroupMemberError(str) {
    return new Response(
      Response.ERROR_NOT_FOUND_GROUP_MEMBER,
      str != null ? str : 'Not Found GroupMember.'
    );
  }

  static buildAccountError() {
    return new Response(
      Response.ERROR_ACCOUNT_TOKEN,
      'Account Error; you need login.'
    );
  }

  static buildLoginError() {
    return new Response(
      Response.ERROR_ACCOUNT_LOGIN,
      'Account or password error.'
    );
  }

  static buildRegisterError() {
    return new Response(Response.ERROR_ACCOUNT_REGISTER, 'Have this account.');
  }

  static buildNoPermissionError() {
    return new Response(
      Response.ERROR_ACCOUNT_NO_PERMISSION,
      'You do not have permission to operate.'
    );
  }

  static buildCreateError(type) {
    return new Response(type, 'Create failed.');
  }
}

module.exports = Response;
