const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../services/auth.service');
const verifyToken = require('../middleware/auth.middleware');
const db = require('../config/db');

router.post('/signup', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
        const userId = await registerUser(email, password, nickname);
        res.status(201).json({ message: "회원가입 성공!", userId });
    } catch (err) { res.status(500).json({ message: "서버 에러", error: err.message }); }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json({ message: "로그인 성공!", ...result });
    } catch (err) { res.status(401).json({ message: "로그인 실패", error: err.message }); }
});

router.get('/me', verifyToken, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, email, nickname, role, current_streak FROM users WHERE id = ?', [req.user.id]);
        res.json(users[0]);
    } catch (err) { res.status(500).json({ message: "서버 에러" }); }
});

module.exports = router;
