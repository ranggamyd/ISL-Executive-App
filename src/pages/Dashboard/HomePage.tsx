import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import { LucideIconMap } from "@/utils/dynamicIcon";
import Candidates from "../Recruitments/Candidates";
import SalesInReports from "../Sales/SalesInReports";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchInput from "@/components/Common/SearchInput";
import { MenuItemCard } from "@/components/Common/MenuItem";

const HomePage: React.FC = () => {
    const { t } = useLanguage();

    const { user, menus } = useAuth();

    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");

    const [menuLimit, setMenuLimit] = useState(6);

    const { canAccess } = useUserAccess();

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
                setIndex((prev) => (prev + 1) % texts.length);
            }, 3000);
        }

        return () => clearTimeout(typing);
    }, [charIndex, index, texts]);

    useEffect(() => {
        const update = () => {
            const width = window.innerWidth;

            if (width >= 1024) {
                setMenuLimit(12);
            } else if (width >= 640) {
                setMenuLimit(10);
            } else {
                setMenuLimit(8);
            }
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const showAllButton = {
        id: "allMenus",
        name: "allMenus",
        group: "allMenus",
        groupIcon: null,
        path: "",
        icon: "LayoutGrid" as keyof typeof LucideIconMap,
        theme: "gray",
    };

    const limitedMenus = [...(menus ?? []).slice(0, menuLimit - 1), showAllButton];

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">{getGreeting()}!</h2>
                <motion.p key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-white/80 text-base h-6">
                    {displayedText}
                </motion.p>
            </motion.div>

            <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-4">
                    {limitedMenus.map((menu, index) => (
                        <MenuItemCard key={index} index={index} menu={menu} />
                    ))}
                </div>
            </motion.div>

            {canAccess("salesInReports", "view") && <SalesInReports />}
            {canAccess("candidates", "view") && <Candidates />}
        </div>
    );
};

export default HomePage;
