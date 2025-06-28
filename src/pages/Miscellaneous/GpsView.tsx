import axios from "axios";
import swal from "@/utils/swal";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { Map as LeafletMap } from "leaflet";
import RotatingMarker from "./RotatingMarker";
import { useState, useEffect, useRef } from "react";
import { getRelativeTime } from "@/utils/convertTime";
import { MapContainer, TileLayer } from "react-leaflet";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Position as PositionType, Vehicle as VehicleType } from "@/types/gps";
import { Pause, Play, Search, Wifi, CircleMinus, WifiOff, Filter, ChevronDown, Minimize2, Maximize2 } from "lucide-react";
import SearchInput from "@/components/Common/SearchInput";
import FilterButton from "@/components/Common/FilterButton";
import LoadingSpinner from "@/components/Common/LoadingSpinner";

const icons = {
    car: {
        ign: `${import.meta.env.VITE_PUBLIC_URL}img_geolocation/mobil_ign.png`,
        off: `${import.meta.env.VITE_PUBLIC_URL}img_geolocation/mobil_off.png`,
        online: `${import.meta.env.VITE_PUBLIC_URL}img_geolocation/mobil_online.png`,
        stop: `${import.meta.env.VITE_PUBLIC_URL}img_geolocation/mobil_stop.png`,
    },
    motorcycle: {
        ign: `${import.meta.env.VITE_PUBLIC_URL}img_geolocation/motor_ign.png`,
        off: `${import.meta.env.VITE_PUBLIC_URL}img_geolocation/motor_off.png`,
        online: `${import.meta.env.VITE_PUBLIC_URL}img_geolocation/motor_online.png`,
        stop: `${import.meta.env.VITE_PUBLIC_URL}img_geolocation/motor_stop.png`,
    },
};

