/*
 * @Author: hwj
 * @Date: 2017-07-25 14:27:46
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-31 14:07:37
 */
'use strict';
const crypto = require('crypto');
const Validator = require('./Validator');

module.exports = {
  /**
   * 对字符串进行md5非对称加密
   * @param {String} str 需要加密的字符串
   * @return {String} 加密后的字符串
   */
  md5(str) {
    const md5 = crypto.createHash('md5');
    md5.update(str);
    str = md5.digest('hex');
    return str;
  },
  /**
   * 对字符串进行Base64对称加密
   * @param {String} str 需要进行加密的字符创
   * @return {String} 加密后的字符串
   */
  base64(str) {
    return new Buffer(str).toString('base64');
  },
  Validator,
};
