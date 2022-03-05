import assert from 'assert';
import sinon from 'sinon';
import { uploadImage, getLikedImages, getDislikedImages } from '../logic/image.js';
import { Mongo } from '../db/mongoDb.js';

let sandbox;
let mockObj;
describe('image tests', () => {
    before(() => {
        sandbox = sinon.createSandbox();
        mockObj = sinon.stub(Mongo, "saveImage");
    });
    after(() => {
        sandbox.restore();
    });

    it('returns 200 success response on uploadImage', async () => {
        const req = {
            files: {
                uploadedImage: {
                    name: 'unitTest.jpg',
                    mv: (path) => { }
                }
            },
            body: {
                name: "unitTest.jpg"
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
        await uploadImage(req, res);
    });

    it('returns 400 error if no image requested', async () => {
        const req = {
            files: {
            },
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
        await uploadImage(req, res);
    });

    it('returns 401 error on invalid extension', async () => {
        const req = {
            files: {
                uploadedImage: {
                    name: 'unitTest.pdf',
                    mv: (path) => { }
                }
            },
            body: {
                name: "unitTest.pdf"
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
        await uploadImage(req, res);
    });

    it('returns 500 on server error', async () => {
        const req = {
            files: {
                uploadedImage: {
                    name: 'unitTest.jpg',
                    mv: (path) => { }
                }
            },
            body: {
                name: "unitTest.jpg"
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
        await uploadImage(req, res);
    });

});

describe('getLikedImages tests', () => {
    before(() => {
        sandbox = sinon.createSandbox();
        mockObj = sinon.stub(Mongo, "getLikedImages");
    });
    after(() => {
        sandbox.restore();
    });

    it('returns 200 success response on getLikedImages', async () => {
        const req = {
            user: {
                userId: "98765"
            },
        };
        const res = {
            status: (code) => {
                assert.equal(code, 200);
                return {
                    json: (output) => {
                        assert.equal(output.success, true);
                        assert.equal(output.results.length, 3);
                        assert.equal(JSON.stringify(output.results), JSON.stringify(['abc1', 'abc2', 'abc3']));
                    }
                };
            }
        };
        mockObj.returns([{ _id: '1', hash: 'abc1' }, { _id: '2', hash: 'abc2' }, { _id: '3', hash: 'abc3' }]);
        await getLikedImages(req, res);
    });

    it('returns 401 on missing userId', async () => {
        const req = {
            user: {
            },
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
        await getLikedImages(req, res);
    });

    it('returns 500 on server error', async () => {
        const req = {
            user: {
            },
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
        mockObj.throws("A unit test error");
        await getLikedImages(req, res);
    });
});

describe('getDislikedImages tests', () => {
    before(() => {
        sandbox = sinon.createSandbox();
        mockObj = sinon.stub(Mongo, "getDislikedImages");
    });
    after(() => {
        sandbox.restore();
    });

    it('returns 200 success response on getDislikedImages', async () => {
        const req = {
            user: {
                userId: "98765"
            },
        };
        const res = {
            status: (code) => {
                assert.equal(code, 200);
                return {
                    json: (output) => {
                        assert.equal(output.success, true);
                        assert.equal(output.results.length, 3);
                        assert.equal(JSON.stringify(output.results), JSON.stringify(['abc1', 'abc2', 'abc3']));
                    }
                };
            }
        };
        mockObj.returns([{ _id: '1', hash: 'abc1' }, { _id: '2', hash: 'abc2' }, { _id: '3', hash: 'abc3' }]);
        await getDislikedImages(req, res);
    });

    it('returns 401 on missing userId', async () => {
        const req = {
            user: {
            },
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
        await getDislikedImages(req, res);
    });

    it('returns 500 on server error', async () => {
        const req = {
            user: {
            },
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
        mockObj.throws("A unit test error");
        await getDislikedImages(req, res);
    });
});