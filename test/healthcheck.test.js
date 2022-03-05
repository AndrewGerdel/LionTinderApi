import assert from 'assert';
import sinon from 'sinon';
import healthcheck from '../logic/healthcheck.js';
import { Mongo } from '../db/mongoDb.js';

let sandbox;
let mockObj;
describe('healthcheck tests', () => {
    before(() => {
        sandbox = sinon.createSandbox();
        mockObj = sinon.stub(Mongo, "getAllUsers");
    });
    after(() => {
        sandbox.restore();
    });

    it('returns 200 success', async () => {
        const req = {};
        const res = {
            status: (code) => {
                assert.equal(code, 200);
                return {
                    json: (output) => {
                        assert.equal(output.success, true);
                    }
                };
            }
        };
        mockObj.returns([{ user: 'fakeUser1' }, { user: 'fakeUser2' }]);
        await healthcheck(req, res);
    });

    it('returns 500 failure response on server error', async () => {
        const req = {};
        const res = {
            status: (code) => {
                assert.equal(code, 500);
                return {
                    json: (output) => {
                        assert.equal(output.success, false);
                    }
                };
            }
        };
        mockObj.throws('Unit test error to confirm error handling');
        await healthcheck(req, res);
    });
});
