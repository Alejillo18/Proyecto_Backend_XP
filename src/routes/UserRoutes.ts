import { Router } from 'express';
import { UserController } from '../controllers/UserController';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios y autenticación (HU-05, HU-06, HU-14)
 * 
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *           example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *         email:
 *           type: string
 *           description: Email del usuario
 *           example: "alejo@email.com"
 *         barrio:
 *           type: string
 *           description: Barrio del usuario
 *           example: "Centro"
 */
export function createUserRoutes(userController: UserController): Router {
  const router = Router();
  
  /**
   * @swagger
   * /users/register:
   *   post:
   *     summary: Registra un nuevo usuario (HU-05)
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - barrio
   *             properties:
   *               email:
   *                 type: string
   *                 example: "alejo@email.com"
   *               password:
   *                 type: string
   *                 description: Mínimo 8 caracteres
   *                 example: "secreta123"
   *               barrio:
   *                 type: string
   *                 example: "Centro"
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       400:
   *         description: Error de validación (ej. la contraseña tiene menos de 8 caracteres)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "La contraseña debe tener al menos 8 caracteres"
   *       409:
   *         description: Conflicto, el email ya está registrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "El email ya está registrado"
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/register', userController.register);

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Inicia sesión (HU-06)
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: "alejo@email.com"
   *               password:
   *                 type: string
   *                 example: "secreta123"
   *     responses:
   *       200:
   *         description: Login exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
   *                 email:
   *                   type: string
   *                   example: "alejo@email.com"
   *       401:
   *         description: Credenciales incorrectas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Email o contraseña incorrectos"
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/login', userController.login);
  
  return router;
}