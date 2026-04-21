const express = require('express');
const { protect: auth } = require('../middleware/auth');
const { chat, getHistory, saveMessage } = require('../controllers/coachController');

const router = express.Router();

router.post('/chat',    auth, chat);
router.get('/history',  auth, getHistory);
router.post('/history', auth, saveMessage);

module.exports = router;
