// ... (기존 상단 코드 생략되지 않도록 전체 덮어쓰기 권장)
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth.middleware');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { emotion_id, bible_verse_id, content } = req.body;
        const user_id = req.user.id;

        // 1. 저널 저장
        const [result] = await db.query(
            'INSERT INTO journals (user_id, emotion_id, bible_verse_id, content) VALUES (?, ?, ?, ?)',
            [user_id, emotion_id, bible_verse_id, content]
        );

        // 2. 스트릭 갱신
        await db.query('UPDATE users SET current_streak = current_streak + 1 WHERE id = ?', [user_id]);

        // 3. 뱃지 체크 (첫 저널인 경우)
        const [journals] = await db.query('SELECT COUNT(*) as count FROM journals WHERE user_id = ?', [user_id]);
        if (journals[0].count === 1) {
            await db.query('INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, 1)', [user_id]);
        }

        res.status(201).json({ 
            message: "저널 저장 완료! 첫 뱃지를 획득하셨을 수도 있습니다.", 
            journalId: result.insertId 
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

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
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 내 감정 통계 (어떤 감정을 가장 많이 느꼈나?)
router.get('/stats/emotions', verifyToken, async (req, res) => {
    try {
        const [stats] = await db.query(
            'SELECT e.name, COUNT(j.id) as count FROM journals j ' +
            'JOIN emotions e ON j.emotion_id = e.id ' +
            'WHERE j.user_id = ? GROUP BY e.id ORDER BY count DESC',
            [req.user.id]
        );
        res.json(stats);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

