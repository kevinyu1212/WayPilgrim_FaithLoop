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

// 로그아웃 (간단한 메시지 응답 - 실제 토큰 무효화는 프론트엔드에서 수행)
router.post('/logout', verifyToken, (req, res) => {
    res.json({ message: "성공적으로 로그아웃되었습니다. 안녕히 가세요!" });
});

// 회원탈퇴 (유저와 관련된 모든 데이터 삭제)
router.delete('/withdraw', verifyToken, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); // 트랜잭션 시작 (모두 삭제되거나, 하나도 안 삭제되거나)

        const userId = req.user.id;

        // 1. 유저의 저널 기록 삭제
        await connection.query('DELETE FROM journals WHERE user_id = ?', [userId]);
        // 2. 유저의 뱃지 획득 정보 삭제
        await connection.query('DELETE FROM user_badges WHERE user_id = ?', [userId]);
        // 3. 유저 계정 삭제
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);

        await connection.commit(); // 확정
        res.json({ message: "회원 탈퇴가 완료되었습니다. 그동안 함께해주셔서 감사합니다." });
    } catch (err) {
        await connection.rollback(); // 에러 발생 시 취소
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;


