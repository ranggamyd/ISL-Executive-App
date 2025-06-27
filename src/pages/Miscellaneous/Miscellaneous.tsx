import { Menu } from "@/types/menu";
import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LucideIconMap } from "@/utils/dynamicIcon";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchInput from "@/components/Common/SearchInput";
import { MenuItemCard, MenuItemList } from "@/components/Common/MenuItem";

export default function Miscellaneous() {
    const { t } = useLanguage();

    const { menus } = useAuth() as { menus: Menu[] };

    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState(localStorage.getItem("drawerViewMode") || "card");

    useEffect(() => {
        localStorage.setItem("drawerViewMode", viewMode);
    }, [viewMode]);

    const filtered = useMemo(() => {
        if (!searchTerm) return menus;
        return menus.filter(m => t(m.name).toLowerCase().includes(searchTerm.toLowerCase()));
    }, [menus, searchTerm, t]);

    const grouped = useMemo(() => {
        return filtered.reduce<Record<string, Menu[]>>((acc, curr) => {
            if (curr.group === "miscellaneous") {
                if (!acc[curr.group]) acc[curr.group] = [];
                acc[curr.group].push(curr);
            }
            return acc;
        }, {});
    }, [filtered]);

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">{t("miscellaneous")}</h2>
            </motion.div>

            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {Object.entries(grouped).map(([groupName, items]) => {
                const groupIconName = items[0].groupIcon as keyof typeof LucideIconMap;
                const GroupIcon = LucideIconMap[groupIconName] as React.ElementType;

                return (
                    <div key={groupName}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="flex items-center text-xs font-semibold text-white uppercase tracking-wide gap-2">
                                {GroupIcon && <GroupIcon size={16} />}
                                {t(groupName)} {t('menuList')}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => setViewMode("card")} className={`p-1 rounded-md ${viewMode === "card" ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-white" : "text-white"}`}>
                                    <LayoutGrid size={16} />
                                </button>
                                <button onClick={() => setViewMode("list")} className={`p-1 rounded-md ${viewMode === "list" ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-white" : "text-white"}`}>
                                    <List size={16} />
                                </button>
                            </div>
                        </div>

                        <div className={viewMode === "card" ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "space-y-2"}>{items.map((menu, index) => (viewMode === "card" ? <MenuItemCard key={index} index={index} menu={menu} /> : <MenuItemList key={index} index={index} menu={menu} />))}</div>
                    </div>
                );
            })}
        </div>
    );
}
