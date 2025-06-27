import API from "@/lib/api";
import swal from "@/utils/swal";
import SalesChart from "./SalesChart";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PointOfSales as PointOfSalesType } from "@/types/pointOfSales";
import { CardSkeleton, StatSkeleton } from "@/components/Common/Skeleton";
import { AnimatedCurrency, AnimatedNumber } from "@/components/Common/AnimatedCounter";
import { BarChart3, Wallet, Activity, CalendarCheck, PackageCheck, BarChart2 } from "lucide-react";

const PointOfSales: React.FC = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState<boolean>(true);
    const [pointOfSales, setPointOfSales] = useState<PointOfSalesType>({
        dataOrder: 0,
        ordertoday: 0,
        point_of_sales: [],
    });

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data } = await API.get("sales/pointOfSales");

                const bulanRaw = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
                const bulan = bulanRaw.map(b => t(b));

                const dataWithLabel = {
                    ...data,
                    point_of_sales: data.point_of_sales.map((item: { periode_kontrak: string; total_penjualan: number }) => ({
                        ...item,
                        label: bulan[parseInt(item.periode_kontrak.split("-")[1], 10) - 1],
                    })),
                };

                setPointOfSales(dataWithLabel);
            } catch (err: any) {
                swal("error", err.response.data.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const salesStats = [
        {
            title: t("ordersThisYear"),
            value: pointOfSales.dataOrder,
            icon: PackageCheck,
            color: "from-blue-500 to-blue-600",
            type: "number",
        },
        {
            title: t("ordersToday"),
            value: pointOfSales.ordertoday,
            icon: CalendarCheck,
            color: "from-green-500 to-green-600",
            type: "currency",
        },
        {
            title: t("salesThisMonth"),
            value: pointOfSales.point_of_sales.find(item => item.periode_kontrak === new Date().toISOString().slice(0, 7))?.total_penjualan ?? 0,
            icon: BarChart2,
            color: "from-orange-500 to-orange-600",
            type: "currency",
        },
        {
            title: t("salesThisYear"),
            value: pointOfSales.point_of_sales.reduce((acc, item) => acc + item.total_penjualan, 0),
            icon: Wallet,
            color: "from-purple-500 to-purple-600",
            type: "currency",
        },
    ];

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-1">{t("pointOfSales")}</h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => <StatSkeleton key={index} />)
                    : salesStats.map((stat, index) => {
                          const Icon = stat.icon;
                          return (
                              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}>
                                  <div className="flex flex-col items-center justify-between">
                                      <Icon size={20} className="text-white" />
                                      <div className="text-center mt-2">
                                          <p className="text-xs sm:text-sm opacity-90 whitespace-nowrap">{stat.title}</p>
                                          <p className="text-xs sm:text-lg font-bold">{stat.type === "currency" ? <AnimatedCurrency value={stat.value} duration={200 + index * 200} /> : <AnimatedNumber value={stat.value} duration={1500 + index * 200} />}</p>
                                      </div>
                                  </div>
                              </motion.div>
                          );
                      })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <BarChart3 size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-gray-600 dark:text-gray-300">{t("sellingPerformanceThisYear")}</p>
                        </div>
                    </div>
                    <Activity size={20} className="text-gray-400 dark:text-gray-500" />
                </div>

                {loading ? <CardSkeleton /> : <SalesChart data={pointOfSales.point_of_sales} type="bar" dataKey="total_penjualan" color="#10B981" height={300} />}
            </motion.div>
        </div>
    );
};

export default PointOfSales;
