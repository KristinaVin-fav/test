import { Request, Uslugi } from '../models/mapping.js';

const createRequest = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Требуется авторизация' });
        }

        const { address, date, time, uslugaId, paymentType, wish } = req.body;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ error: 'Неверный формат даты' });
        }
        // Валидация
        const usluga = await Uslugi.findByPk(uslugaId);
        if (!usluga) {
            return res.status(400).json({ error: 'Услуга не найдена' });
        }

        // Создание заявки
        await Request.create({
            address,
            date,
            time,
            status: 'Новая',
            user_id: req.session.user.id,
            UslugaId: uslugaId,
            paymentType,
            wish,
            amount: usluga.price // Сохраняем цену
        });
        res.redirect('/index.html');
    } catch (error) {
        console.error("Ошибка при создании заявки:", error);
        res.status(500).send('Ошибка при создании заявки');
    }
};

const getUslugi = async (req, res) => {
    try {
        let uslugi = await Uslugi.findAll();

        if (uslugi.length === 0) {
            uslugi = await Uslugi.bulkCreate([
                { name: 'Установка кассового оборудования', price: '100', category: 'Категория 1', type: 'Тип 1' },
                { name: 'Расчетно-кассовое обслуживание', price: '200', category: 'Категория 2', type: 'Тип 2' },
                { name: 'Настройка ПО', price: '300', category: 'Категория 3', type: 'Тип 3' },
            ]);
        }

        res.json(uslugi);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении услуг');
    }
};

const getRequestById = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);
        if (request) {
            res.json(request);
        } else {
            res.status(404).json({ message: 'Заявка не найдена' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const updateRequest = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);
        if (request) {
            await request.update(req.body);
            res.json({ message: 'Заявка обновлена' });
        } else {
            res.status(404).json({ message: 'Заявка не найдена' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export { createRequest, getUslugi, getRequestById, updateRequest };