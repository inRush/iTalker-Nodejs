/*
 * @Author: hwj
 * @Date: 2017-07-23 12:56:28
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-25 00:04:48
 */
'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    async index() {
      const t = await this.ctx.model.transaction();
      try {
        const user = await this.ctx.model.User.create(
          {
            name: 'inrush2',
            phone: '18158655782',
            password: 'inrush2',
            sex: 1,
          },
          { transaction: t }
        );
        await t.commit();
        this.ctx.body = user;
        this.ctx.status = 200;
      } catch (e) {
        await t.rollback();
        this.ctx.status = 500;
        console.log(e);
      }
    }

    async create() {}
  }
  return UserController;
};
