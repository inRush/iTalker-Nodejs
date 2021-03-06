// addMethod
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

const empty = '';
const notEmpty = '1231';
console.log('isEmpty: ' + Validator.isEmpty(empty));
console.log('notEmpty: ' + Validator.isEmpty(notEmpty));
const email = '1289110832@qq.com';
const notEmail = '2134123123';
console.log('isEmail: ' + Validator.isEmail(email));
console.log('notEmail: ' + Validator.isEmail(notEmail));
const number = 12312;
const notNumber = 'das123';
console.log('isNumber: ' + Validator.isNumber(number));
console.log('notNumber: ' + Validator.isNumber(notNumber));
const body = {
  name: 'inrush',
  password: 12321,
  account: '12321',
};
console.log(
  Validator.match(
    {
      account: 'string',
      name: 'string',
      password: 'string',
    },
    body
  )
);
