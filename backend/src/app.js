const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const journalRoutes = require('./routes/journal.routes');
const emotionRoutes = require('./routes/emotion.routes');
const adminRoutes = require('./routes/admin.routes'); // 관리자 추가

const app = express();

app.use(cors());
app.use(express.json());

// 라우트 연결
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/emotion', emotionRoutes);
app.use('/api/admin', adminRoutes); // 관리자 경로 연결

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✨ WayPilgrim Backend Engine Running on port ${PORT}`);
});
