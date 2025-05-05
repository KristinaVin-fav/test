import express from 'express';
import sequelize from './sequelize.js';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import multer from 'multer'; // Добавляем multer

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const upload = multer(); // Создаем экземпляр multer

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/auth', upload.none(), authRoutes); // Используем upload.none()
app.use('/request', requestRoutes);

app.get('/admin', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/auth');
    }
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'auth.html'));
});

app.get('/request', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth');
    }
    res.sendFile(path.join(__dirname, 'views', 'request.html'));
});

app.get('/user-requests', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth');
    }
    res.sendFile(path.join(__dirname, 'views', 'user-requests.html'));
});

// Обработка ошибок 404
app.use((req, res, next) => {
    res.status(404).send('Страница не найдена');
});

// Обработка ошибок 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Произошла ошибка сервера');
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
    } catch (error) {
        console.error(error);
    }
};

start();