import path from 'path';
import crypto from 'crypto';
import { Mongo } from '../db/mongoDb.js';
import request from 'request';
import fs from 'fs';

const allowedFileExtensions = ['.png', '.jpg', '.jpeg'];

export const uploadImage = (async (req, res) => {
    try {
        console.log('uploadImage: ', new Date());
        if (req.files && req.files.uploadedImage) {
            const uploadedImage = req.files.uploadedImage;
            if (!allowedFileExtensions.includes(path.extname(uploadedImage.name))) {
                console.log('invalid file extension');
                res.status(401).json({ success: false, error: "Invalid file extension" });
            } else {
                const hash = crypto.createHash('sha256').update(JSON.stringify(uploadedImage)).digest('hex');
                console.log(`Saving file with hash ${hash}`);
                const fileName = `${hash}${path.extname(uploadedImage.name)}`;
                const filePath = path.join(`uploadedImages`, fileName);
                uploadedImage.mv(filePath);
                await Mongo.saveImage(hash, fileName, req.body.name, req.body.description);
                res.status(200).json({ success: true, hash });
            }
        } else {
            console.log('no files in request');
            res.status(400).json({ success: false, error: "No file uploaded" });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

export const uploadImageByUrl = (async (req, res) => {
    try {
        console.log('uploadImageByUrl: ', new Date());
        const imageUrl = req.body.imageUrl;
        if (!allowedFileExtensions.includes(path.extname(imageUrl))) {
            console.log('invalid file extension');
            res.status(401).json({ success: false, error: "Invalid file extension" });
        } else {
            const tempFilePath = path.join('uploadedImages', path.basename(imageUrl));
            download(imageUrl, tempFilePath, async () => {
                const hash = crypto.createHash('sha256').update(JSON.stringify(fs.readFileSync(tempFilePath))).digest('hex');
                console.log(`Saving file with hash ${hash}`);
                const fileName = `${hash}${path.extname(imageUrl)}`;
                const filePath = path.join(`uploadedImages`, fileName);
                fs.rename(tempFilePath, filePath, async () => {
                    await Mongo.saveImage(hash, fileName, req.body.name, req.body.description);
                    res.status(200).json({ success: true, hash });
                });
            })
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

var download = (async (uri, filename, callback) => {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
});


export const getImage = (async (req, res) => {
    try {
        console.log('getImage: ', new Date());
        const hash = req.query.hash;
        const result = await Mongo.getImg(hash);
        if (result) {
            res.status(200)
                .set({ "details": JSON.stringify({ "name": result.name, "description": result.description }) })
                .sendFile('/uploadedImages/' + result.filename, { root: '.' });
        } else {
            res.status(404).json({ success: false, error: "Image hash not found" });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

export const getLikedImages = (async (req, res) => {
    try {
        console.log('getLikedImages: ', new Date());
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, error: "Missing userId in request" });
        } else {
            const userId = req.user.userId;
            const [allImages, likedImages] = await Promise.all([
                Mongo.getAllImages(),
                Mongo.getLikedImages(userId)])
            const results = likedImages.map(x => {
                var allImagesRecord = allImages.find(i => i.hash === x.hash);
                if(allImagesRecord){
                    return { hash: x.hash, name: allImagesRecord.name, description: allImagesRecord.name }
                }
            });
            res.status(200).json({ success: true, results: results });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

export const getDislikedImages = (async (req, res) => {
    try {
        console.log('getDislikedImages: ', new Date());
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, error: "Missing userId in request" });
        } else {
            const userId = req.user.userId;

            const [allImages, dislikedImages] = await Promise.all([
                Mongo.getAllImages(),
                Mongo.getDislikedImages(userId)])
            const results = dislikedImages.map(x => {
                var allImagesRecord = allImages.find(i => i.hash === x.hash);
                if(allImagesRecord){
                    return { hash: x.hash, name: allImagesRecord.name, description: allImagesRecord.name }
                }
            });
            res.status(200).json({ success: true, results: results });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

export const getNewImages = (async (req, res) => {
    try {
        console.log('getNewImages: ', new Date());
        if (!req.user || !req.user.userId) {
            res.status(401).json({ success: false, error: "Missing userId in request" });
        } else {
            const userId = req.user.userId;
            const images = await Promise.all([
                Mongo.getAllImages(),
                Mongo.getLikedImages(userId),
                Mongo.getDislikedImages(userId)])
            let allImagesHashes = images[0].map(x => {
                return { hash: x.hash, name: x.name, description: x.description }
            });
            const likedImagesHashes = images[1].map(x => x.hash);
            const dislikedImagesHashes = images[2].map(x => x.hash);

            allImagesHashes = allImagesHashes
                .filter((x) => !likedImagesHashes.includes(x.hash))
                .filter((y) => !dislikedImagesHashes.includes(y.hash));

            res.status(200).json({ success: true, results: allImagesHashes });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, error: "Server error" });
    }
});