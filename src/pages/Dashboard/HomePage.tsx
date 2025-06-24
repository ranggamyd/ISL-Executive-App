import API from "@/lib/api";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Salary from "../Recruitment/Salary/Salary";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Candidate from "../Recruitment/Candidate/Candidate";
import { DailyQuote as DailyQuoteType } from "@/types/dailyQuote";
import { CardSkeleton, StatSkeleton } from "@/components/Common/Skeleton";
import { AnimatedNumber, AnimatedCurrency } from "@/components/Common/AnimatedCounter";
import { BarChart3, Filter, ChevronDown, UserPlus, Users, FileText, Coins, Wallet, DoorOpen, MapPin, DollarSign, FileBarChart2, ShoppingCart } from "lucide-react";

const HomePage: React.FC = () => {
    const { t } = useLanguage();

    const { user } = useAuth();

    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [dailyQuotes, setDailyQuotes] = useState<DailyQuoteType[]>([]);
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [selectedSales, setSelectedSales] = useState<string>("");
    const [selectedSupervisor, setSelectedSupervisor] = useState<string>("");
    const [selectedManager, setSelectedManager] = useState<string>("");

    const [perMenuCount, setPerMenuCount] = useState({
        dailyQuotesCount: 0,
        pointOfSalesCount: 0,
        salesInReportsCount: 0,
        employeesCount: 0,
        accessDoorCount: 0,
        gpsViewCount: 0,
    });

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 11) return t("greeting_morning");
        if (hour >= 11 && hour < 15) return t("greeting_afternoon");
        if (hour >= 15 && hour < 18) return t("greeting_evening");
        return t("greeting_night");
    };

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

    const uniqueSales = [...new Set(dailyQuotes.map(item => item.sales_name))];
    const uniqueSupervisors = [...new Set(dailyQuotes.map(item => item.supervisor.nama_lengkap))];
    const uniqueManagers = [...new Set(dailyQuotes.map(item => item.manager.nama_lengkap))];

    const filteredQuotes = dailyQuotes.filter(item => {
        return (!selectedSales || item.sales_name === selectedSales) && (!selectedSupervisor || item.supervisor.nama_lengkap === selectedSupervisor) && (!selectedManager || item.manager.nama_lengkap === selectedManager);
    });

    const clearFilters = (): void => {
        setSelectedSales("");
        setSelectedSupervisor("");
        setSelectedManager("");
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

    useEffect(() => {
        setLoading(true);

        (async () => {
            try {
                const { data } = await API.get("dashboard/perMenuCount", { params: { date } });

                setPerMenuCount(data);
            } catch (err: any) {
                swal("error", err.response.data.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const quickActions = [
        { id: "dailyQuotes", title: t("dailyQuotes"), icon: FileBarChart2, count: perMenuCount.dailyQuotesCount, onClick: () => navigate("/sales", { state: { activeTab: "dailyQuotes" } }) },
        { id: "pointOfSales", title: t("pointOfSales"), icon: ShoppingCart, count: perMenuCount.pointOfSalesCount, onClick: () => navigate("/sales", { state: { activeTab: "pointOfSales" } }) },
        { id: "salesInReports", title: t("salesInReports"), icon: BarChart3, count: perMenuCount.salesInReportsCount, onClick: () => navigate("/sales", { state: { activeTab: "salesInReports" } }) },
        { id: "employees", title: t("employees"), icon: Users, count: perMenuCount.employeesCount, onClick: () => navigate("/employee", { state: { activeTab: "employees" } }) },
        { id: "accessDoor", title: t("accessDoor"), icon: DoorOpen, count: perMenuCount.accessDoorCount, onClick: () => navigate("/employee", { state: { activeTab: "accessDoors" } }) },
        { id: "gpsView", title: t("gpsView"), icon: MapPin, count: perMenuCount.gpsViewCount, onClick: () => navigate("/employee", { state: { activeTab: "gpsView" } }) },
    ];

    const [activeTab, setActiveTab] = useState<"candidates" | "salaries">("candidates");

    const tabs = [
        {
            id: "candidates" as const,
            label: t("candidates"),
            icon: Users,
        },
        {
            id: "salaries" as const,
            label: t("salaries"),
            icon: DollarSign,
        },
    ];

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-1">
                            {getGreeting()}, {user?.name}!
                        </h2>
                        <p className="text-blue-100">{t("welcomeMessage")}</p>
                    </div>
                    <div className="hidden sm:block">
                        <img src="img/undraw_alien-science_0aba.svg" alt="Dashboard" className="w-24 h-18 rounded-xl" />
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-3 -mt-2">{t("dailyQuotes")}</h2>

                <div className="flex items-center justify-center space-x-3">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="relative">
                        <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                            <Filter size={18} className="text-gray-600" />
                            <ChevronDown size={16} className={`text-gray-600 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
                        </button>

                        {filterOpen && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-64 z-10">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">{t("sales")}</label>
                                        <select value={selectedSales} onChange={e => setSelectedSales(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allSales")}</option>
                                            {uniqueSales.map(sales => (
                                                <option key={sales} value={sales}>
                                                    {sales}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">{t("supervisor")}</label>
                                        <select value={selectedSupervisor} onChange={e => setSelectedSupervisor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allSupervisors")}</option>
                                            {uniqueSupervisors.map(supervisor => (
                                                <option key={supervisor} value={supervisor}>
                                                    {supervisor}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">{t("manager")}</label>
                                        <select value={selectedManager} onChange={e => setSelectedManager(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allManagers")}</option>
                                            {uniqueManagers.map(manager => (
                                                <option key={manager} value={manager}>
                                                    {manager}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 hover:underline me-1">
                                            {t("clearAll")}
                                        </button>
                                    </div>
                                </div>
                            </div>
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("quickActions")}</h3>
                {loading ? (
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {quickActions.map(action => {
                            const Icon = action.icon;
                            return (
                                <motion.button key={action.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={action.onClick} className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left transition-colors duration-200 border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <Icon size={20} className="text-blue-600" />
                                        {action.count > 0 && <span className="flex items-center justify-center font-medium bg-red-500 text-white text-[9px] w-5 h-5 rounded-full">{action.count}</span>}
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{action.title}</p>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 mb-6">
                <div className="flex space-x-2">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}>
                                <Icon size={18} />
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                {activeTab === "candidates" && <Candidate />}
                {activeTab === "salaries" && <Salary />}
            </motion.div>
        </div>
    );
};

export default HomePage;
