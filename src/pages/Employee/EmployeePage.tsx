import { motion } from "framer-motion";
import React, { useState } from "react";
import GpsView from "./GpsView/GpsView";
import Employee from "./Employee/Employee";
import AccessDoor from "./AccessDoor/AccessDoor";
import { Users, DoorOpen, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmployeePage: React.FC = () => {
    const { t } = useLanguage();

    const [activeTab, setActiveTab] = useState<"employees" | "accessDoors" | "gpsView">("employees");

    const tabs = [
        {
            id: "employees" as const,
            label: t("allEmployees"),
            icon: Users,
        },
        {
            id: "accessDoors" as const,
            label: t("accessDoor"),
            icon: DoorOpen,
        },
        {
            id: "gpsView" as const,
            label: t("gpsView"),
            icon: MapPin,
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
                {activeTab === "employees" && <Employee />}
                {activeTab === "accessDoors" && <AccessDoor />}
                {activeTab === "gpsView" && <GpsView />}
            </motion.div>
        </div>
    );
};

export default EmployeePage;
