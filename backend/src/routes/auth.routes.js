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

// 업데이트된 내 정보 확인 API (획득한 뱃지 리스트 포함)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, email, nickname, role, current_streak FROM users WHERE id = ?', [req.user.id]);
        
        const [badges] = await db.query(
            'SELECT b.name, b.description FROM user_badges ub JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = ?', 
            [req.user.id]
        );
        
        res.json({ 
            ...users[0], 
            badges: badges 
        });
    } catch (err) { res.status(500).json({ message: "서버 에러", error: err.message }); }
});

// 프로필 정보 수정
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { nickname, status_message, profile_image } = req.body;
        await db.query(
            'UPDATE users SET nickname = ?, status_message = ?, profile_image = ? WHERE id = ?',
            [nickname, status_message, profile_image, req.user.id]
        );
        res.json({ message: "프로필이 성공적으로 업데이트되었습니다." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

