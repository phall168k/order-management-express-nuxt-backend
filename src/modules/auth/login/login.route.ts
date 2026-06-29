import { Router } from "express";
import { loginController } from "./login.controller";
import { validateLogin } from "./login.validition";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with username or email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successfully
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/LoginUserResponse'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Invalid username/email or password
 *       403:
 *         description: User is inactive
 */
router.post("/", validateLogin, loginController.login);

export default router;
