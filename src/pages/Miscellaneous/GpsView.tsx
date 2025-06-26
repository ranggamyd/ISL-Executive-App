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
import { Position as PositionType, Vehicle as VehicleType } from "@/types/gps";
import { Pause, Play, Search, Wifi, CircleMinus, WifiOff, Filter, ChevronDown, Minimize2, Maximize2 } from "lucide-react";

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

    const [vehicles, setVehicles] = useState<VehicleType[]>([]);
    const [positions, setPositions] = useState<{ [deviceId: number]: PositionType }>({});
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [openPopupVehicleId, setOpenPopupVehicleId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isConnected, setIsConnected] = useState(false);

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

        websocket.onmessage = event => {
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

        websocket.onerror = error => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
            websocket.close();
        };

        setWs(websocket);
    };

    const updatePositions = (positionsData: PositionType[]) => {
        setPositions(prevPositions => {
            const updatedPositions = { ...prevPositions };
            positionsData.forEach(position => {
                updatedPositions[position.deviceId] = position;
            });

            return updatedPositions;
        });
    };

    const updateDevices = (devicesData: VehicleType[]) => {
        setVehicles(prevVehicles => {
            const updatedVehicles = [...prevVehicles];
            devicesData.forEach(device => {
                const index = updatedVehicles.findIndex(v => v.id === device.id);
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
            .then(response => {
                const vehiclesData = response.data;
                const motorcycles = vehiclesData.filter(v => v.category === "motorcycle");
                const cars = vehiclesData.filter(v => v.category === "car");
                const otherVehicles = vehiclesData.filter(v => v.category !== "motorcycle" && v.category !== "car");

                setVehicles([...motorcycles, ...cars, ...otherVehicles]);
            })
            .catch(error => {
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
                return "text-green-500 bg-green-100";
            case "Idling":
                return "text-yellow-500 bg-yellow-100";
            case "Parking":
                return "text-red-500 bg-red-100";

            default:
                return "text-gray-500 bg-gray-100";
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
    const getFilteredVehicles = vehicles.filter(vehicle => {
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

    const categories = [...new Set(vehicles.map(v => v.category))];
    const statuses = ["Moving", "Idling", "Parking", "Offline"];

    const clearAllFilters = () => {
        setSelectedCategory("all");
        setSelectedStatus("all");
        setSearchTerm("");
    };

    return (
        <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-1 ms-4">{t("vehicleGPSTracking")}</h3>
                    <button onClick={() => setIsMapFullscreen(!isMapFullscreen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors me-4">
                        {isMapFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>

                {/* Interactive Map */}
                <div className={`transition-all duration-300 ${isMapFullscreen ? "fixed inset-0 z-[51] bg-white p-3" : ""}`}>
                    {isMapFullscreen && (
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-1 ms-4">{t("vehicleGPSTracking")}</h3>
                            <button onClick={() => setIsMapFullscreen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors me-4">
                                <Minimize2 size={18} />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col bg-gray-50 rounded-2xl">
                        {/* Map Container */}
                        <div className={`relative ${isMapFullscreen ? "h-[90dvh]" : "h-[400px]"}`}>
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
                                            }, 100);
                                        }
                                    }}
                                >
                                    <TileLayer url="https://{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}" maxZoom={20} subdomains={["mt0", "mt1", "mt2", "mt3"]} attribution="&copy; Google" />
                                    {vehicles.map(vehicle => {
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
                                    {isConnected ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
                                    <span className={`text-sm font-medium ${isConnected ? "text-green-700" : "text-red-700"}`}>{isConnected ? t("connected") : t("disconnected")}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 space-y-3">
                <div className="flex items-center justify-center">
                    <h2 className="text-xl font-bold text-gray-800">{t("vehicleList")}</h2>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t("search") + "..."} className="w-full pl-12 pe-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="relative" ref={filterRef}>
                        <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                            <Filter size={18} className="text-gray-600" />
                            <ChevronDown size={16} className={`text-gray-600`} />
                        </button>

                        {/* Dropdown Menu */}
                        {filterOpen && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("category")}</label>
                                        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="all">{t("all")}</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>
                                                    {t(category.toLowerCase())}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="all">{t("all")}</option>
                                            {statuses.map(status => (
                                                <option key={status} value={status}>
                                                    {t(status.toLowerCase())}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800 hover:underline me-1">
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
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleVehicleClick(vehicle.id);
                            }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg active:scale-[0.98] min-h-[120px] ${openPopupVehicleId === vehicle.id ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"}`}
                            style={{ userSelect: "none" }}
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 whitespace-nowrap text-sm">{vehicle.name}</h3>
                                        <p className="text-xs text-gray-500 capitalize mt-1">{t(vehicle.category)}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor} -mt-7 -me-8 sm:mt-0 sm:me-0`}>
                                        {statusIcon}
                                        <span className="hidden sm:inline">{t(status || "offline")}</span>
                                    </div>
                                </div>

                                {/* Speed and Details */}
                                <div className="mt-auto">
                                    {position && (
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                            <span className="font-medium truncate">
                                                <span className="hidden sm:inline">{t("speed")}: </span>
                                                {(Number(position.speed) * 1.609344).toFixed(0)} km/h
                                            </span>
                                        </div>
                                    )}

                                    {/* Last Update */}
                                    <div className="text-xs text-gray-400 border-t border-gray-100 pt-2 truncate">
                                        <span>{getRelativeTime(vehicle.lastUpdate) || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {getFilteredVehicles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>{t("noDataFound")}</p>
                </div>
            )}
        </div>
    );
};

export default GpsView;
