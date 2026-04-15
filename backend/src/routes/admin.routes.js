const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

router.get('/stats', verifyToken, adminOnly, async (req, res) => {
    try {
        const [[uCount]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
        const [[jCount]] = await db.query('SELECT COUNT(*) as totalJournals FROM journals');
        res.json({ userCount: uCount.totalUsers, journalCount: jCount.totalJournals });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
