const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (email, password, nickname) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)', [email, hashedPassword, nickname]);
    return result.insertId;
};

const loginUser = async (email, password) => {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) throw new Error('존재하지 않는 사용자입니다.');
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('비밀번호가 일치하지 않습니다.');
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user.id, nickname: user.nickname, email: user.email } };
};

module.exports = { registerUser, loginUser };
