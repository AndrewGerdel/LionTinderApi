import { default as mongodb } from 'mongodb';
const url = 'mongodb://localhost:27017';
const client = new mongodb.MongoClient(url);
const dbName = 'lionTinder';

client.connect().then(() => {
    const db = client.db(dbName);
    db.collection('image').drop()
    db.collection('userImageLike').drop()
    db.collection('userImageDislike').drop()
    console.log('Dropped all collections besides user...');
})
