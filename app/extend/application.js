/*
 * @Author: hwj
 * @Date: 2017-07-25 14:41:41
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-31 13:22:41
 */

'use strict';
module.exports = {
  /**
   * 对数据库操作开启事务,自动commit,自动rollback
   * @param {Function} callback 执行数据库查询的回调
   * @return {Object} 返回查询的结果
   */
  async transaction(callback) {
    const t = await this.model.transaction();
    try {
      const result = await callback(t);
      await t.commit();
      return result;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  },
};
