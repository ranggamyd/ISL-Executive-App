import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { StatSkeleton, CardSkeleton } from "@/components/Common/Skeleton";
import { LucideIcon, TrendingUp, Users, ClipboardCheck, DollarSign, ArrowUp, ArrowDown, Calendar, MapPin, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface StatCard {
    title: string;
    value: string;
    change: string;
    changeType: "increase" | "decrease";
    icon: LucideIcon;
    color: string;
}

const HomePage: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const stats: StatCard[] = [
        {
            title: t("salesSummary"),
            value: "Rp 45.5M",
            change: "+12.5%",
            changeType: "increase",
            icon: TrendingUp,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: t("allEmployees"),
            value: "247",
            change: "+3",
            changeType: "increase",
            icon: Users,
            color: "from-green-500 to-green-600",
        },
        {
            title: t("pending"),
            value: "12",
            change: "-2",
            changeType: "decrease",
            icon: ClipboardCheck,
            color: "from-orange-500 to-orange-600",
        },
        {
            title: "Monthly Revenue",
            value: "Rp 128M",
            change: "+8.2%",
            changeType: "increase",
            icon: DollarSign,
            color: "from-purple-500 to-purple-600",
        },
    ];

    const quickActions = [
        { id: "candidate", title: t("candidateRecruitment"), icon: Users, count: 5 },
        { id: "salary", title: t("salaryRecruitment"), icon: DollarSign, count: 3 },
        { id: "sales", title: t("salesReport"), icon: TrendingUp, count: 12 },
        { id: "access", title: t("accessDoor"), icon: MapPin, count: 2 },
    ];

    const recentActivities = [
        {
            id: 1,
            type: "recruitment",
            title: "New candidate approved",
            description: "Maya Sari - Lab Analyst position",
            time: "2 hours ago",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b6d5?w=40&h=40&fit=crop&crop=face",
        },
        {
            id: 2,
            type: "sales",
            title: "Large order completed",
            description: "PT Pharmaceutical ABC - Rp 15M",
            time: "4 hours ago",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        },
        {
            id: 3,
            type: "employee",
            title: "New employee onboarded",
            description: "Rizki Ramadhan joined Research team",
            time: "1 day ago",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            {t("welcome")}, {user?.name}!
                        </h2>
                        <p className="text-blue-100">Here's your company overview for today</p>
                    </div>
                    <div className="hidden sm:block">
                        <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop" alt="Dashboard" className="w-24 h-18 rounded-xl opacity-80" />
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => <StatSkeleton key={index} />)
                    : stats.map((stat, index) => {
                          const Icon = stat.icon;
                          return (
                              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}>
                                  <div className="flex items-center justify-between mb-3">
                                      <Icon size={24} />
                                      <div className={`flex items-center space-x-1 text-sm ${stat.changeType === "increase" ? "text-green-100" : "text-red-100"}`}>
                                          {stat.changeType === "increase" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                          <span>{stat.change}</span>
                                      </div>
                                  </div>
                                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                                  <p className="text-sm opacity-90">{stat.title}</p>
                              </motion.div>
                          );
                      })}
            </div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("quickActions")}</h3>
                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map(action => {
                            const Icon = action.icon;
                            return (
                                <motion.button key={action.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left transition-colors duration-200 border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <Icon size={20} className="text-blue-600" />
                                        {action.count > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{action.count}</span>}
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Recent Activities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{t("recentActivities")}</h3>
                    <Bell size={20} className="text-gray-400" />
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + index * 0.1 }} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <img src={activity.avatar} alt="" className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                    <p className="text-xs text-gray-600">{activity.description}</p>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center space-x-1">
                                    <Calendar size={12} />
                                    <span>{activity.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default HomePage;
