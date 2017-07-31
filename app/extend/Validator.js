'use strict';

class Validator {
  get serverError() {
    return 'server';
  }

  constructor(rules, content) {
    if (Validator.isEmpty(rules)) {
      throw new Error("rules can't empty");
    }
    if (Validator.isEmpty(rules)) {
      throw new Error("content can't empty");
    }
    this._rules = rules;
    this._content = content;
    this._data = {};
    this._initErr();
  }

  vali() {
    try {
      for (const key in this._rules) {
        if (this._rules.hasOwnProperty(key)) {
          this._check(key);
          this._data[key] = this._content[key];
        }
      }
    } catch (e) {
      if (e.name === this.serverError) {
        throw e;
      } else {
        return e.message;
      }
    }
    return this._data;
  }

  get EN_ERR() {
    return {
      require: key => {
        return `${key} is require,but not provide`;
      },
      phone: key => {
        return `${key} is not a correct phone number`;
      },
      email: key => {
        return `${key} is not a correct email`;
      },
      type: (key, expectedType, getType) => {
        return `${key} should be a ${expectedType} type, but get a ${getType} type`;
      },
      noEmpty: key => {
        return `${key} can't empty`;
      },
    };
  }
  get ZH_CN_ERR() {
    return {
      require: key => {
        return `${key} 是必须的,但是没有提供`;
      },
      phone: key => {
        return `${key} 不是一个有效的号码`;
      },
      email: key => {
        return `${key} 不是一个有效的邮箱`;
      },
      type: (key, expectedType, getType) => {
        return `${key} 应该是一个 ${expectedType} 类型, 但是获取到的是 ${getType} 类型`;
      },
      noEmpty: key => {
        return `${key} 不能为空`;
      },
    };
  }
  get _errMessage() {
    if (this.lang === 'en') {
      return this.EN_ERR;
    }
    return this.ZH_CN_ERR;
  }

  _check(key) {
    if (typeof this._rules[key] === 'object') {
      const rule = this._rules[key];
      if (rule.require) {
        this._checkRequire(key);
      }
      if (rule.noEmpty) {
        this._checkNoEmpty(key);
      }

      for (const k in this._errMessage) {
        if (this._errMessage.hasOwnProperty(k)) {
          if (k !== 'require' && k !== 'noEmpty') {
            if (rule[k]) {
              this[`_check${Validator.toUpperCamelCase(k)}`](key);
            }
          }
        }
      }
    } else if (typeof this._rules[key] === 'string') {
      this._checkType(key);
    }
  }
  /**
   * 初始化生成错误提示函数
   */
  _initErr() {
    // 获取系统默认的错误信息
    const errs = this._errMessage;
    for (const key in errs) {
      if (errs.hasOwnProperty(key)) {
        // 获取错误提示信息函数
        const err = errs[key];
        // 生成对应的错误提示函数
        this[`_${key}Err`] = function(k) {
          // 如果是type类型错误提示信息,需要额外提供预期的类型,和获取到的数据类型
          if (key === 'type') {
            return new Error(
              this._rules && this._rules[k].message
                ? this._rules[k].message(
                    k,
                    this._rules[k].type,
                    typeof this._content[k]
                  )
                : err(k, this._rules[k].type, typeof this._content[k])
            );
          }
          // 其他类型只需要提供对应的key就可以了
          return new Error(
            this._rules && this._rules[k].message
              ? this._rules[k].message(k)
              : err(k)
          );
        };
      }
    }
  }

  _serverErr(message) {
    const e = new Error(message);
    e.name = this.serverError;
    return e;
  }

  _checkRequire(key) {
    const rule = this._rules[key];
    if (typeof this._content[key] === 'undefined') {
      if (!rule.require) return;
      throw this._requireErr(key);
    }
  }

  _checkNoEmpty(key) {
    const data = this._content[key];
    if (typeof data === 'undefined') {
      return;
    }

    if (Validator.isEmpty(this._content[key])) {
      throw this._noEmptyErr(key);
    }
  }

  _checkType(key) {
    const rule = this._rules[key];
    const type = rule.type || rule;
    const data = this._content[key];

    if (typeof type !== 'string') {
      throw this.serverErr(`${key} type does not provide or not a string`);
    }
    if (typeof data === 'undefined') {
      return;
    }

    if (typeof data !== type) {
      throw this._typeErr(key);
    }
  }

  _checkPhone(key) {
    const data = this._content[key];
    if (typeof data === 'undefined') {
      return;
    }

    if (!Validator.isPhone(data)) {
      throw this._phoneErr(key);
    }
  }
  _checkEmail(key) {
    const data = this._content[key];
    if (typeof data === 'undefined') {
      return;
    }
    if (!Validator.isEmail(data)) {
      throw this._emailErr(key);
    }
  }

  get lang() {
    return this._lang || 'en';
  }
  set lang(lang) {
    this._lang = lang;
  }
  static isEmpty(obj) {
    if (typeof obj === 'number') return false;
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
  static toUpperCamelCase(variable) {
    const firstLetter = variable.slice(0, 1);
    const noFirst = variable.substr(1);
    return firstLetter.toLocaleUpperCase().concat(noFirst);
  }
}
module.exports = Validator;
