'use strict';
const mm = require('egg-mock');
const assert = require('assert');
const crypto = require('crypto');

describe('test/app/extend/helper.test.js', () => {
  let app;
  let ctx;
  before(async () => {
    app = mm.app();
    await app.ready();
    ctx = app.mockContext();
  });

  afterEach(mm.restore);
  after(() => app.close());

  it('md5()', async () => {
    const str = 'inrush';
    const md5 = crypto.createHash('md5');
    md5.update(str);
    const test1 = md5.digest('hex');
    const test2 = ctx.helper.md5(str);
    assert.deepStrictEqual(test1, test2);
  });

  it('base64()', async () => {
    const str = 'inrush';
    const test1 = new Buffer(str).toString('base64');
    const test2 = ctx.helper.base64(str);
    assert.deepStrictEqual(test1, test2);
  });

  describe('Vaildator module', () => {
    let Validator;
    before(() => {
      Validator = ctx.helper.Validator;
    });
    const rules = {
      name: { type: 'string', require: true, noEmpty: true },
      phone: { type: 'string', phone: true, require: true, noEmpty: true },
      email: { type: 'string', email: true },
      sex: 'number',
    };
    it('will throw rules empty error', async () => {
      try {
        new Validator();
      } catch (e) {
        assert.deepStrictEqual(e.message, "rules can't empty");
      }
    });
    it('will throw content empty error', () => {
      try {
        new Validator(rules);
      } catch (e) {
        assert.deepStrictEqual(e.message, "content can't empty");
      }
    });
    it('appear server error', () => {
      try {
        const validator = new Validator(rules, {
          name: '',
          phone: '',
          email: '',
        });
        mm(validator, '_initErr', function() {
          throw new Error('server error');
        });
      } catch (e) {
        assert.deepStrictEqual(e.message, 'server error');
      }
    });
    it('instance will init success', async () => {
      new Validator(rules, {
        name: '',
        phone: '',
        email: '',
      });
    });
    it('variable is require, but does not provide', async () => {
      const validator = new Validator(rules, {
        phone: '18158655787',
        email: '1289110832@qq.com',
      });
      const res = validator.vali();
      assert.deepStrictEqual(res, validator._errMessage.require('name'));
    });
    it("variable type isn't expected type", async () => {
      const name = 123;
      const validator = new Validator(rules, {
        name,
        phone: '18158655787',
        email: '1289110832@qq.com',
      });
      const res = validator.vali();
      assert.deepStrictEqual(
        res,
        validator._errMessage.type('name', rules.name.type, typeof name)
      );
    });
    it("variable can't empty", async () => {
      const validator = new Validator(rules, {
        name: '',
        phone: '18158655787',
        email: '1289110832@qq.com',
      });
      const res = validator.vali();
      assert.deepStrictEqual(res, validator._errMessage.noEmpty('name'));
    });
    it('variable is phone', async () => {
      const validator = new Validator(rules, {
        name: 'inrush',
        phone: '18158655sads',
        email: '1289110832@qq.com',
      });
      const res = validator.vali();
      assert.deepStrictEqual(res, validator._errMessage.phone('phone'));
    });

    it('variable is email', async () => {
      const validator = new Validator(rules, {
        name: 'inrush',
        phone: '18158655787',
        email: '1289110832qq.com',
      });
      const res = validator.vali();
      assert.deepStrictEqual(res, validator._errMessage.email('email'));
    });

    it('validata success', async () => {
      const validator = new Validator(rules, {
        name: 'inrush',
        phone: '18158655787',
        email: '1289110832@qq.com',
      });
      const res = validator.vali();
      assert.deepStrictEqual(res, {
        name: 'inrush',
        phone: '18158655787',
        email: '1289110832@qq.com',
        sex: undefined,
      });
    });

    it('change language', async () => {
      const validator = new Validator(rules, {
        name: 'inrush',
        phone: '18158655787',
        email: '1289110832@qq.com',
      });
      const errs_en = validator._errMessage;
      validator.lang = 'zh_CN';
      const errs_zh_CN = validator._errMessage;
      assert.deepStrictEqual(
        errs_en.require('name'),
        validator.EN_ERR.require('name')
      );
      assert.deepStrictEqual(
        errs_en.phone('name'),
        validator.EN_ERR.phone('name')
      );
      assert.deepStrictEqual(
        errs_en.email('name'),
        validator.EN_ERR.email('name')
      );
      assert.deepStrictEqual(
        errs_en.type('name'),
        validator.EN_ERR.type('name')
      );
      assert.deepStrictEqual(
        errs_en.noEmpty('name'),
        validator.EN_ERR.noEmpty('name')
      );

      assert.deepStrictEqual(
        errs_zh_CN.require('name'),
        validator.ZH_CN_ERR.require('name')
      );
      assert.deepStrictEqual(
        errs_zh_CN.phone('name'),
        validator.ZH_CN_ERR.phone('name')
      );
      assert.deepStrictEqual(
        errs_zh_CN.email('name'),
        validator.ZH_CN_ERR.email('name')
      );
      assert.deepStrictEqual(
        errs_zh_CN.type('name'),
        validator.ZH_CN_ERR.type('name')
      );
      assert.deepStrictEqual(
        errs_zh_CN.noEmpty('name'),
        validator.ZH_CN_ERR.noEmpty('name')
      );
    });
  });
});
