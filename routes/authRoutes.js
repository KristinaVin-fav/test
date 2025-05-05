import express from 'express';
import { register, login } from '../controllers/authController.js';
import { Admin } from '../models/mapping.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Received data (req.body):", req.body);
        console.log("username:", username);
        console.log("password:", password);

        if (!username || !password) {
            return res.status(400).json({ message: 'Логин и пароль обязательны' });
        }

        const admin = await Admin.findOne({ where: { username: username } });
        console.log("Found admin:", admin);

        if (!admin) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        // Сравниваем пароли напрямую (без bcrypt)
        if (password !== admin.password) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        // Устанавливаем сессию администратора
        req.session.admin = admin;

        res.json({ message: 'Админ успешно авторизован' });
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: 'Произошла ошибка сервера' });
    }
});

export default router;