import { Router } from 'express';
import { ExchangeController } from '../controllers/ExchangeController';
import { authMiddleware } from '../middlewares/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Exchanges
 *   description: Gestión de propuestas de intercambio (HU-09, HU-10)
 * 
 * components:
 *   schemas:
 *     ExchangeOffer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID de la oferta
 *           example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *         offeredPublicationId:
 *           type: string
 *           description: ID de la planta que se ofrece
 *           example: "pub_123"
 *         targetPublicationId:
 *           type: string
 *           description: ID de la planta que se quiere recibir
 *           example: "pub_456"
 *         fromUserId:
 *           type: string
 *           description: ID del usuario que propone el intercambio
 *           example: "usr_789"
 *         toUserId:
 *           type: string
 *           description: ID del dueño de la planta objetivo
 *           example: "usr_101"
 *         status:
 *           type: string
 *           enum: [Pendiente, Aceptada, Rechazada]
 *           example: "Pendiente"
 */
export function createExchangeRoutes(exchangeController: ExchangeController): Router {
  const router = Router();
  
  /**
   * @swagger
   * /exchanges/propose:
   *   post:
   *     summary: Propone un nuevo intercambio (HU-09)
   *     tags: [Exchanges]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - offeredPublicationId
   *               - targetPublicationId
   *               - fromUserId
   *             properties:
   *               offeredPublicationId:
   *                 type: string
   *               targetPublicationId:
   *                 type: string
   *               fromUserId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Propuesta creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ExchangeOffer'
   *       400:
   *         description: Error de validación
   *       401:
   *         description: No autorizado
   */
  router.post('/propose', authMiddleware, exchangeController.propose);

  /**
   * @swagger
   * /exchanges/{id}/accept:
   *   put:
   *     summary: Acepta una propuesta de intercambio (HU-10)
   *     tags: [Exchanges]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de la oferta de intercambio
   *     responses:
   *       200:
   *         description: Propuesta aceptada exitosamente
   *       400:
   *         description: La propuesta no existe
   *       401:
   *         description: No autorizado
   */
  router.put('/:id/accept', authMiddleware, exchangeController.accept);

  /**
   * @swagger
   * /exchanges/{id}/reject:
   *   put:
   *     summary: Rechaza una propuesta de intercambio (HU-10)
   *     tags: [Exchanges]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de la oferta de intercambio
   *     responses:
   *       200:
   *         description: Propuesta rechazada exitosamente
   *       400:
   *         description: La propuesta no existe
   *       401:
   *         description: No autorizado
   */
  router.put('/:id/reject', authMiddleware, exchangeController.reject);
  
  return router;
}