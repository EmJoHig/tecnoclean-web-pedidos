import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago.controller.js';

const router = Router();

// Crear preferencia
router.post('/create_preference', mercadopagoController.createPreference);

// Endpoint de diagnóstico para crear una preferencia mínima
router.get('/test_preference', mercadopagoController.testPreference);

// Endpoint para conocer si el token configurado es TEST (sandbox) o LIVE
router.get('/token_info', mercadopagoController.tokenInfo);

// Webhook de Mercado Pago
router.post('/webhook', mercadopagoController.mpWebhook);

export default router;
