import { Router } from "express";
import { registerController } from "./register.controller";
import { validateRegister } from "./register.validition";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a customer account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Register successfully
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
 *                   example: Register successfully
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/RegisterUserResponse'
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: Username or email already exists
 */
router.post("/", validateRegister, registerController.register);

export default router;
