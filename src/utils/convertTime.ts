import { useLanguage } from "@/contexts/LanguageContext";

export type TimeInput = string | number | Date | null | undefined;

export interface RelativeTimeOptions {
    locale?: "id" | "en";
    shortFormat?: boolean;
}

export const getRelativeTime = (timestamp: TimeInput, options: RelativeTimeOptions = {}): string => {
    const { language } = useLanguage();

    const supportedLocales = ["en", "id"] as const;
    const locale: "id" | "en" = supportedLocales.includes(language as any) ? (language as "id" | "en") : "en";

    const { shortFormat = false } = options;

    if (!timestamp) return "N/A";

    const now = new Date();
    const updateTime = new Date(timestamp);

    if (isNaN(updateTime.getTime())) return "Invalid date";

    const diffInSeconds = Math.floor((now.getTime() - updateTime.getTime()) / 1000);

    if (diffInSeconds < 0) return locale === "id" ? "Baru saja" : "Just now";

    const timeUnits = {
        id: {
            second: shortFormat ? "dtk" : "detik",
            minute: shortFormat ? "mnt" : "menit",
            hour: shortFormat ? "jam" : "jam",
            day: shortFormat ? "hr" : "hari",
            week: shortFormat ? "mgg" : "minggu",
            month: shortFormat ? "bln" : "bulan",
            year: shortFormat ? "thn" : "tahun",
            ago: shortFormat ? "" : "yang lalu",
        },
        en: {
            second: shortFormat ? "s" : "second",
            minute: shortFormat ? "m" : "minute",
            hour: shortFormat ? "h" : "hour",
            day: shortFormat ? "d" : "day",
            week: shortFormat ? "w" : "week",
            month: shortFormat ? "mo" : "month",
            year: shortFormat ? "y" : "year",
            ago: shortFormat ? "" : "ago",
        },
    };

    const units = timeUnits[locale];

    const formatTime = (value: number, unit: string): string => {
        if (shortFormat) return `${value}${unit}`;

        return locale === "id" ? `${value} ${unit} ${units.ago}`.trim() : `${value} ${unit}${value > 1 ? "s" : ""} ${units.ago}`.trim();
    };

    if (diffInSeconds < 60) return formatTime(diffInSeconds, units.second);

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return formatTime(diffInMinutes, units.minute);

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return formatTime(diffInHours, units.hour);

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return formatTime(diffInDays, units.day);

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return formatTime(diffInWeeks, units.week);

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return formatTime(diffInMonths, units.month);

    const diffInYears = Math.floor(diffInDays / 365);
    return formatTime(diffInYears, units.year);
};
