const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const emotionRoutes = require('./routes/emotion.routes');
const journalRoutes = require('./routes/journal.routes'); // 라우터 가져오기

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // JSON 바디 파싱 필수

// 엔진별 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/emotion', emotionRoutes);
app.use('/api/journal', journalRoutes); 

app.get('/', (req, res) => {
    res.send('WayPilgrim API Server Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
