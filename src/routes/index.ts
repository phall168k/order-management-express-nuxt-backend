import { Router } from 'express';
import loginRoutes from '../modules/auth/login/login.route';
import permissionRoutes from '../modules/admin/system/permissoin/permission.route';
import roleRoutes from '../modules/admin/system/role/role.route';
import userRoutes from '../modules/admin/system/user/user.route';
import minioRoutes from '../minio/minio.route';
import categoryRoutes from '../modules/admin/master-data/category/category.route';

const router = Router();

router.use('/auth/login', loginRoutes);
router.use('/permissions', permissionRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/minio', minioRoutes);
router.use('/master-data/categories', categoryRoutes);

export default router;
