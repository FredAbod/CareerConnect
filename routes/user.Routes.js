const express = require('express');
const {postNews, getNews, signUp, login, verify, resendOtp, forgotPassword} = require('../controllers/userControllers');
const router = express.Router();

// const app = express();


router.post('/addNews', postNews);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/verify', verify);
router.post('/forgotPassword', forgotPassword);
router.post('/resendotp', resendOtp);
router.get('/allnews', getNews);



module.exports = router;