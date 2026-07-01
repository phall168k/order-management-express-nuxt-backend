import { Router } from "express";
import { authMiddleware } from "../../../../common/middlewares/auth.middleware";
import { permissionMiddleware } from "../../../../common/middlewares/permission.middleware";
import { userProfileController } from "./user-profile.controller";
import {
    validateCreateUserProfile,
    validateUpdateUserProfile,
} from "./user-profile.validition";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /system/user-profiles:
 *   get:
 *     summary: Get user profiles with pagination
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profiles fetched successfully
 *   post:
 *     summary: Create a user profile
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserProfileRequest'
 *     responses:
 *       201:
 *         description: User profile created successfully
 */
router
    .route("/")
    .get(permissionMiddleware("user-profile.read"), userProfileController.findAll)
    .post(permissionMiddleware("user-profile.create"), validateCreateUserProfile, userProfileController.create);

/**
 * @swagger
 * /system/user-profiles/select-options:
 *   get:
 *     summary: Get user profile select options
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [all, unmapped]
 *           default: all
 *         description: Use unmapped to get user profiles that are not assigned to any user.
 *     responses:
 *       200:
 *         description: User profile select options fetched successfully
 */
router.get(
    "/select-options",
    userProfileController.findSelectOptions,
);

/**
 * @swagger
 * /system/user-profiles/{id}:
 *   get:
 *     summary: Get a user profile by id
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       404:
 *         description: User profile not found
 *   put:
 *     summary: Update a user profile
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserProfileRequest'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *   delete:
 *     summary: Delete a user profile
 *     tags: [User Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 */
router
    .route("/:id")
    .get(permissionMiddleware("user-profile.read"), userProfileController.findById)
    .put(permissionMiddleware("user-profile.update"), validateUpdateUserProfile, userProfileController.update)
    .delete(permissionMiddleware("user-profile.delete"), userProfileController.delete);

export default router;
