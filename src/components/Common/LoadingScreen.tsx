import { motion } from "framer-motion";

const dotVariants = {
    bounce: (i: number) => ({
        y: [0, -10, 0],
        transition: {
            duration: 0.3,
            repeat: Infinity,
            delay: i * 0.1, // 👈 delay per titik
            ease: "easeInOut",
        },
    }),
};

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
            <div className="flex space-x-2">
                {[0, 1, 2].map(i => (
                    <motion.span key={i} className="w-4 h-4 bg-primary rounded-full bg-blue-500 dark:bg-blue-400" custom={i} variants={dotVariants} animate="bounce" />
                ))}
            </div>
        </div>
    );
};

export default LoadingScreen;