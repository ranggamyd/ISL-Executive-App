import API from "@/lib/api";
import swal from "@/utils/swal";
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { DailyQuote as DailyQuoteType } from "@/types/dailyQuote";
import { ListSkeleton, StatSkeleton } from "@/components/Common/Skeleton";
import { AnimatedNumber, AnimatedCurrency } from "@/components/Common/AnimatedCounter";
import { BarChart3, Filter, Search, ChevronDown, UserPlus, Users, FileText, Coins, Wallet } from "lucide-react";
import FilterButton from "@/components/Common/FilterButton";
import DateInput from "@/components/Common/DateInput";

const DailyQuotes: React.FC = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState<boolean>(true);
    const [dailyQuotes, setDailyQuotes] = useState<DailyQuoteType[]>([]);
    const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const filterRef = useRef<HTMLDivElement | null>(null);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [selectedSales, setSelectedSales] = useState<string>("");
    const [selectedSupervisor, setSelectedSupervisor] = useState<string>("");
    const [selectedManager, setSelectedManager] = useState<string>("");

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data } = await API.get("sales/dailyQuotes", { params: { date } });

                setDailyQuotes(data.recap_quotations);
            } catch (err: any) {
                swal("error", err.response.data.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [date]);

    const uniqueSales = [...new Set(dailyQuotes.map((item) => item.sales_name))];
    const uniqueSupervisors = [...new Set(dailyQuotes.map((item) => item.supervisor.nama_lengkap))];
    const uniqueManagers = [...new Set(dailyQuotes.map((item) => item.manager.nama_lengkap))];

    const filteredQuotes = dailyQuotes.filter((item) => {
        return (!selectedSales || item.sales_name === selectedSales) && (!selectedSupervisor || item.supervisor.nama_lengkap === selectedSupervisor) && (!selectedManager || item.manager.nama_lengkap === selectedManager);
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const clearFilters = (): void => {
        setSelectedSales("");
        setSelectedSupervisor("");
        setSelectedManager("");
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const toggleItem = (index: number) => {
        setOpenItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const salesStats = [
        {
            title: t("newCustomers"),
            value: filteredQuotes.reduce((acc, recap) => acc + parseInt(recap.pelanggan_baru?.toString()) || 0, 0),
            icon: UserPlus,
            color: "from-blue-500 to-blue-600",
            type: "number",
        },
        {
            title: t("existingCustomers"),
            value: filteredQuotes.reduce((acc, recap) => acc + parseInt(recap.pelanggan_lama?.toString()) || 0, 0),
            icon: Users,
            color: "from-green-500 to-green-600",
            type: "number",
        },
        {
            title: t("totalQuotations"),
            value: filteredQuotes.reduce((acc, recap) => acc + parseInt(recap.total_request_quotation?.toString()) || 0, 0),
            icon: FileText,
            color: "from-orange-500 to-orange-600",
            type: "number",
        },
        {
            title: t("newAmount"),
            value: filteredQuotes.reduce((acc, recap) => acc + parseInt(recap.total_biaya_pelanggan_baru?.toString()) || 0, 0),
            icon: Coins,
            color: "from-purple-500 to-purple-600",
            type: "currency",
        },
        {
            title: t("existingAmount"),
            value: filteredQuotes.reduce((acc, recap) => acc + parseInt(recap.total_biaya_pelanggan_lama?.toString()) || 0, 0),
            icon: Wallet,
            color: "from-teal-500 to-teal-600",
            type: "currency",
        },
        {
            title: t("grandTotal"),
            value: filteredQuotes.reduce((acc, recap) => acc + parseInt(recap.total_biaya_akhir?.toString()) || 0, 0),
            icon: BarChart3,
            color: "from-amber-500 to-amber-600",
            type: "currency",
        },
    ];

    return (
        <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-3 -mt-2">{t("recapDailyQuotes")}</h2>
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <DateInput date={date} setDate={setDate} />
                    </div>
                    <div className="relative" ref={filterRef}>
                        <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />

                        {filterOpen && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                                <div className="p-4 space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("sales")}</label>
                                        <select value={selectedSales} onChange={(e) => setSelectedSales(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allSales")}</option>
                                            {uniqueSales.map((sales) => (
                                                <option key={sales} value={sales}>
                                                    {sales}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("supervisor")}</label>
                                        <select value={selectedSupervisor} onChange={(e) => setSelectedSupervisor(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allSupervisors")}</option>
                                            {uniqueSupervisors.map((supervisor) => (
                                                <option key={supervisor} value={supervisor}>
                                                    {supervisor}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("manager")}</label>
                                        <select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allManagers")}</option>
                                            {uniqueManagers.map((manager) => (
                                                <option key={manager} value={manager}>
                                                    {manager}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:underline me-1">
                                            {t("clearAll")}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
                {loading
                    ? Array.from({ length: 6 }).map((_, index) => <StatSkeleton key={index} />)
                    : salesStats.map((stat, index) => {
                          const Icon = stat.icon;
                          return (
                              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}>
                                  <div className="flex flex-col items-center justify-between">
                                      <Icon size={20} className="text-white" />
                                      <div className="text-center mt-2">
                                          <p className="text-xs sm:text-sm opacity-90 whitespace-nowrap">{stat.title}</p>
                                          <p className="text-xs sm:text-xl text-center font-bold">{stat.type === "currency" ? <AnimatedCurrency value={stat.value} duration={200 + index * 200} /> : <AnimatedNumber value={stat.value} duration={1500 + index * 200} />}</p>
                                      </div>
                                  </div>
                              </motion.div>
                          );
                      })}
            </div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-3 -mt-2">{t("salesList")}</h2>
            </motion.div>

            {loading ? (
                <ListSkeleton items={3} />
            ) : (
                <div className="grid gap-4">
                    {filteredQuotes.map((recap, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sm:flex sm:justify-between mb-4">
                            <div className="flex items-start justify-between mb-4 sm:mb-1">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold cursor-default">{recap.sales_name.charAt(0)}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white sm:mb-1 truncate">{recap.sales_name}</h3>
                                        <div className="space-y-0">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                                <small className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 w-20">{t("supervisor")}</small>
                                                <small className="truncate text-xs sm:text-sm text-gray-600 dark:text-gray-400">: {recap.supervisor.nama_lengkap !== recap.sales_name ? recap.supervisor.nama_lengkap : "-"}</small>
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                                <small className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 w-20">{t("manager")}</small>
                                                <small className="truncate text-xs sm:text-sm text-gray-600 dark:text-gray-400">: {recap.manager.nama_lengkap !== recap.sales_name ? recap.manager.nama_lengkap : "-"}</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:w-1/2">
                                <div onClick={() => toggleItem(index)} className="cursor-pointer bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 p-2 text-center rounded-xl border-b-0">
                                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                        {t("grandTotal")} ({recap.total_request_quotation} {t("quotes")})
                                    </p>
                                    <p className="font-bold text-orange-900 dark:text-orange-300 text-md">{formatCurrency(recap.total_biaya_akhir)}</p>
                                </div>

                                <AnimatePresence initial={false}>
                                    {openItems[index] && (
                                        <motion.div key={`collapse-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.1, ease: "easeInOut" }} className="overflow-hidden pt-2 pb-2 bg-white dark:bg-gray-800 border-t-0 border-orange-200 dark:border-orange-700 px-0">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-2 border border-blue-200 dark:border-blue-700 text-center">
                                                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{t("newCustomers")}</p>
                                                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                                                        ({recap.pelanggan_baru} {t("quotes")})
                                                    </p>
                                                    <p className="font-bold text-blue-900 dark:text-blue-200 text-sm mt-1">{formatCurrency(recap.total_biaya_pelanggan_baru)}</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-2 border border-green-200 dark:border-green-700 text-center">
                                                    <p className="text-xs font-semibold text-green-700 dark:text-green-300">{t("existingCustomers")}</p>
                                                    <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                                                        ({recap.pelanggan_lama} {t("quotes")})
                                                    </p>
                                                    <p className="font-bold text-green-900 dark:text-green-200 text-sm mt-1">{formatCurrency(recap.total_biaya_pelanggan_lama)}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}

                    {filteredQuotes.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p>{t("noDataFound")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DailyQuotes;