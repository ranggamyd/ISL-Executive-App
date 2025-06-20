import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ChartData {
    periode_kontrak?: string;
    total_penjualan?: number;
    tanggal_masuk?: string;
    nominal?: number;
}

interface SalesChartProps {
    data: ChartData[];
    type: "line" | "area" | "bar" | "pie";
    dataKey: string;
    color?: string;
    height?: number;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, type, dataKey, color = "#3B82F6", height = 300 }) => {
    const { t } = useLanguage();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-center">
                    <p className="font-medium text-gray-900">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

    switch (type) {
        case "line":
            return (
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} />
                        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} tickFormatter={value => (dataKey === "value" || dataKey === "revenue" ? `${(value / 1000000).toFixed(0)}M` : value.toString())} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ fill: color, strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: color, strokeWidth: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            );

        case "area":
            return (
                <ResponsiveContainer width="100%" height={height}>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="periode_kontrak" stroke="#6B7280" fontSize={12} tickLine={false} />
                        <YAxis stroke="#6B7280" fontSize={12} tickLine={false} tickFormatter={value => (dataKey === "value" || dataKey === "revenue" ? `${(value / 1000000).toFixed(0)}M` : value.toString())} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            );

        case "bar":
            return (
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={data} margin={{ left: -17 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="label" stroke="#6B7280" fontSize={10} tickLine={false} interval={0} />
                        <YAxis stroke="#6B7280" fontSize={10} tickLine={false} tickFormatter={value => (dataKey === "nominal" || dataKey === "total_penjualan" ? (value / 1000000).toFixed(0) + " " + t("million") : value.toString())} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            );

        case "pie":
            return (
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey={dataKey} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            );

        default:
            return null;
    }
};

export default SalesChart;
