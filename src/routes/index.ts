import { Router } from 'express';
import loginRoutes from '../modules/auth/login/login.route';
import permissionRoutes from '../modules/admin/system/permissoin/permission.route';
import roleRoutes from '../modules/admin/system/role/role.route';
import userRoutes from '../modules/admin/system/user/user.route';
import userProfileRoutes from '../modules/admin/system/user-profile/user-profile.route';
import paymentMethodRoutes from '../modules/admin/system/payment-method/payment-method.route';
import minioRoutes from '../minio/minio.route';
import categoryRoutes from '../modules/admin/master-data/category/category.route';
import productRoutes from '../modules/admin/master-data/product/product.route';
import stockRoutes from '../modules/admin/inventory/stock/stock.route';
import stockInRoutes from '../modules/admin/inventory/stock-in/stock-in.route';
import stockAdjustmentRoutes from '../modules/admin/inventory/stock-adjustment/stock-adjustment.route';
import saleRoutes from '../modules/admin/saling/sale/sale.route';

const router = Router();

router.use('/auth/login', loginRoutes);
router.use('/system/permissions', permissionRoutes);
router.use('/system/roles', roleRoutes);
router.use('/system/users', userRoutes);
router.use('/system/user-profiles', userProfileRoutes);
router.use('/system/payment-methods', paymentMethodRoutes);
router.use('/minio', minioRoutes);
router.use('/master-data/categories', categoryRoutes);
router.use('/master-data/products', productRoutes);
router.use('/inventory/stocks', stockRoutes);
router.use('/inventory/stock-ins', stockInRoutes);
router.use('/inventory/stock-adjustments', stockAdjustmentRoutes);
router.use('/saling/sales', saleRoutes);

export default router;
