// components/ThemeToggle.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Smartphone } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { key: "light", icon: Sun, label: "Light" },
        { key: "dark", icon: Moon, label: "Dark" },
        { key: "system", icon: Smartphone, label: "System" },
    ];

    return (
        <div className="flex items-center space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {themes.map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setTheme(key as any)} className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${theme === key ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`} title={label}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                </button>
            ))}
        </div>
    );
}

export function SimpleThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    const getIcon = () => {
        if (theme === "light") return Sun;
        if (theme === "dark") return Moon;
        return Smartphone;
    };

    const Icon = getIcon();

    return (
        <button onClick={toggleTheme} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100" title={`Current: ${theme}`}>
            <Icon className="h-5 w-5" />
        </button>
    );
}
