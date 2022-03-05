import config from './config/config.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import bodyParser from 'body-parser';
import 'dotenv/config';
import auth from './middleware/auth.js';
import fileUpload from 'express-fileupload';
import healthCheck from './logic/healthcheck.js';
import { loginUser, createNewUser } from './logic/user.js';
import { uploadImage, getImage, getLikedImages, getDislikedImages, getNewImages, uploadImageByUrl } from './logic/image.js';
import { saveUserImageLike } from './logic/userImageLike.js';
import { saveUserImageDislike } from './logic/userImageDislike.js';

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json'));
const app = express();

app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(fileUpload({
    createParentPath: true
}));

app.get('/', (req, res) => {
    res.send("Swagger UI available <a href='/api-docs'>here</a>");
});

app.get('/api/health', async (req, res) => {
    await healthCheck(req, res);
});

app.post('/api/login', async (req, res) => {
    await loginUser(req, res);
});

app.post('/api/createUser', async (req, res) => {
    await createNewUser(req, res);
});

app.get('/api/validateToken', auth, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

app.put('/api/uploadImage', auth, async (req, res) => {
    await uploadImage(req, res);
});

app.put('/api/uploadImageByUrl', auth, async (req, res) => {
    await uploadImageByUrl(req, res);
});

app.get('/api/getImage', async (req, res) => {
    await getImage(req, res);
});

app.post('/api/saveUserImageLike', auth, async (req, res) => {
    await saveUserImageLike(req, res);
});

app.post('/api/saveUserImageDislike', auth, async (req, res) => {
    await saveUserImageDislike(req, res);
});

app.get('/api/getLikedImages', auth, async (req, res) => {
    await getLikedImages(req, res);
});

app.get('/api/getDislikedImages', auth, async (req, res) => {
    await getDislikedImages(req, res);
});

app.get('/api/getNewImages', auth, async (req, res) => {
    await getNewImages(req, res);
});

app.listen(config.PORT);
console.log(`Running on port ${config.PORT}`);