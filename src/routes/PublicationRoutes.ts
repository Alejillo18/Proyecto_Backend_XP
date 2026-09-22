import { Router } from 'express';
import { PublicationController } from '../controllers/PublicationController';
import { authMiddleware } from '../middlewares/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Publications
 *   description: Gestión de publicaciones de plantas (HU-01, HU-02, HU-03, HU-04)
 * 
 * components:
 *   schemas:
 *     Publication:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la publicación
 *           example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *         plantName:
 *           type: string
 *           description: Nombre de la planta
 *           example: "Monstera Deliciosa"
 *         photo:
 *           type: string
 *           description: URL de la foto
 *           example: "https://ejemplo.com/foto.jpg"
 *         barrio:
 *           type: string
 *           description: Barrio donde se encuentra la planta
 *           example: "Centro"
 *         ownerId:
 *           type: string
 *           description: ID del dueño de la publicación
 *           example: "usr_123"
 *         status:
 *           type: string
 *           enum: [Disponible, Reservado]
 *           description: Estado de la publicación
 *           example: "Disponible"
 */
export function createPublicationRoutes(publicationController: PublicationController): Router {
  const router = Router();
  
  /**
   * @swagger
   * /publications:
   *   post:
   *     summary: Publica una nueva planta (HU-01)
   *     tags: [Publications]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - plantName
   *               - ownerId
   *               - barrio
   *             properties:
   *               plantName:
   *                 type: string
   *                 description: Nombre de la planta a publicar
   *                 example: "Ficus"
   *               ownerId:
   *                 type: string
   *                 description: ID del usuario creador
   *                 example: "usr_123"
   *               barrio:
   *                 type: string
   *                 description: Barrio de la publicación
   *                 example: "Alta Córdoba"
   *               photo:
   *                 type: string
   *                 description: URL de la imagen de la planta (opcional)
   *                 example: "https://ejemplo.com/ficus.jpg"
   *     responses:
   *       201:
   *         description: Publicación creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Publication'
   *       400:
   *         description: Error de validación (ej. falta el nombre)
   *       401:
   *         description: No autorizado (Falta token o es inválido)
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/', authMiddleware, publicationController.publish);

  /**
   * @swagger
   * /publications/search:
   *   get:
   *     summary: Busca y filtra publicaciones de plantas (HU-03 / HU-04)
   *     tags: [Publications]
   *     parameters:
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *         required: false
   *         description: Texto a buscar en el nombre de la planta
   *       - in: query
   *         name: barrio
   *         schema:
   *           type: string
   *         required: false
   *         description: Filtrar publicaciones por barrio específico
   *     responses:
   *       200:
   *         description: Búsqueda exitosa
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "No se encontraron plantas"
   *                 results:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Publication'
   */
  router.get('/search', publicationController.search);

  /**
   * @swagger
   * /publications/{id}:
   *   delete:
   *     summary: Elimina una publicación propia (HU-02)
   *     tags: [Publications]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de la publicación a eliminar
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - requesterId
   *             properties:
   *               requesterId:
   *                 type: string
   *                 description: ID del usuario que solicita la eliminación (debe ser el dueño)
   *                 example: "usr_123"
   *     responses:
   *       204:
   *         description: Publicación eliminada exitosamente
   *       400:
   *         description: Error de validación (la publicación no existe o el requesterId no es el dueño)
   *       401:
   *         description: No autorizado (Falta token o es inválido)
   *       500:
   *         description: Error interno del servidor
   */
  router.delete('/:id', authMiddleware, publicationController.delete);
  
  return router;
}