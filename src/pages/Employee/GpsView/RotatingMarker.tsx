import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

type Vehicle = {
    id: number;
    name: string;
    category: string;
    [key: string]: any;
};

type RotatingMarkerProps = {
    position: LatLngExpression;
    vehicle: Vehicle;
    rotationAngle: number;
    iconUrl: string | undefined;
    popupInfo: string;
    onClick?: (position: LatLngExpression) => void;
    isOpen: boolean;
};

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RotatingMarker: React.FC<RotatingMarkerProps> = ({ position, vehicle, rotationAngle, iconUrl, popupInfo, onClick, isOpen }) => {
    const map = useMap();

    const markerRef = useRef<L.Marker | null>(null);
    const markerLayerRef = useRef<L.FeatureGroup | null>(null);
    const polylineRef = useRef<L.Polyline | null>(null);

    const [initialZoomDone, setInitialZoomDone] = useState(false);
    const [lastPosition, setLastPosition] = useState<LatLngExpression>(position);

    useEffect(() => {
        // Create custom icon with modern styling
        const icon = L.divIcon({
            html: `
                <div class="vehicle-marker-container">
                    <div class="vehicle-label">
                        <span class="vehicle-name">${vehicle.name}</span>
                    </div>
                    <div class="vehicle-icon-wrapper" style="transform: rotate(${rotationAngle}deg);">
                        <img src="${iconUrl}" class="vehicle-icon" alt="${vehicle.name}" />
                        <div class="vehicle-pulse"></div>
                    </div>
                </div>
            `,
            className: "custom-vehicle-marker",
            iconSize: [50, 70],
            iconAnchor: [25, 60],
            popupAnchor: [0, -60],
        });

        // Clean up previous markers and layers
        if (markerLayerRef.current) {
            try {
                map.removeLayer(markerLayerRef.current);
            } catch (e) {
                console.warn("Failed to remove marker layer:", e);
            }
        }
        if (polylineRef.current) {
            try {
                map.removeLayer(polylineRef.current);
            } catch (e) {
                console.warn("Failed to remove polyline:", e);
            }
        }

        // Create new marker
        const marker = L.marker(position, { icon });

        // Add click handler with proper event handling
        if (onClick) {
            marker.on("click", e => {
                L.DomEvent.stopPropagation(e);
                if (isOpen) {
                    marker.closePopup();
                }
                onClick(position);
            });
        }

        // Add to map
        const markerLayer = L.featureGroup([marker]);
        try {
            markerLayer.addTo(map);
            markerRef.current = marker;
            markerLayerRef.current = markerLayer;
        } catch (e) {
            console.error("Failed to add marker to map:", e);
            return;
        }

        // Handle popup
        if (isOpen) {
            const modernPopupContent = `
                <div class="modern-popup">
                    <div class="popup-header">
                        <h3 class="popup-title">${vehicle.name}</h3>
                        <span class="popup-category">${vehicle.category}</span>
                    </div>
                    <div class="popup-content">
                        ${popupInfo}
                    </div>
                </div>
            `;

            marker
                .bindPopup(modernPopupContent, {
                    className: "modern-popup-container",
                    closeButton: true,
                    autoClose: false,
                    closeOnClick: false,
                    maxWidth: 250,
                    offset: [0, -10],
                })
                .openPopup();

            // Auto zoom to marker when opened
            if (!initialZoomDone || JSON.stringify(lastPosition) !== JSON.stringify(position)) {
                try {
                    map.flyTo(position, Math.max(map.getZoom(), 14), {
                        animate: true,
                        duration: 1.5,
                        easeLinearity: 0.25,
                    });
                    setInitialZoomDone(true);
                    setLastPosition(position);
                } catch (e) {
                    console.warn("Failed to fly to position:", e);
                }
            }
        }

        // Cleanup function
        return () => {
            if (markerLayerRef.current) {
                try {
                    map.removeLayer(markerLayerRef.current);
                } catch (e) {
                    console.warn("Cleanup: Failed to remove marker layer:", e);
                }
            }
            if (polylineRef.current) {
                try {
                    map.removeLayer(polylineRef.current);
                } catch (e) {
                    console.warn("Cleanup: Failed to remove polyline:", e);
                }
            }
        };
    }, [map, vehicle, position, rotationAngle, iconUrl, popupInfo, onClick, isOpen, initialZoomDone, lastPosition]);

    // Add custom CSS styles to the map container
    useEffect(() => {
        const mapContainer = map.getContainer();
        const existingStyles = mapContainer.querySelector("#custom-marker-styles");

        if (!existingStyles) {
            const style = document.createElement("style");
            style.id = "custom-marker-styles";
            style.innerHTML = `
                .custom-vehicle-marker {
                    background: transparent !important;
                    border: none !important;
                }

                .vehicle-marker-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    pointer-events: auto;
                }

                .vehicle-label {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    padding: 2px 8px;
                    margin-bottom: 4px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    transform: translateX(-50%);
                    left: 50%;
                    position: relative;
                }

                .vehicle-name {
                    font-size: 10px;
                    font-weight: 600;
                    color: #374151;
                    white-space: nowrap;
                }

                .vehicle-icon-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .vehicle-icon {
                    width: 32px !important;
                    height: 32px !important;
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    border: 2px solid white;
                    background: white;
                    padding: 2px;
                    transition: transform 0.3s ease;
                }

                .vehicle-icon:hover {
                    transform: scale(1.1);
                }

                .vehicle-pulse {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(59, 130, 246, 0.3);
                    animation: pulse 2s infinite;
                    z-index: -1;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }

                .modern-popup-container .leaflet-popup-content-wrapper {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    padding: 0;
                }

                .modern-popup-container .leaflet-popup-content {
                    margin: 0;
                    padding: 0;
                }

                .modern-popup-container .leaflet-popup-tip {
                    background: white;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                }

                .modern-popup {
                    min-width: 200px;
                }

                .popup-header {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    color: white;
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .popup-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0;
                }

                .popup-category {
                    font-size: 11px;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 2px 6px;
                    border-radius: 8px;
                    text-transform: capitalize;
                }

                .popup-content {
                    padding: 12px 16px;
                    font-size: 12px;
                    line-height: 1.5;
                    color: #374151;
                }

                .popup-content strong {
                    color: #111827;
                }
            `;
            mapContainer.appendChild(style);
        }
    }, [map]);

    return null;
};

export default RotatingMarker;
