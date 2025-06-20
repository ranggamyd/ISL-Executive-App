/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            spacing: {
                safe: "env(safe-area-inset-bottom)",
            },
            animation: {
                "bounce-slow": "bounce 2s infinite",
                "pulse-slow": "pulse 3s infinite",
            },
        },
    },
    plugins: [],
};
