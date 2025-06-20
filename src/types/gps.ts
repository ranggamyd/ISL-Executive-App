export interface Vehicle {
    id: number;
    name: string;
    category: "car" | "motorcycle";
    status: "online" | "offline" | "unknown";
    lastUpdate?: string;
    [key: string]: any;
}

export interface Position {
    deviceId: number;
    latitude: number;
    longitude: number;
    speed: number;
    course?: number;
    attributes: {
        ignition: boolean;
        motion: boolean;
        [key: string]: any;
    };
}
