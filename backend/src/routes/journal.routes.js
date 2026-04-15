const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth.middleware');

// 1. 오늘의 저널 기록 저장
router.post('/', verifyToken, async (req, res) => {
    try {
        const { emotion_id, bible_verse_id, content } = req.body;
        const user_id = req.user.id;

        const [result] = await db.query(
            'INSERT INTO journals (user_id, emotion_id, bible_verse_id, content) VALUES (?, ?, ?, ?)',
            [user_id, emotion_id, bible_verse_id, content]
        );

        // 연속 접속일(Streak) 갱신 로직 (간단 버전)
        await db.query('UPDATE users SET current_streak = current_streak + 1 WHERE id = ?', [user_id]);

        res.status(201).json({ message: "오늘의 순례 기록이 저장되었습니다.", journalId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. 내 저널 목록 가져오기
router.get('/my', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT j.*, e.name as emotion_name, b.content as bible_content FROM journals j ' +
            'JOIN emotions e ON j.emotion_id = e.id ' +
            'JOIN bible_verses b ON j.bible_verse_id = b.id ' +
            'WHERE j.user_id = ? ORDER BY j.created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
