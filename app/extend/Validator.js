'use strict';
class Validator {
  static isEmpty(obj) {
    for (const key in obj) {
      return false;
    }
    return true;
  }
  static isEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    );
  }
  static isNumber(number) {
    return /^[0-9]*$/.test(number);
  }
  static isPhone(phone) {
    return /^1[34578]\d{9}$/.test(phone);
  }
  static match(requires, target, options) {
    for (const key in requires) {
      if (requires.hasOwnProperty(key)) {
        const type = requires[key];
        if (!target[key]) {
          return {
            [key]: options && options.require ? options.require : 'must require',
          };
        } else if (typeof target[key] !== type) {
          return {
            [key]: options && options.type ? options.type : 'type not match',
          };
        }
      }
    }
    return null;
  }
}
module.exports = Validator;
