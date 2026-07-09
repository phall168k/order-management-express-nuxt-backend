import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { accountController } from "./account.controller";
import {
    validateChangePassword,
    validateUpdateAccount,
} from "./account.validition";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change current user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: old-password
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: new-password
 *               confirmPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: new-password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request body or current password
 *       401:
 *         description: Unauthorized
 */
router.post("/change-password", validateChangePassword, accountController.changePassword);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update current user and user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: john_doe
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: john@example.com
 *               userProfile:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *                     example: male
 *                   dob:
 *                     type: string
 *                     format: date
 *                     example: 1995-01-01
 *                   phoneNumber:
 *                     type: string
 *                     example: "012345678"
 *                   address:
 *                     type: string
 *                     example: Phnom Penh
 *                   note:
 *                     type: string
 *                     example: Customer note
 *                   profile:
 *                     type: object
 *                     properties:
 *                       bucket:
 *                         type: string
 *                         example: order-management
 *                       objectName:
 *                         type: string
 *                         example: profiles/avatar.jpg
 *                       originalName:
 *                         type: string
 *                         example: avatar.jpg
 *                       mimeType:
 *                         type: string
 *                         example: image/jpeg
 *                       size:
 *                         type: integer
 *                         example: 12345
 *                       etag:
 *                         type: string
 *                         example: abc
 *                       url:
 *                         type: string
 *                         example: http://localhost:9000/order-management/profiles/avatar.jpg
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Username or email already exists
 */
router.put("/profile", validateUpdateAccount, accountController.updateAccount);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", accountController.logout);

export default router;
