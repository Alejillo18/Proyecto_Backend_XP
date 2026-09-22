import { Router } from 'express';
import { UserController } from '../controllers/UserController';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios y autenticación
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *           example: "usr_123"
 *         email:
 *           type: string
 *           description: Correo electrónico
 *           example: "juan@ejemplo.com"
 *         barrio:
 *           type: string
 *           description: Barrio de residencia
 *           example: "Alta Córdoba"
 */
export function createUserRoutes(userController: UserController): Router {
  const router = Router();
  
  /**
   * @swagger
   * /users/register:
   *   post:
   *     summary: Registra un nuevo usuario
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
   *                 example: "usuario@ejemplo.com"
   *               password:
   *                 type: string
   *                 description: Mínimo 8 caracteres
   *                 example: "secreta123"
   *               barrio:
   *                 type: string
   *                 example: "General Paz"
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Error de validación (ej. contraseña corta)
   *       409:
   *         description: Conflicto (email ya registrado)
   */
  router.post('/register', userController.register);

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Inicia sesión y obtiene un token JWT
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
   *                 example: "usuario@ejemplo.com"
   *               password:
   *                 type: string
   *                 example: "secreta123"
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: Token JWT para usar en rutas protegidas
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Email o contraseña incorrectos
   */
  router.post('/login', userController.login);
  
  return router;
}