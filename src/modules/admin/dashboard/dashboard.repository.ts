import { CategoryModel } from "../master-data/category/category.model";
import { ProductModel } from "../master-data/product/product.model";
import { SaleModel } from "../saling/sale/sale.model";
import { UserProfileModel } from "../system/user-profile/user-profile.model";
import { UserModel } from "../system/user/user.model";

const saleTotalExpression = {
    $sum: {
        $map: {
            input: "$items",
            as: "item",
            in: {
                $multiply: [
                    "$$item.quantity",
                    { $subtract: ["$$item.unitPrice", "$$item.discount"] },
                ],
            },
        },
    },
};

export const dashboardRepository = {
    async getSummary() {
        const [saleSummary, totalCustomer, totalUser, totalCategory, totalProduct] = await Promise.all([
            SaleModel.aggregate<{ totalIncome: number; totalPendingItem: number }>([
                {
                    $group: {
                        _id: null,
                        totalIncome: { $sum: saleTotalExpression },
                        totalPendingItem: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "pending"] },
                                    { $sum: "$items.quantity" },
                                    0,
                                ],
                            },
                        },
                    },
                },
                { $project: { _id: 0, totalIncome: 1, totalPendingItem: 1 } },
            ]),
            UserProfileModel.countDocuments({ userType: "customer" }),
            UserModel.countDocuments(),
            CategoryModel.countDocuments(),
            ProductModel.countDocuments(),
        ]);

        return {
            totalIncome: saleSummary[0]?.totalIncome ?? 0,
            totalPendingItem: saleSummary[0]?.totalPendingItem ?? 0,
            totalCustomer,
            totalUser,
            totalCategory,
            totalProduct,
        };
    },

    getMonthlySales(year: number) {
        const startDate = new Date(Date.UTC(year, 0, 1));
        const endDate = new Date(Date.UTC(year + 1, 0, 1));

        return SaleModel.aggregate<{ month: number; income: number; orders: number }>([
            { $match: { salingDate: { $gte: startDate, $lt: endDate } } },
            {
                $group: {
                    _id: { $month: { date: "$salingDate", timezone: "UTC" } },
                    income: { $sum: saleTotalExpression },
                    orders: { $sum: 1 },
                },
            },
            { $project: { _id: 0, month: "$_id", income: 1, orders: 1 } },
            { $sort: { month: 1 } },
        ]);
    },

    getRecentOrders(limit: number) {
        return SaleModel.find()
            .select("code customer salingDate status paymentMethod address items createdAt")
            .populate({
                path: "customer",
                select: "username email userProfile",
                populate: {
                    path: "userProfile",
                    select: "code firstName lastName phoneNumber profile",
                },
            })
            .populate({ path: "paymentMethod", select: "merchantName currency logo" })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    },
};
