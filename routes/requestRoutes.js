import express from 'express';
import { createRequest, getUslugi, getRequestById, updateRequest } from '../controllers/requestController.js';
import { Request, Uslugi, User } from '../models/mapping.js';

const router = express.Router();

router.get('/admin/requests', async (req, res) => {
    try {
        const requests = await Request.findAll({
            include: [{ model: Uslugi, attributes: ['name'] }]
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.get('/admin/requests/:id', getRequestById);
router.patch('/admin/requests/:id', updateRequest); // Вместо put
// Исправленный маршрут
router.patch('/admin/requests/:id', async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        
        await request.update({
            status: req.body.status,
            cancelReason: req.body.cancelReason,
            comment: req.body.comment
        });
        
        res.json({ message: 'Заявка обновлена', request });
    } catch (error) {
        console.error('Ошибка обновления:', error);
        res.status(500).json({ 
            error: 'Ошибка сервера',
            details: error.message 
        });
    }
});
router.post('/create', createRequest);
router.get('/uslugi', getUslugi);

router.get('/user-requests', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const requests = await Request.findAll({
            where: { user_id: userId },
            include: [{ model: Uslugi, attributes: ['name'] }]
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.delete('/admin/requests/:id', async (req, res) => {
    try {
        await Request.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Заявка удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});
export default router;