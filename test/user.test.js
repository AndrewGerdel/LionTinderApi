import assert from 'assert';
import sinon from 'sinon';
import { loginUser } from '../logic/user.js';
import { Mongo } from '../db/mongoDb.js';

let sandbox;
let mockObj;

describe('user', () => {
    before(() => {
        sandbox = sinon.createSandbox();
        mockObj = sinon.stub(Mongo, "getUser");
    });
    after(() => {
        sandbox.restore();
    });

    it('returns 200 success if login is successful', async () => {
        const req = {
            body: {
                user: {
                    username: "UnitTestUser",
                    password: "UnitTestPassword"
                }
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
        mockObj.returns([{ user: 'UnitTestUser' }]);
        process.env.TOKEN_PRIVATE_KEY = "abc123";
        await loginUser(req, res);
    });

    it('returns 400 error if missing username', async () => {
        const req = {
            body: {
                user: {
                    password: "UnitTestPassword"
                }
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
        await loginUser(req, res);
    });

    it('returns 400 error if missing password', async () => {
        const req = {
            body: {
                user: {
                    username: "UnitTestUser",
                }
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
        await loginUser(req, res);
    });

    it('returns 401 error if login fails', async () => {
        const req = {
            body: {
                user: {
                    username: "UnitTestUser",
                    password: "UnitTestPassword"
                }
            }
        };
        const res = {
            status: (code) => {
                assert.equal(code, 401);
                return {
                    json: (output) => {
                        assert.equal(output.success, false);
                    }
                };
            }
        };
        mockObj.returns([]);
        await loginUser(req, res);
    });

    it('returns 500 error if server error', async () => {
        const req = {
            body: {
                user: {
                    username: "UnitTestUser",
                    password: "UnitTestPassword"
                }
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
        process.env.TOKEN_PRIVATE_KEY = "abc123";
        await loginUser(req, res);
    });

});
