'use strict';
const mm = require('egg-mock');
const assert = require('assert');
const jwt = require('jsonwebtoken');
describe('test/app/service/user.test.js', () => {
  let app;
  let ctx;
  const user = {
    id: 'IOSAOIDJAOSJDOISAHO',
    account: '18158655787',
    password: 'inrush',
    name: 'inrush',
  };
  let encryPwd;
  before(async () => {
    app = mm.app();
    await app.ready();
    ctx = app.mockContext();
    encryPwd = ctx.helper.base64(ctx.helper.md5(user.password));
  });

  afterEach(mm.restore);
  after(() => app.close());

  describe('register()', () => {
    it('shoule register failed by account message error', async () => {
      mm(ctx.model.User, 'create', function() {
        const e = new Error('account message error');
        e.status = 403;
        throw e;
      });
      try {
        await ctx.service.user.register(user.account, user.password, user.name);
      } catch (error) {
        assert(error.status === 403);
        assert(error.message === 'account message error');
      }
    });

    it('shoule register success', async () => {
      mm(ctx.model.User, 'create', function(u) {
        assert.deepStrictEqual(u, {
          name: user.name,
          phone: user.account,
          sex: 1,
          password: encryPwd,
        });
        return u;
      });

      const u = await ctx.service.user.register(
        user.account,
        user.password,
        user.name
      );
      assert.deepStrictEqual(u, {
        name: user.name,
        phone: user.account,
        sex: 1,
        password: encryPwd,
      });
    });
  });

  describe('login()', () => {
    it('shoule login failed by account message error', async () => {
      mm(ctx.model.User, 'findOne', function() {
        const e = new Error('account message error');
        e.status = 403;
        throw e;
      });

      try {
        await ctx.service.user.login(user.account, user.password);
      } catch (error) {
        assert(error.status === 403);
        assert(error.message === 'account message error');
      }
    });

    it('shoule login failed by account not found', async () => {
      mm(ctx.model.User, 'findOne', function() {
        return null;
      });

      const u = await ctx.service.user.login(user.account, user.password);
      assert(u === null);
    });

    it('shoule login failed by update token failed', async () => {
      mm(ctx.model.User, 'findOne', function(condition) {
        assert.deepStrictEqual(condition, {
          where: {
            phone: user.account,
            password: encryPwd,
          },
        });
        return {
          phone: user.account,
          name: user.name,
        };
      });
      mm(ctx.model.User, 'update', function() {
        return 0;
      });

      const u = await ctx.service.user.login(user.account, user.password);
      assert(u === null);
    });

    it('shoule login success', async () => {
      const keys = app.config.keys;
      const token = jwt.sign({ phone: user.account, name: user.name }, keys);
      mm(ctx.model.User, 'findOne', function(condition) {
        assert.deepStrictEqual(condition, {
          where: {
            phone: user.account,
            password: encryPwd,
          },
        });
        return {
          phone: user.account,
          name: user.name,
        };
      });
      mm(ctx.model.User, 'update', function(t) {
        assert.deepStrictEqual(t.token, token);
        return 1;
      });
      const u = await ctx.service.user.login(user.account, user.password);
      assert.deepStrictEqual(u, {
        phone: user.account,
        name: user.name,
        token,
      });
    });
  });

  describe('bind()', () => {
    it('should bind pushId failed by pushId is null or undefined', async () => {
      let u = {
        phone: user.account,
        name: user.name,
        password: encryPwd,
      };
      u = await ctx.service.user.bind(u);
      assert(u === null);
    });

    it('should bind pushId failed by update error', async () => {
      const pushId = 'adsasdaw';
      const u = {
        phone: user.account,
        name: user.name,
        password: encryPwd,
        pushId: '12321',
      };
      mm(ctx.model.User, 'findAll', function() {
        return null;
      });
      mm(ctx.model.User, 'update', function() {
        return 0;
      });
      const us = await ctx.service.user.bind(u, pushId);
      assert(us === null);
    });

    it('should bind pushId, but pushId already exists in other people message', async () => {
      const pushId = 'adsasdaw';
      const u = {
        id: user.id,
        phone: user.account,
        name: user.name,
        password: encryPwd,
        pushId: '12332',
      };
      mm(ctx.model.User, 'findAll', function() {
        return [ u ];
      });
      mm(ctx.model.User, 'update', function({ pushId }, { where }) {
        assert(pushId === null);
        assert.deepStrictEqual(where, {
          id: user.id,
        });
        throw new Error('other people have this pushId');
      });
      try {
        await ctx.service.user.bind(u, pushId);
      } catch (e) {
        assert.deepStrictEqual(e.message, 'other people have this pushId');
      }
    });

    it('should bind pushId success, pushId no change', async () => {
      const pushId = 'adsasdaw';
      const u = {
        phone: user.account,
        name: user.name,
        password: encryPwd,
        pushId,
      };
      mm(ctx.model.User, 'findAll', function() {
        return null;
      });
      const us = await ctx.service.user.bind(u, pushId);
      assert.deepStrictEqual(us, u);
    });
    it('should bind pushId success, pushId is change', async () => {
      const pushId = 'adsasdaw';
      const u = {
        phone: user.account,
        name: user.name,
        password: encryPwd,
        pushId: '12321',
      };
      mm(ctx.model.User, 'findAll', function() {
        return null;
      });
      mm(ctx.model.User, 'update', function() {
        return 1;
      });
      const us = await ctx.service.user.bind(u, pushId);
      assert.deepStrictEqual(us, u);
    });
  });

  describe('other function test', () => {
    it('findByPhone()', async () => {
      const phone = user.account;
      mm(app.model.User, 'findOne', function({ where }) {
        assert.deepStrictEqual(where, {
          phone,
        });
        return user;
      });
      const u = await ctx.service.user.findByPhone(phone);
      assert.deepStrictEqual(u, user);
    });
    it('findByName()', async () => {
      const name = user.name;
      mm(app.model.User, 'findOne', function({ where }) {
        assert.deepStrictEqual(where, {
          name,
        });
        return user;
      });
      const u = await ctx.service.user.findByName(name);
      assert.deepStrictEqual(u, user);
    });
    it('findByToken()', async () => {
      const token = '12312jahsdoasdoja';
      mm(app.model.User, 'findOne', function({ where }) {
        assert.deepStrictEqual(where, {
          token,
        });
        return user;
      });
      const u = await ctx.service.user.findByToken(token);
      assert.deepStrictEqual(u, user);
    });
    it('encodePassword()', async () => {
      const pwd = ctx.service.user.encodePassword(user.password);
      assert.deepStrictEqual(pwd, encryPwd);
    });
  });
});
