'use strict';
const mm = require('egg-mock');
const assert = require('assert');

describe('test/app/extend/application.test.js__', () => {
  let app;
  before(() => {
    app = mm.app();
    return app.ready();
  });

  afterEach(mm.restore);
  after(() => app.close());

  describe('transaction()', () => {
    it('appear database error,transaction will rollback', async () => {
      mm(app.model, 'transaction', function() {
        return {
          rollback: () => {
            throw new Error('transaction will rollback');
          },
        };
      });
      try {
        await app.transaction(() => {
          throw new Error('appear database error');
        });
      } catch (error) {
        assert.deepStrictEqual(error.message, 'transaction will rollback');
      }
    });
    it('transaction will commit', async () => {
      mm(app.model, 'transaction', function() {
        return {
          rollback: () => {},
          commit: () => {
            throw new Error('transaction will commit');
          },
        };
      });
      try {
        await app.transaction(() => {
          return 1;
        });
      } catch (error) {
        assert.deepStrictEqual(error.message, 'transaction will commit');
      }
    });

    it('will get result', async () => {
      mm(app.model, 'transaction', function() {
        return {
          rollback: () => {},
          commit: () => {
            return;
          },
        };
      });
      const result = await app.transaction(() => {
        return 1;
      });
      assert.deepStrictEqual(result, 1);
    });
  });
});