const GpsView = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    const [vehicles, setVehicles] = useState<VehicleType[]>([]);
    const [positions, setPositions] = useState<{ [deviceId: number]: PositionType }>({});
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [openPopupVehicleId, setOpenPopupVehicleId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [mapLoading, setMapLoading] = useState(true);

    // New states for filter dropdown
    const filterRef = useRef<HTMLDivElement | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const mapRef = useRef<LeafletMap | null>(null);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);

    const http = window.location.protocol === "https:" ? "https:" : "http:";
    const path = http === "https:" ? "apps.intilab.com" : "10.88.8.40:8082";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    // Determine if we should use dark mode
    const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const connectWebSocket = () => {
        const url = `${protocol}//${path}/api/socket`;
        const websocket = new WebSocket(url);

        websocket.onopen = () => {
            setIsConnected(true);
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.positions) {
                updatePositions(data.positions);
            } else if (data.devices) {
                updateDevices(data.devices);
            }
        };

        websocket.onclose = () => {
            setIsConnected(false);
            setTimeout(connectWebSocket, 5000);
        };

        websocket.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
            websocket.close();
        };

        setWs(websocket);
    };

    const updatePositions = (positionsData: PositionType[]) => {
        setPositions((prevPositions) => {
            const updatedPositions = { ...prevPositions };
            positionsData.forEach((position) => {
                updatedPositions[position.deviceId] = position;
            });

            return updatedPositions;
        });
    };

    const updateDevices = (devicesData: VehicleType[]) => {
        setVehicles((prevVehicles) => {
            const updatedVehicles = [...prevVehicles];
            devicesData.forEach((device) => {
                const index = updatedVehicles.findIndex((v) => v.id === device.id);
                if (index !== -1) {
                    updatedVehicles[index] = { ...updatedVehicles[index], ...device };
                } else {
                    updatedVehicles.push(device);
                }
            });

            return updatedVehicles;
        });
    };

    const getVehicle = () => {
        axios
            .get<VehicleType[]>(`${http}//${path}/api/devices`, {
                headers: {
                    Authorization: "Bearer RzBFAiAsSMLm1ORiB2hH9KQvaGjNSN-1jHrV7nK_WIf1cF4CnwIhAMjtQNnyRNrpy4NogP8qHJWdv_5KVyiWcTLVt7JKSsN2eyJ1IjozLCJlIjoiMjA2MC0wNy0wN1QxNzowMDowMC4wMDArMDA6MDAifQ",
                },
            })
            .then((response) => {
                const vehiclesData = response.data;
                const motorcycles = vehiclesData.filter((v) => v.category === "motorcycle");
                const cars = vehiclesData.filter((v) => v.category === "car");
                const otherVehicles = vehiclesData.filter((v) => v.category !== "motorcycle" && v.category !== "car");

                setVehicles([...motorcycles, ...cars, ...otherVehicles]);
            })
            .catch((error) => {
                swal("error", error.message);
            });
    };

    useEffect(() => {
        connectWebSocket();
        getVehicle();

        return () => {
            if (ws) ws.close();
        };
    }, []);

    const getVehicleStatus = (vehicle: VehicleType, position: PositionType) => {
        if (vehicle.status === "online") {
            if (position.attributes.ignition) {
                if (position.attributes.motion) {
                    return "Moving";
                } else if (position.speed === 0) {
                    return "Idling";
                } else {
                    return "Parking";
                }
            } else {
                return "Parking";
            }
        } else if (vehicle.status === "offline" || vehicle.status === "unknown") {
            return "Offline";
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case "Moving":
                return "text-green-500 border border-green-400 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur";
            case "Idling":
                return "text-yellow-500 border border-yellow-400 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur";
            case "Parking":
                return "text-red-500 border border-red-400 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur";

            default:
                return "text-gray-500 border border-gray-400 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur";
        }
    };

    const getStatusIcon = (status: string): JSX.Element => {
        switch (status) {
            case "Moving":
                return <Play className="w-4 h-4" />;
            case "Idling":
                return <Pause className="w-4 h-4" />;
            case "Parking":
                return <CircleMinus className="w-4 h-4" />;

            default:
                return <WifiOff className="w-4 h-4" />;
        }
    };

    // Updated filter function to include status filter
    const getFilteredVehicles = vehicles.filter((vehicle) => {
        const position = positions[vehicle.id];
        const status = position ? getVehicleStatus(vehicle, position) : "Offline";

        const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || vehicle.category === selectedCategory;
        const matchesStatus = selectedStatus === "all" || status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getVehicleIconUrl = (vehicle: VehicleType, position: PositionType) => {
        const categoryIcons = icons[vehicle.category] || icons.car;
        if (vehicle.status === "online") {
            if (position.attributes.ignition) {
                if (position.attributes.motion) {
                    return categoryIcons.online;
                } else if (position.speed === 0) {
                    return categoryIcons.ign;
                } else {
                    return categoryIcons.stop;
                }
            } else {
                return categoryIcons.stop;
            }
        } else if (vehicle.status === "offline" || vehicle.status === "unknown") {
            return categoryIcons.off;
        }
    };

    const getPopupInfo = (vehicle: VehicleType, position: PositionType): string => {
        const speed = (Number(position.speed) * 1.609344).toFixed(0);

        const status = getVehicleStatus(vehicle, position);

        return `
            <div class="popup-container">
                <strong>${vehicle.name}</strong><br />
                ${t("speed")}: ${speed} km/h<br />
                Status: ${t(status || "unknown")}<br />
            </div>
        `;
    };

    const handleVehicleClick = (vehicleId: number): void => {
        if (openPopupVehicleId === vehicleId) {
            setOpenPopupVehicleId(null);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });

            const position = positions[vehicleId];
            if (position && mapRef.current) {
                mapRef.current.flyTo([position.latitude, position.longitude], 16, {
                    animate: true,
                    duration: 1.5,
                });
            }
            setOpenPopupVehicleId(vehicleId);
        }
    };

    // Get appropriate tile layer based on theme
    const getTileLayer = () => {
        if (isDarkMode) {
            // Dark mode: Use CartoDB Dark Matter tiles
            return {
                url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
                subdomains: ["a", "b", "c", "d"]
            };
        } else {
            // Light mode: Use CartoDB Positron tiles (lighter than Google Maps)
            return {
                url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
                subdomains: ["a", "b", "c", "d"]
            };
        }
    };

    const tileLayer = getTileLayer();

    const categories = [...new Set(vehicles.map((v) => v.category))];
    const statuses = ["Moving", "Idling", "Parking", "Offline"];

    const clearAllFilters = () => {
        setSelectedCategory("all");
        setSelectedStatus("all");
        setSearchTerm("");
    };

    // Add custom CSS for map loading state
    useEffect(() => {
        const style = document.createElement("style");
        style.id = "map-loading-styles";
        style.innerHTML = `
            .leaflet-container {
                background: ${isDarkMode ? '#1f2937' : '#f9fafb'} !important;
            }
            
            .leaflet-tile-pane {
                opacity: ${mapLoading ? '0' : '1'};
                transition: opacity 0.3s ease-in-out;
            }
            
            .leaflet-control-container {
                opacity: ${mapLoading ? '0' : '1'};
                transition: opacity 0.3s ease-in-out;
            }
        `;
        
        document.head.appendChild(style);
        
        return () => {
            const existingStyle = document.getElementById("map-loading-styles");
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, [isDarkMode, mapLoading]);

    return (
        <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800/70 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-1 ms-4">{t("vehicleGPSTracking")}</h3>
                    <button onClick={() => setIsMapFullscreen(!isMapFullscreen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors me-4">
                        {isMapFullscreen ? <Minimize2 size={18} className="text-gray-900 dark:text-white" /> : <Maximize2 size={18} className="text-gray-900 dark:text-white" />}
                    </button>
                </div>

                {/* Interactive Map */}
                <div className={`transition-all duration-300 ${isMapFullscreen ? "fixed inset-0 z-[51] bg-white dark:bg-gray-900 p-3" : ""}`}>
                    {isMapFullscreen && (
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-1 ms-4">{t("vehicleGPSTracking")}</h3>
                            <button onClick={() => setIsMapFullscreen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors me-4">
                                <Minimize2 size={18} className="text-gray-900 dark:text-white" />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-2xl relative">
                        {/* Map Container */}
                        <div className={`relative ${isMapFullscreen ? "h-[90dvh]" : "h-[400px]"}`}>
                            {/* Loading Overlay */}
                            {mapLoading && (
                                <div className={`absolute inset-0 z-[1000] flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl`}>
                                    <div className="flex flex-col items-center space-y-4">
                                        <LoadingSpinner size={32} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Loading map...
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="absolute inset-0 z-0 p-0">
                                <MapContainer
                                    center={[-6.3175829, 106.6474905]}
                                    zoom={17}
                                    className="rounded-2xl"
                                    style={{ height: "100%", width: "100%" }}
                                    whenReady={() => {
                                        const map = mapRef.current as LeafletMap;
                                        if (map) {
                                            setTimeout(() => {
                                                map.invalidateSize();
                                                setMapLoading(false);
                                            }, 500);
                                        }
                                    }}
                                >
                                    <TileLayer 
                                        url={tileLayer.url}
                                        maxZoom={20} 
                                        subdomains={tileLayer.subdomains}
                                        attribution={tileLayer.attribution}
                                        eventHandlers={{
                                            loading: () => setMapLoading(true),
                                            load: () => setMapLoading(false),
                                        }}
                                    />
                                    {vehicles.map((vehicle) => {
                                        const position = positions[vehicle.id];
                                        if (position) {
                                            const iconUrl = getVehicleIconUrl(vehicle, position);
                                            const rotationAngle = position.course || 0;
                                            const popupInfo = getPopupInfo(vehicle, position);
                                            return <RotatingMarker key={vehicle.id} vehicle={vehicle} position={[position.latitude, position.longitude]} rotationAngle={rotationAngle} iconUrl={iconUrl} popupInfo={popupInfo} onClick={() => handleVehicleClick(vehicle.id)} isOpen={openPopupVehicleId === vehicle.id} />;
                                        }
                                        return null;
                                    })}
                                </MapContainer>
                            </div>

                            {/* Connection Status */}
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 right-4">
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm ${isConnected ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}>
                                    {isConnected ? <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" /> : <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />}
                                    <span className={`text-sm font-medium ${isConnected ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>{isConnected ? t("connected") : t("disconnected")}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-3 -mt-2">{t("vehicleList")}</h2>
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                    <div className="relative" ref={filterRef}>
                        <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />

                        {filterOpen && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                                <div className="p-4 space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("category")}</label>
                                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="all">{t("all")}</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {t(category.toLowerCase())}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Status</label>
                                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="all">{t("all")}</option>
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {t(status.toLowerCase())}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline me-1">
                                            {t("clearAll")}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                {getFilteredVehicles.map((vehicle, index) => {
                    const position = positions[vehicle.id];
                    const status = position ? getVehicleStatus(vehicle, position) : "Offline";
                    let statusColor = null;
                    let statusIcon = null;
                    if (status !== undefined) {
                        statusColor = getStatusColor(status);
                        statusIcon = getStatusIcon(status);
                    }

                    return (
                        <motion.div
                            key={vehicle.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleVehicleClick(vehicle.id);
                            }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg active:scale-[0.98] min-h-[120px] ${
                                openPopupVehicleId === vehicle.id
                                    ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200 dark:border-blue-800 dark:bg-blue-900 dark:ring-2 dark:ring-blue-800"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:shadow-md"
                            }`}
                            style={{ userSelect: "none" }}
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white whitespace-nowrap text-sm">{vehicle.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{t(vehicle.category)}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor} -mt-7 -me-8 sm:mt-0 sm:me-0 `}>
                                        {statusIcon}
                                        <span className="hidden sm:inline">{t(status || "offline")}</span>
                                    </div>
                                </div>

                                {/* Speed and Details */}
                                <div className="mt-auto">
                                    {position && (
                                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            <span className="font-medium truncate">
                                                <span className="hidden sm:inline">{t("speed")}: </span>
                                                {(Number(position.speed) * 1.609344).toFixed(0)} km/h
                                            </span>
                                        </div>
                                    )}

                                    {/* Last Update */}
                                    <div className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-2 truncate">
                                        <span>{getRelativeTime(vehicle.lastUpdate) || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {getFilteredVehicles.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>{t("noDataFound")}</p>
                </div>
            )}
        </div>
    );
};

export default GpsView;