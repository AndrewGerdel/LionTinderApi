import { Mongo } from '../db/mongoDb.js';

export default (async (req, res) => {
    try {
        console.log('health: ', new Date());
        const allUsers = await Mongo.getAllUsers();
        console.log(`healthCheck found ${allUsers.length} users in the db.`);
        res.status(200).json({ success: true, status: `The service is up and running.` });
    } catch (e) {
        console.log('Error:', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});