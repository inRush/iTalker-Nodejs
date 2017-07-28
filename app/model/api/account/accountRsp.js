/*
 * @Author: hwj
 * @Date: 2017-07-26 17:41:46
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-27 09:44:03
 * 返回用户的信息统一规范
 */
'use strict';
const UserCard = require('../../card/userCard');

class AccountRsp {
  constructor(user, isBind = false) {
    this.account = user.phone;
    this.token = user.token;
    this.isBind = isBind;
    this.user = new UserCard(user);
  }
}

module.exports = AccountRsp;
