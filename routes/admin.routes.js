const express = require('express');
const isAuthenticated = require('../middleware/authentication');
const { adminSignUp } = require('../controllers/admin.controllers');
const router = express.Router();

// const app = express();


router.post('/signup', adminSignUp)


module.exports = router;