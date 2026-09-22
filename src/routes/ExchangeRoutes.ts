import { Router } from 'express';
import { ExchangeController } from '../controllers/ExchangeController';

/**
 * @swagger
 * tags:
 *   name: Exchanges
 *   description: Gestión de ofertas y procesos de intercambio de plantas
 * 
 * components:
 *   schemas:
 *     ExchangeOffer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la oferta
 *           example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *         targetPublicationId:
 *           type: string
 *           description: ID de la publicación que se quiere obtener
 *           example: "pub_123"
 *         offeredPublicationId:
 *           type: string
 *           description: ID de la publicación que se ofrece a cambio
 *           example: "pub_456"
 *         fromUserId:
 *           type: string
 *           description: ID del usuario que propone el intercambio
 *           example: "usr_789"
 *         toUserId:
 *           type: string
 *           description: ID del dueño de la publicación destino
 *           example: "usr_101"
 *         status:
 *           type: string
 *           enum: [Pendiente, Aceptada, Rechazada]
 *           description: Estado actual de la propuesta
 *           example: "Pendiente"
 */
export function createExchangeRoutes(exchangeController: ExchangeController): Router {
  const router = Router();
  
  /**
   * @swagger
   * /exchanges:
   *   post:
   *     summary: Propone un nuevo intercambio entre dos publicaciones (HU-09)
   *     tags: [Exchanges]
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
   *                 description: ID de tu publicación a entregar
   *                 example: "pub_456"
   *               targetPublicationId:
   *                 type: string
   *                 description: ID de la publicación que querés recibir
   *                 example: "pub_123"
   *               fromUserId:
   *                 type: string
   *                 description: ID de tu usuario
   *                 example: "usr_789"
   *     responses:
   *       201:
   *         description: Propuesta de intercambio creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ExchangeOffer'
   *       400:
   *         description: Error de validación (ej. la publicación destino no existe o intentás intercambiar con vos mismo)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "No podés proponer un intercambio sobre tu propia publicación"
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/', exchangeController.propose);

  /**
   * @swagger
   * /exchanges/{id}/accept:
   *   post:
   *     summary: Acepta una propuesta de intercambio (HU-10)
   *     description: Cambia el estado de la oferta a 'Aceptada' y reserva ambas publicaciones.
   *     tags: [Exchanges]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de la propuesta de intercambio
   *         example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
   *     responses:
   *       200:
   *         description: Propuesta aceptada y publicaciones reservadas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ExchangeOffer'
   *       400:
   *         description: La propuesta no existe
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:id/accept', exchangeController.accept);

  /**
   * @swagger
   * /exchanges/{id}/reject:
   *   post:
   *     summary: Rechaza una propuesta de intercambio (HU-10)
   *     description: Cambia el estado de la oferta a 'Rechazada' y notifica al creador.
   *     tags: [Exchanges]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de la propuesta de intercambio
   *         example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
   *     responses:
   *       200:
   *         description: Propuesta rechazada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ExchangeOffer'
   *       400:
   *         description: La propuesta no existe
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:id/reject', exchangeController.reject);
  
  return router;
}