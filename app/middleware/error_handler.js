/*
 * @Author: hwj
 * @Date: 2017-07-27 09:34:14
 * @Last Modified by:   hwj
 * @Last Modified time: 2017-07-27 09:34:14
 * 统一错误处理函数
 */
'use strict';
module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      this.app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error =
        status === 500 && this.app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      this.body = { error };
      if (status === 422) {
        this.body.detail = err.errors;
      }
      this.status = status;
    }
  };
};
