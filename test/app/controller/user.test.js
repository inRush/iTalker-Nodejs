'use strict';
const mm = require('egg-mock');
// const assert = require('assert');
const Response = require('../../../app/model/api/base/response.js');

describe('test/app/controller/user.test.js', () => {
  let app;
  before(() => {
    app = mm.app();
    return app.ready();
  });

  afterEach(mm.restore);
  after(() => app.close());

  const user = {
    id: 'd52ecd4f-4378-47cd-82f3-e9ad6f385637',
    name: 'inrush',
    phone: '18158655787',
    password: 'inrush',
    portrait: null,
    description: null,
    sex: 1,
    token: null,
    pushId: null,
    lastReceivedAt: '2017-07-30T12:05:56.480Z',
    updatedAt: '2017-07-30T12:05:56.480Z',
  };
  const responseUser = {
    portrait: user.portrait,
    desc: user.description,
    following: 0,
    follows: 0,
    id: user.id,
    isFollow: false,
    modifyAt: user.updatedAt,
    name: user.name,
    phone: user.phone,
    sex: user.sex,
  };
  const success = {
    code: 1,
    message: 'ok',
    result: {
      account: user.phone,
      isBind: true,
      token: user.token,
      user: responseUser,
    },
    time: 1501413593544,
  };
  function mmbuildOk() {
    mm(Response, 'buildOk', function(rsp) {
      return {
        code: 1,
        message: 'ok',
        result: rsp,
        time: 1501413593544,
      };
    });
  }

  describe('test user register api', () => {
    afterEach(mm.restore);
    const postUser = {
      account: user.phone,
      password: user.password,
      name: user.name,
    };
    const pushIdUser = Object.assign({}, postUser, { pushId: '1234' });

    it('should post /api/user/register 422 account already exist', async () => {
      mm(Response, 'buildHaveAccountError', function() {
        return {
          code: 4001,
          message: 'account already exist',
          time: 1501413593544,
        };
      });
      app.mockService('user', 'findByPhone', {
        account: '18158655787',
        name: 'inrush',
      });
      await app
        .httpRequest()
        .post('/api/user/register')
        .send(postUser)
        .expect(422, {
          code: 4001,
          message: 'account already exist',
          time: 1501413593544,
        });
    });

    it('should post /api/user/register 422 params check err', async () => {
      app.mockContext({
        validate: () => {
          return {
            status: 422,
            result: 'param err',
          };
        },
      });
      mm(Response, 'buildParameterError', function(result) {
        return {
          code: 4001,
          message: result,
          time: 1501413593544,
        };
      });
      await app
        .httpRequest()
        .post('/api/user/login')
        .send(postUser)
        .expect(422, {
          code: 4001,
          message: 'param err',
          time: 1501413593544,
        });
    });

    it('should post /api/user/register 422 name already exist', async () => {
      mm(Response, 'buildHaveNameError', function() {
        return {
          code: 4001,
          message: 'name already exist',
          time: 1501413593544,
        };
      });
      app.mockService('user', 'findByPhone', null);
      app.mockService('user', 'findByName', {
        account: '18158655787',
        name: 'inrush',
      });
      await app
        .httpRequest()
        .post('/api/user/register')
        .send(postUser)
        .expect(422, {
          code: 4001,
          message: 'name already exist',
          time: 1501413593544,
        });
    });

    it('should post /api/user/register 422 register err', async () => {
      app.mockService('user', 'findByPhone', null);
      app.mockService('user', 'findByName', null);
      app.mockService('user', 'register', null);
      mm(Response, 'buildRegisterError', function() {
        return {
          code: 4001,
          message: 'register err',
          time: 1501413593544,
        };
      });
      await app
        .httpRequest()
        .post('/api/user/register')
        .send(postUser)
        .expect(422, {
          code: 4001,
          message: 'register err',
          time: 1501413593544,
        });
    });

    it('should post /api/user/register 500 server err', async () => {
      app.mockService('user', 'findByPhone', null);
      app.mockService('user', 'findByName', null);
      app.mockService('user', 'register', { account: 'inrush' });
      app.mockService('user', 'bind', null);
      mm(Response, 'buildServiceError', function() {
        return {
          code: 4001,
          message: 'server err',
          time: 1501413593544,
        };
      });

      await app
        .httpRequest()
        .post('/api/user/register')
        .send(pushIdUser)
        .expect(500, {
          code: 4001,
          message: 'server err',
          time: 1501413593544,
        });
    });

    it('should post /api/user/register 200 account register success, no bind pushId', async () => {
      mmbuildOk();
      app.mockService('user', 'findByPhone', null);
      app.mockService('user', 'findByName', null);
      app.mockService('user', 'register', user);
      success.result.isBind = false;
      await app
        .httpRequest()
        .post('/api/user/register')
        .send(postUser)
        .expect(200, success);
    });

    it('should post /api/user/register 200 account register success, bind pushId', async () => {
      mmbuildOk();
      app.mockService('user', 'findByPhone', null);
      app.mockService('user', 'findByName', null);
      app.mockService('user', 'register', user);
      app.mockService('user', 'bind', function(user, pushId) {
        user.pushId = pushId;
        return user;
      });
      success.result.isBind = true;
      await app
        .httpRequest()
        .post('/api/user/register')
        .send(pushIdUser)
        .expect(200, success);
    });
  });

  describe('test user login api', () => {
    afterEach(mm.restore);
    const loginUser = {
      account: user.phone,
      password: user.password,
    };
    it('should post /api/user/login 422 params check err', async () => {
      app.mockContext({
        validate: () => {
          return {
            status: 422,
            result: 'param check err',
          };
        },
      });
      mm(Response, 'buildParameterError', function(result) {
        return {
          code: 4001,
          message: result,
          time: 1501413593544,
        };
      });
      await app
        .httpRequest()
        .post('/api/user/login')
        .send(loginUser)
        .expect(422, {
          code: 4001,
          message: 'param check err',
          time: 1501413593544,
        });
    });

    it('should post /api/user/login 422 account err or password err', async () => {
      mm(Response, 'buildLoginError', function() {
        return {
          code: 4001,
          message: 'login error',
          time: 1501413593544,
        };
      });
      app.mockService('user', 'login', null);
      await app
        .httpRequest()
        .post('/api/user/login')
        .send(loginUser)
        .expect(422, {
          code: 4001,
          message: 'login error',
          time: 1501413593544,
        });
    });

    it('should post /api/user/login 200 login success, not bind pushId', async () => {
      mmbuildOk();
      app.mockService('user', 'login', user);
      success.result.isBind = false;
      await app
        .httpRequest()
        .post('/api/user/login')
        .send(loginUser)
        .expect(200, success);
    });
    it('should post /api/user/login 200 login success, bind pushId', async () => {
      mmbuildOk();
      app.mockService('user', 'login', user);
      app.mockService('user', 'bind', function(user, pushId) {
        user.pushId = pushId;
        return user;
      });
      success.result.isBind = true;
      const pushIdUser = Object.assign({}, loginUser, { pushId: '12312' });
      await app
        .httpRequest()
        .post('/api/user/login')
        .send(pushIdUser)
        .expect(200, success);
    });
  });

  describe('test user bind pushId api', () => {
    afterEach(mm.restore);
    const token = 'SJOJSAOJOSDNASKsjdasjOASJ';
    it('should post /api/user/bind 422 params check err', async () => {
      app.mockContext({
        validate: () => {
          return {
            status: 422,
            result: 'param check err',
          };
        },
      });
      mm(Response, 'buildParameterError', function(result) {
        return {
          code: 4001,
          message: result,
          time: 1501413593544,
        };
      });
      await app
        .httpRequest()
        .post('/api/user/bind')
        .set('token', token)
        .send({ pushId: '1234' })
        .expect(422, {
          code: 4001,
          message: 'param check err',
          time: 1501413593544,
        });
    });

    it('should post /api/user/bind 422 account error', async () => {
      mm(Response, 'buildAccountError', function() {
        return {
          code: 4001,
          message: 'account error',
          time: 1501413593544,
        };
      });
      app.mockService('user', 'findByToken', null);
      await app
        .httpRequest()
        .post('/api/user/bind')
        .set('token', token)
        .send({ pushId: '1234' })
        .expect(422, {
          code: 4001,
          message: 'account error',
          time: 1501413593544,
        });
    });

    it('should post /api/user/bind 200 bind success', async () => {
      mmbuildOk();
      app.mockService('user', 'findByToken', function(token) {
        if (!token) {
          return null;
        }
        return user;
      });
      app.mockService('user', 'bind', function(user, pushId) {
        user.pushId = pushId;
        return user;
      });
      success.result.isBind = true;
      await app
        .httpRequest()
        .post('/api/user/bind')
        .set('token', token)
        .send({ pushId: '1234' })
        .expect(200, success);
    });
  });
});
