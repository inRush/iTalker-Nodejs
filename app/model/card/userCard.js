/*
 * @Author: hwj
 * @Date: 2017-07-26 17:41:58
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-28 21:48:24
 * 用户基本信息返回规范
 */
'use strict';

class UserCart {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.phone = user.phone;
    this.portrait = user.portrait;
    this.desc = user.description;
    this.sex = user.sex;
    this.modifyAt = user.updatedAt;

    // TODO 得到关注人和粉丝的数量
    // user.getFollowers().size(); 懒加载会报错,因为没有Session
    this.follows = 0;
    this.following = 0;
    this.isFollow = false;
  }
}
module.exports = UserCart;
