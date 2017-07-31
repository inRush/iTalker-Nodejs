/*
 * @Author: hwj
 * @Date: 2017-07-29 11:49:33
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-31 14:07:00
 */

'use strict';
const paramErrStatus = 422;

module.exports = {
  validate(rules, content) {
    const body = this.request.body || content;
    const res = { status: 200, result: '' };
    const validator = new this.helper.Validator(rules, body);
    res.result = validator.vali();
    if (typeof res.result === 'string') {
      res.status = paramErrStatus;
    }
    return res;
  },
};
