import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../common/middlewares/permission.middleware";
import { dashboardController } from "./dashboard.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard summary, monthly sales report, and recent orders
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Dashboard fetched successfully
 *       400:
 *         description: Invalid year
 */
router.get("/", permissionMiddleware("dashboard.read"), dashboardController.getDashboard);

export default router;
