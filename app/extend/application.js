/*
 * @Author: hwj
 * @Date: 2017-07-25 14:41:41
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-27 09:39:38
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
  /**
   * 对class进行函数重载操作
   * @example overloaded(ClassObject,MethodName,Function)
   * @param {Object} object 需要进行函数重载的对象
   * @param {String} name 重载函数的名称
   * @param {Function} fn 重载的函数体
   * @return {void}
   */
  async overloaded(object, name, fn) {
    const old = object[name];
    object[name] = function() {
      if (fn.length === arguments.length) {
        return fn.apply(this, arguments);
      } else if (typeof old === 'function') {
        return old.apply(this, arguments);
      }
    };
  },
};
