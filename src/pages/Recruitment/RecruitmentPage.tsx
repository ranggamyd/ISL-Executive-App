import Salary from "./Salary/Salary";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Candidate from "./Candidate/Candidate";
import { Users, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RecruitmentPage: React.FC = () => {
    const { t } = useLanguage();

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
        <div className="p-6">
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

export default RecruitmentPage;
