import { dashboardRepository } from "./dashboard.repository";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export const dashboardService = {
    async getDashboard(year = new Date().getUTCFullYear()) {
        const [summary, monthlySales, recentOrders] = await Promise.all([
            dashboardRepository.getSummary(),
            dashboardRepository.getMonthlySales(year),
            dashboardRepository.getRecentOrders(10),
        ]);
        const salesByMonth = new Map(monthlySales.map((item) => [item.month, item]));

        return {
            summary,
            salesReport: monthNames.map((month, index) => {
                const sale = salesByMonth.get(index + 1);

                return {
                    month: index + 1,
                    label: month,
                    income: sale?.income ?? 0,
                    orders: sale?.orders ?? 0,
                };
            }),
            recentOrders: recentOrders.map((order) => ({
                ...order,
                totalAmount: order.items.reduce(
                    (total, item) => total + (item.quantity * (item.unitPrice - item.discount)),
                    0,
                ),
                totalItems: order.items.reduce((total, item) => total + item.quantity, 0),
            })),
        };
    },
};
