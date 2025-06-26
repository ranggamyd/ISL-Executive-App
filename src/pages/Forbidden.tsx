import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Forbidden = () => {
    const { t } = useLanguage();

    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-gray-900 overflow-hidden">
            <motion.img src="img/undraw_warning_tl76.svg" alt="Forbidden" className="w-80 max-w-full mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} />

            <motion.h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {t("forbidden")}
            </motion.h1>

            <motion.p className="text-gray-600 dark:text-gray-400 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {t("forbiddenDesc")}
            </motion.p>

            <motion.button onClick={() => navigate("/")} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Home size={18} />
                <span>{t("backToHome")}</span>
            </motion.button>
        </div>
    );
};

export default Forbidden;
