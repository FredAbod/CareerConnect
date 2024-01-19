const express = require('express');
const {postNews, getNews, signUp, login} = require('../controllers/userControllers');
const isAuthenticated = require('../middleware/authentication');
const router = express.Router();

// const app = express();


router.post('/addNews',isAuthenticated, postNews);
router.post('/signup', signUp);
router.post('/login', login);
router.get('/allnews', isAuthenticated, getNews);



module.exports = router;