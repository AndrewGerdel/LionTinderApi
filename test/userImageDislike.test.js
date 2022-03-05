import assert from 'assert';
import sinon from 'sinon';
import { saveUserImageDislike } from '../logic/userImageDislike.js';
import { Mongo } from '../db/mongoDb.js';

let sandbox;
let mockObj;
describe('userImageDisike tests', () => {
    before(() => {
        sandbox = sinon.createSandbox();
        mockObj = sinon.stub(Mongo, "insertUserImageDislike");
    });
    after(() => {
        sandbox.restore();
    });

    it('returns 200 success if saveUserImageDislike is successful', async () => {
        const req = {
            body: {
                userImageDislike: {
                    hash: "cc1adfc06f3bae779ec0b1b9d38a39dc6b9c3cbbe0bc26d9be4a460db58eca4a"
                }
            },
            user: {
                userId: "12345"
            }
        };
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
        // mockObj.returns([{ user: 'UnitTestUser' }]);
        await saveUserImageDislike(req, res);
    });

    it('returns 400 failure if hash is missing', async () => {
        const req = {
            body: {
                userImageDislike: {
                }
            },
            user: {
                userId: "12345"
            }
        };
        const res = {
            status: (code) => {
                assert.equal(code, 400);
                return {
                    json: (output) => {
                        assert.equal(output.success, false);
                    }
                };
            }
        };
        await saveUserImageDislike(req, res);
    });

    it('returns 500 error if server error', async () => {
        const req = {
            body: {
                userImageDislike: {
                    hash: "cc1adfc06f3bae779ec0b1b9d38a39dc6b9c3cbbe0bc26d9be4a460db58eca4a"
                }
            },
            user: {
                userId: "12345"
            }
        };
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
        mockObj.throws("unit test error");
        await saveUserImageDislike(req, res);
    });
});
