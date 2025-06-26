import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";

const DateInput = ({ date, setDate }: { date: string; setDate: React.Dispatch<React.SetStateAction<string>> }) => {
    const { t } = useLanguage();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            {/* <Search className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} /> */}
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-6 pe-4 py-3 dark:[color-scheme:dark] border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white" />
        </motion.div>
    );
};

export default DateInput;
