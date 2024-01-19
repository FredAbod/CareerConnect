const express = require('express');
const {postNews, getNews, signUp, login, verify, resendOtp, forgotPassword, resetPassword, uploadPicture} = require('../controllers/userControllers');
const upload = require('../image/multer');
const isAuthenticated = require('../middleware/authentication');
const router = express.Router();

// const app = express();


router.post('/addNews',upload.single('image'), isAuthenticated, postNews);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/verify', verify);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);
router.post('/profilepic/:id',upload.single('profilePic'), uploadPicture);
router.post('/resendotp', resendOtp);
router.get('/allnews', getNews);



module.exports = router;