import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedNumberProps {
    value: number;
    duration?: number;
}

interface AnimatedCurrencyProps {
    value: number;
    duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 2000 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        const animation = animate(count, value, {
            duration: duration / 1000,
            ease: "easeOut",
        });

        return animation.stop;
    }, [value, count, duration]);

    return <motion.span>{rounded}</motion.span>;
};

export const AnimatedCurrency: React.FC<AnimatedCurrencyProps> = ({ value, duration = 2000 }) => {
    const count = useMotionValue(0);

    useEffect(() => {
        const animation = animate(count, value, {
            duration: duration / 1000,
            ease: "easeOut",
        });

        return animation.stop;
    }, [value, count, duration]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return <motion.span>{useTransform(count, latest => formatCurrency(latest))}</motion.span>;
};
