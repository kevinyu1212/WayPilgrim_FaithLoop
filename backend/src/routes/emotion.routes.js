const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth.middleware');

// 감정 목록 가져오기
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM emotions');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 특정 감정에 맞는 추천 구절 가져오기 (임시 로직)
router.get('/recommend/:emotionId', verifyToken, async (req, res) => {
    try {
        // 실제로는 감정-구절 매핑 테이블이 필요하지만, 우선 랜덤으로 하나 반환
        const [verses] = await db.query('SELECT * FROM bible_verses ORDER BY RAND() LIMIT 1');
        res.json(verses[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
