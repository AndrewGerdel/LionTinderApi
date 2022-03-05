import { Mongo } from '../db/mongoDb.js';

export const saveUserImageDislike = (async (req, res) => {
    try {
        console.log('saveUserImageDislike: ', new Date());
        if (!req.body.userImageDislike.hash) {
            res.status(400).json({ success: false, error: "Missing hash from request body" });
        } else {
            await Mongo.insertUserImageDislike(req.body.userImageDislike.hash, req.user.userId);
            res.status(200).json({ success: true });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});