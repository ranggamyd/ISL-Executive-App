import { motion } from "framer-motion";
import SalesIn from "./SalesIn/SalesIn";
import React, { useState } from "react";
import DailyQuote from "./DailyQuote/DailyQuote";
import PointOfSales from "./PointOfSales/PointOfSales";
import { useLanguage } from "@/contexts/LanguageContext";
import SalesInReport from "./SalesInReport/SalesInReport";
import { TrendingUp, ShoppingCart, BarChart3, FileBarChart2 } from "lucide-react";

const SalesPage: React.FC = () => {
    const { t } = useLanguage();

    const [activeTab, setActiveTab] = useState<"dailyQuotes" | "pointOfSales" | "salesIn" | "salesInReports">("dailyQuotes");

    const tabs = [
        {
            id: "dailyQuotes" as const,
            label: t("dailyQuotes"),
            icon: FileBarChart2,
        },
        {
            id: "pointOfSales" as const,
            label: t("pointOfSales"),
            icon: ShoppingCart,
        },
        {
            id: "salesIn" as const,
            label: t("salesIn"),
            icon: TrendingUp,
        },
        {
            id: "salesInReports" as const,
            label: t("salesInReports"),
            icon: BarChart3,
        },
    ];

    return (
        <div className="p-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 mb-6">
                <div className="flex space-x-2">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}>
                                <Icon size={18} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                {activeTab === "dailyQuotes" && <DailyQuote />}
                {activeTab === "pointOfSales" && <PointOfSales />}
                {activeTab === "salesIn" && <SalesIn />}
                {activeTab === "salesInReports" && <SalesInReport />}
            </motion.div>
        </div>
    );
};

export default SalesPage;
