import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState, useEffect } from "react";
// import { CardSkeleton } from "@/components/Common/Skeleton";
// import { Search } from "lucide-react";
import { LucideIconMap } from "@/utils/dynamicIcon";
import MenuDrawer from "@/components/Layout/MenuDrawer";
import Candidates from "../Recruitments/Candidates";
import SalesInReports from "../Sales/SalesInReports";
import { useUserAccess } from "@/hooks/useUserAccess";
import MenuItemCard from "@/components/Common/MenuItemCard";
import SearchInput from "@/components/Common/SearchInput";

const HomePage: React.FC = () => {
    const { t } = useLanguage();

    const { user, menus } = useAuth();

    // const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    // const [loading, setLoading] = useState<boolean>(false);

    const [limit, setLimit] = useState(6);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    const { canAccess } = useUserAccess();

    useEffect(() => {
        const update = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setLimit(12);
            } else if (width >= 640) {
                setLimit(10);
            } else {
                setLimit(6);
            }
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    // Function to get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 11) return t("greeting_morning");
        if (hour >= 11 && hour < 15) return t("greeting_afternoon");
        if (hour >= 15 && hour < 18) return t("greeting_evening");
        return t("greeting_night");
    };
    const texts = [t("welcomeBack") + ", " + user?.name, t("welcomeMessage")];

    useEffect(() => {
        const currentString = texts[index];
        const typing = setTimeout(() => {
            setDisplayedText(currentString.slice(0, charIndex + 1));
            setCharIndex(charIndex + 1);
        }, 25);

        if (charIndex === currentString.length) {
            clearTimeout(typing);
            setTimeout(() => {
                setCharIndex(0);
                setIndex(prev => (prev + 1) % texts.length);
            }, 3000); // delay before switching to next text
        }

        return () => clearTimeout(typing);
    }, [charIndex, index, texts]);

    const showAllButton = {
        id: "allMenus",
        name: "allMenus",
        group: "allMenus",
        groupIcon: null,
        path: null,
        icon: "LayoutGrid" as keyof typeof LucideIconMap,
        theme: "gray",
    };

    const limitedMenus = [...(menus ?? []).slice(0, limit - 1), showAllButton];

    return (
        <>
            <div className="p-6 space-y-6">
                {/* Greeting Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">{getGreeting()}!</h2>
                    <motion.p key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-white/80 text-base h-6">
                        {displayedText}
                    </motion.p>
                </motion.div>

                {/* Search Section */}
                <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
                    <Search className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t("search") + "..."} className="w-full pl-12 pe-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white" />
                </motion.div> */}

                {/* Menu Grid */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                    {/* {loading ? (
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <CardSkeleton key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                            {limitedMenus.map((menu, index) => (
                                <MenuItemCard key={index} index={index} menu={menu} setIsDrawerOpen={setIsDrawerOpen} />
                            ))}
                        </div>
                    )} */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                        {limitedMenus.map((menu, index) => (
                            <MenuItemCard key={index} index={index} menu={menu} setIsDrawerOpen={setIsDrawerOpen} />
                        ))}
                    </div>
                </motion.div>
            </div>

            {canAccess("salesInReports", "view") && <SalesInReports />}
            {canAccess("candidates", "view") && <Candidates />}

            <MenuDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </>
    );
};

export default HomePage;
