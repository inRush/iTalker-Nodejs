/*
 * @Author: hwj
 * @Date: 2017-07-27 09:34:09
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-27 09:43:38
 * 去除参数中所有的首位空格
 */
'use strict';

/**
 * 对请求的Json参数进行去首位空格处理
 * @param {Object} body 需要进行去空格的对象
 * @return {Object} 去空格后的对象
 */
function trim(body) {
  for (const key in body) {
    if (typeof body[key] === 'string') {
      body[key] = body[key].trim();
    } else if (typeof body[key] === 'object') {
      body[key] = trim(body[key]);
    }
  }
  return body;
}

module.exports = () => {
  return async (ctx, next) => {
    ctx.request.body = trim(ctx.request.body);
    await next();
  };
};
