import { Mongo } from '../db/mongoDb.js';

export const saveUserImageLike = (async (req, res) => {
    try {
        console.log('saveUserImageLike: ', new Date());
        if (!req.body.userImageLike.hash) {
            res.status(400).json({ success: false, error: "Missing hash from request body" });
        } else {
            await Mongo.insertUserImageLike(req.body.userImageLike.hash, req.user.userId);
            res.status(200).json({ success: true });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
