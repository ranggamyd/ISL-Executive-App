import { ArrowLeft, LayoutGrid, List, Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LucideIconMap } from "@/utils/dynamicIcon";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu } from "@/types/menu";
import MenuItemCard from "../Common/MenuItemCard";
import MenuItemList from "../Common/MenuItemList";
import SearchInput from "../Common/SearchInput";

const MenuDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const { t } = useLanguage();
    const { menus } = useAuth() as { menus: Menu[] };
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState(localStorage.getItem("drawerViewMode") || "card");

    useEffect(() => {
        localStorage.setItem("drawerViewMode", viewMode);
    }, [viewMode]);

    const filtered = useMemo(() => {
        if (!searchTerm) return menus;
        return menus.filter((m) => t(m.name).toLowerCase().includes(searchTerm.toLowerCase()));
    }, [menus, searchTerm, t]);

    const grouped = useMemo(() => {
        return filtered.reduce<Record<string, Menu[]>>((acc, curr) => {
            if (!acc[curr.group]) acc[curr.group] = [];
            acc[curr.group].push(curr);
            return acc;
        }, {});
    }, [filtered]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]" onClick={onClose} />

                    {/* Drawer */}
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 bottom-0 end-0 w-full md:w-[26rem] z-[999] bg-white dark:bg-gray-800 flex flex-col shadow-xl">
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600/90 via-blue-400 to-purple-600/90 dark:from-blue-800/90 dark:via-blue-600 dark:to-purple-800/90 text-white flex items-center justify-between shadow-md">
                            <div className="flex items-center gap-3">
                                <button onClick={onClose} className="text-white hover:text-gray-100">
                                    <ArrowLeft size={22} />
                                </button>
                                <h3 className="text-base font-semibold">{t("allMenus")}</h3>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setViewMode("card")} className={`p-1 rounded-md ${viewMode === "card" ? "bg-white text-blue-600" : "text-white hover:text-gray-200"}`}>
                                    <LayoutGrid size={18} />
                                </button>
                                <button onClick={() => setViewMode("list")} className={`p-1 rounded-md ${viewMode === "list" ? "bg-white text-blue-600" : "text-white hover:text-gray-200"}`}>
                                    <List size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                            {/* Search */}
                            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                            {/* Grouped Menus */}
                            {Object.entries(grouped).map(([groupName, items]) => {
                                const groupIconName = items[0].groupIcon as keyof typeof LucideIconMap;
                                const GroupIcon = LucideIconMap[groupIconName] as React.ElementType;

                                return (
                                    <div key={groupName}>
                                        <h3 className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 gap-2">
                                            {GroupIcon && <GroupIcon size={16} className="text-gray-500 dark:text-gray-400" />}
                                            {groupName}
                                        </h3>

                                        <div className={viewMode === "card" ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "space-y-2"}>
                                            {items.map((menu, index) => {
                                                return viewMode === "card" ? <MenuItemCard key={menu.id} index={index} menu={menu} setIsDrawerOpen={() => {}} /> : <MenuItemList key={menu.id} index={index} menu={menu} onClose={onClose} />;
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MenuDrawer;
