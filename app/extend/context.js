/*
 * @Author: hwj
 * @Date: 2017-07-29 11:49:33
 * @Last Modified by: hwj
 * @Last Modified time: 2017-07-30 14:49:20
 */

'use strict';
const Validator = require('./validator');
const paramErrStatus = 422;

module.exports = {
  validate(rules) {
    const body = this.request.body;
    const res = { status: 200, result: '' };
    const validator = new Validator(rules, body);
    res.result = validator.vali();
    if (typeof res.result === 'string') {
      res.status = paramErrStatus;
    }
    return res;
  },
};
