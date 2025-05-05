import { User } from '../models/mapping.js';
import bcrypt from 'bcrypt';
import { Admin } from '../models/mapping.js';
const register = async (req, res) => {
    try {
        const { surname, name, lastname, phone, email, password } = req.body;

        if (!surname || !name || !lastname || !phone || !email || !password) {
            return res.status(400).send('Все поля обязательны для заполнения');
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send('Пользователь с таким email уже существует');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            surname, name, lastname, phone, email, pass: hashedPassword,
        });

        res.redirect('/auth');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при регистрации');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !await bcrypt.compare(password, user.pass)) {
            return res.status(400).send('Неверный email или пароль');
        }

        req.session.user = user;
        res.redirect('/request');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при авторизации');
    }
};

export { register, login };