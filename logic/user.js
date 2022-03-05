import jwt from 'jsonwebtoken';
import { Mongo } from '../db/mongoDb.js';
import crypto from 'crypto';

export const loginUser = (async (req, res) => {
    try {
        console.log('loginUser: ', new Date());
        if (!req.body.user.username || !req.body.user.password) {
            res.status(400).json({ success: false, error: "Missing username or password from request body" });
        } else {
            const passwordHash = crypto.createHash('sha256').update(req.body.user.password).digest('hex');
            const result = await Mongo.getUser(req.body.user.username, passwordHash);
            if (result.length > 0) {
                const token = jwt.sign({ username: req.body.user.username, userId: result[0]._id }, process.env.TOKEN_PRIVATE_KEY, { expiresIn: "7d" });
                console.log(`Login successful ${req.body.user.username}`);
                res.status(200).json({ success: true, token });
            } else {
                console.log(`Login failed ${req.body.user.username}`);
                res.status(401).json({ success: false });
            }
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

export const createNewUser = (async (req, res) => {
    try {
        console.log('createUser: ', new Date());
        if (!req.body.user.username || !req.body.user.password) {
            res.status(400).json({ success: false, error: "Missing username or password from request body" });
        } else {
            const usernameExists = await Mongo.userExists(req.body.user.username);
            if (usernameExists) {
                res.status(400).json({ success: false, error: "User already exists" });
            } else {
                const passwordHash = crypto.createHash('sha256').update(req.body.user.password).digest('hex');
                const result = await Mongo.createUser(req.body.user.username, passwordHash);
                const token = jwt.sign({ username: req.body.user.username, userId: result.insertedId }, process.env.TOKEN_PRIVATE_KEY, { expiresIn: "24h" });
                res.status(200).json({ success: true, token });
            }
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});