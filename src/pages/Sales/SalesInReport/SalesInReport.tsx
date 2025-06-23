import API from "@/lib/api";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CardSkeleton, StatSkeleton } from "@/components/Common/Skeleton";
import { SalesInReport as SalesInReportType } from "@/types/salesInReport";
import { AnimatedCurrency, AnimatedNumber } from "@/components/Common/AnimatedCounter";
import { BarChart3, Wallet, Activity, CalendarCheck, PackageCheck, BarChart2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SalesInReport: React.FC = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState<boolean>(true);
    const [reports, setReports] = useState<SalesInReportType>({
        dataOrder: 0,
        data: [],
    });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data } = await API.get("sales/salesInReports");

                const bulanRaw = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
                const bulan = bulanRaw.map(b => t(b));

                const grouped: Record<string, { label: string; done: number; other: number }> = {};

                data.data.forEach((item: { tanggal_masuk: string; nominal: number; status: string }) => {
                    const [year, month] = item.tanggal_masuk.split("-");
                    const key = `${year}-${month}`;
                    const label = bulan[parseInt(month, 10) - 1];

                    if (!grouped[key]) {
                        grouped[key] = { label, done: 0, other: 0 };
                    }

                    if (item.status === "Done") {
                        grouped[key].done += item.nominal;
                    } else {
                        grouped[key].other += item.nominal;
                    }
                });

                const processedData = {
                    ...data,
                    data: data.data,
                };

                setReports(processedData);
                setChartData(Object.values(grouped));
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
            value: reports.dataOrder,
            icon: PackageCheck,
            color: "from-blue-500 to-blue-600",
            type: "number",
        },
        {
            title: t("todaysIncome"),
            value: reports.data.find(item => item.tanggal_masuk === new Date().toISOString().split("T")[0])?.nominal ?? 0,
            icon: CalendarCheck,
            color: "from-green-500 to-green-600",
            type: "currency",
        },
        {
            title: t("thisMonthsIncome"),
            value: reports.data.find(item => item.tanggal_masuk === new Date().toISOString().slice(0, 7))?.nominal ?? 0,
            icon: BarChart2,
            color: "from-orange-500 to-orange-600",
            type: "currency",
        },
        {
            title: t("thisYearsIncome"),
            value: reports.data.reduce((acc, item) => acc + item.nominal, 0),
            icon: Wallet,
            color: "from-purple-500 to-purple-600",
            type: "currency",
        },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const done = payload.find((p: any) => p.dataKey === "done")?.value ?? 0;
            const other = payload.find((p: any) => p.dataKey === "other")?.value ?? 0;
            const total = done + other;

            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-left space-y-1">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-sm text-gray-700">
                        🟢 {t("completed")}: <span className="font-medium">{formatCurrency(done)}</span>
                    </p>
                    <p className="text-sm text-gray-700">
                        🟡 {t("inProgress")}: <span className="font-medium">{formatCurrency(other)}</span>
                    </p>
                    <hr className="my-1 border-gray-200" />
                    <p className="text-sm text-gray-900">
                        💰 {t("totalIncome")}: <span className="font-bold">{formatCurrency(total)}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 text-center">{t("salesInReports")}</h2>
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <BarChart3 size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-gray-600">{t("sellingPerformanceThisYear")}</p>
                        </div>
                    </div>
                    <Activity size={20} className="text-gray-400" />
                </div>

                {loading ? (
                    <CardSkeleton />
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ left: -17 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="label" stroke="#6B7280" fontSize={10} tickLine={false} interval={0} />
                            <YAxis stroke="#6B7280" fontSize={10} tickLine={false} tickFormatter={value => value / 1000000 + " " + t("million")} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="done" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="other" fill="#FACC15" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </motion.div>
        </div>
    );
};

export default SalesInReport;
