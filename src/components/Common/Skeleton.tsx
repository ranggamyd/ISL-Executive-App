import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
    circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = "w-full", height = "h-4", className = "", circle = false }) => {
    return (
        <motion.div
            className={`bg-gray-200 ${circle ? "rounded-full" : "rounded"} ${width} ${height} ${className}`}
            animate={{
                opacity: [0.5, 1, 0.5],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

export const CardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
            <Skeleton width="w-12" height="h-12" circle />
            <div className="flex-1">
                <Skeleton width="w-3/4" height="h-4" className="mb-2" />
                <Skeleton width="w-1/2" height="h-3" />
            </div>
        </div>
        <div className="space-y-2">
            <Skeleton width="w-full" height="h-3" />
            <Skeleton width="w-5/6" height="h-3" />
        </div>
    </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
    <div className="space-y-4">
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100">
                <Skeleton width="w-12" height="h-12" circle />
                <div className="flex-1">
                    <Skeleton width="w-3/4" height="h-4" className="mb-2" />
                    <Skeleton width="w-1/2" height="h-3" />
                </div>
                <Skeleton width="w-16" height="h-8" />
            </div>
        ))}
    </div>
);

export const StatSkeleton: React.FC = () => (
    <div className={`bg-gradient-to-br from-gray-300 to-gray-600 rounded-xl p-4 text-white`}>
        <div className="flex flex-col items-center justify-between">
            <Skeleton width="w-6" height="h-6" className="bg-white/20" />
            <div className="text-center mt-2 md:text-end">
                <Skeleton width="w-20" height="h-2" className="bg-white/20 mb-2" />
                <Skeleton width="w-20" height="h-2" className="bg-white/20 mb-2" />
            </div>
        </div>
    </div>
);

export default Skeleton;
