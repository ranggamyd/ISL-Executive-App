import { LayoutGrid, List, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LucideIconMap } from "@/utils/dynamicIcon";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu } from "@/types/menu";

export default function Sales() {
    const { t } = useLanguage();

    const { menus } = useAuth() as { menus: Menu[] };

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"card" | "list">("card");

    useEffect(() => {
        const stored = localStorage.getItem("drawerViewMode");
        if (stored === "list" || stored === "card") setViewMode(stored);
    }, []);

    useEffect(() => {
        localStorage.setItem("drawerViewMode", viewMode);
    }, [viewMode]);

    const filtered = useMemo(() => {
        if (!searchTerm) return menus;
        return menus.filter(m => t(m.name).toLowerCase().includes(searchTerm.toLowerCase()));
    }, [menus, searchTerm, t]);

    const grouped = useMemo(() => {
        return filtered.reduce<Record<string, Menu[]>>((acc, curr) => {
            if (curr.group === "sales") {
                if (!acc[curr.group]) acc[curr.group] = [];
                acc[curr.group].push(curr);
            }
            return acc;
        }, {});
    }, [filtered]);

    return (
        <div className="p-6">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Search */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
                    <Search className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t("search") + "..."} className="w-full pl-12 pe-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                </motion.div>

                {/* Grouped Menus */}
                {Object.entries(grouped).map(([groupName, items]) => {
                    const groupIconName = items[0].groupIcon as keyof typeof LucideIconMap;
                    const GroupIcon = LucideIconMap[groupIconName] as React.ElementType;

                    return (
                        <div key={groupName}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="flex items-center text-xs font-semibold text-white uppercase tracking-wide gap-2">
                                    {GroupIcon && <GroupIcon size={16} />}
                                    {groupName}
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setViewMode("card")} className={`p-1 rounded-md ${viewMode === "card" ? "bg-white text-blue-600" : "text-white hover:text-gray-200"}`}>
                                        <LayoutGrid size={16} />
                                    </button>
                                    <button onClick={() => setViewMode("list")} className={`p-1 rounded-md ${viewMode === "list" ? "bg-white text-blue-600" : "text-white hover:text-gray-200"}`}>
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className={viewMode === "card" ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "space-y-2"}>
                                {items.map(menu => {
                                    const iconName = menu.icon as keyof typeof LucideIconMap;
                                    const Icon = LucideIconMap[iconName] as React.ElementType;

                                    return viewMode === "card" ? (
                                        <motion.button
                                            key={menu.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => {
                                                navigate(`/${menu.path}`);
                                                // onClose();
                                            }}
                                            className="group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl shadow-sm bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:from-blue-50 hover:to-white hover:border-blue-200 transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 via-white to-purple-100 border border-blue-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                                                <Icon size={18} className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                                            </div>
                                            <p className="text-xs font-semibold text-center text-gray-700 group-hover:text-blue-700 transition-all duration-300 truncate w-full">{t(menu.name)}</p>
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            key={menu.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => {
                                                navigate(`/${menu.path}`);
                                                // onClose();
                                            }}
                                            className="group flex flex-row w-full items-center justify-center gap-2 p-3 rounded-2xl shadow-sm bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:from-blue-50 hover:to-white hover:border-blue-200 transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-center w-12 h-10 rounded-full bg-gradient-to-tr from-blue-100 via-white to-purple-100 border border-blue-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                                                <Icon size={18} className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                                            </div>
                                            <p className="text-xs font-semibold text-start text-gray-700 group-hover:text-blue-700 transition-all duration-300 truncate w-full">{t(menu.name)}</p>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
