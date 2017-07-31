'use strict';
const mm = require('egg-mock');
const assert = require('assert');
describe('test/app/extend/context.test.js', () => {
  let app;
  let ctx;
  before(async () => {
    app = mm.app();
    await app.ready();
    ctx = app.mockContext();
  });

  afterEach(mm.restore);
  after(() => app.close());

  describe('validate()', () => {
    it('will get paramErrStatus 422', async () => {
      const result = ctx.validate({ name: 'string' }, { name: 123 });
      assert.deepStrictEqual(result.status, 422);
    });
    it('will pass, get status 200', async () => {
      const result = ctx.validate({ name: 'string' }, { name: 'inrush' });
      assert.deepStrictEqual(result.status, 200);
    });
  });
});
