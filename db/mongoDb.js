import { default as mongodb } from 'mongodb';
const url = 'mongodb://localhost:27017';
const client = new mongodb.MongoClient(url);
const dbName = 'lionTinder';

class MongoDb {
    getAllUsers = (async () => {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');
        const results = await collection.find({}).toArray();
        return results;
    });

    userExists = (async (username) => {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');
        const results = await collection.find({ username }).toArray();
        return results.length >= 1 ? true : false;
    });

    getUser = (async (username, password) => {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');
        const results = await collection.find({ username, password }).toArray();
        return results;
    });

    createUser = (async (username, password) => {
        await client.connect();
        console.log('Connected successfully to mongodb');
        const db = client.db(dbName);
        const collection = db.collection('users');
        collection.createIndex({ 'username': 1 }, { unique: true });
        const insertResult = await collection.insertOne({ username, password });
        return insertResult;
    });

    saveImage = (async (hash, filename, name, description) => {
        await client.connect();
        console.log('Connected successfully to mongodb');
        const db = client.db(dbName);
        const collection = db.collection('image');
        collection.createIndex({ 'hash': 1 }, { unique: true });
        const recordCheck = await collection.findOne({ hash });
        if (recordCheck) {
            console.log('it already exits', recordCheck);
            return recordCheck;
        } else {
            console.log('inserting new');
            const insertResult = await collection.insertOne({ hash, filename, name, description });
            return insertResult;
        }
    });

    getImg = (async (hash) => {
        await client.connect();
        console.log('Connected successfully to mongodb');
        const db = client.db(dbName);
        const collection = db.collection('image');
        const record = collection.findOne({ hash });
        return record;
    });

    insertUserImageLike = (async (hash, userId) => {
        await client.connect();
        console.log('Connected successfully to mongodb');
        const db = client.db(dbName);
        const dislikeCollection = db.collection('userImageDislike');
        const query = { hash: { $eq: hash }, userId: { $eq: userId } };
        await dislikeCollection.deleteMany(query);
        const collection = db.collection('userImageLike');
        collection.createIndex({ 'hash': 1, 'userId': 1 }, { unique: true });
        const recordCheck = await collection.findOne({ hash });
        if (!recordCheck) {
            console.log(`inserting new LIKE record ${hash} ${userId}`);
            const insertResult = await collection.insertOne({ hash, userId });
            return insertResult;
        }
    });

    insertUserImageDislike = (async (hash, userId) => {
        await client.connect();
        console.log('Connected successfully to mongodb');
        const db = client.db(dbName);
        const likeCollection = db.collection('userImageLike');
        const query = { hash: { $eq: hash }, userId: { $eq: userId } };
        await likeCollection.deleteMany(query);
        const collection = db.collection('userImageDislike');
        collection.createIndex({ "hash": 1, "userId": 1 }, { unique: true });
        const recordCheck = await collection.findOne({ hash });
        if (!recordCheck) {
            console.log(`inserting new DISLIKE record ${hash} ${userId}`);
            const insertResult = await collection.insertOne({ hash, userId });
            return insertResult;
        }
    });

    getLikedImages = (async (userId) => {
        await client.connect();
        console.log('Connected successfully to mongodb');
        const db = client.db(dbName);
        const likeCollection = db.collection('userImageLike');
        return await likeCollection.find({ userId }).toArray();
    });

    getDislikedImages = (async (userId) => {
        await client.connect();
        console.log('Connected successfully to mongodb');
        const db = client.db(dbName);
        const likeCollection = db.collection('userImageDislike');
        return await likeCollection.find({ userId }).toArray();
    });

    getAllImages = (async () => {
        await client.connect();
        console.log('Connected successfully to mongodb');
        const db = client.db(dbName);
        const imageCollection = db.collection('image');
        return await imageCollection.find().toArray();
    });
}

export const Mongo = new MongoDb();
