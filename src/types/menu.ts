import { LucideIconMap } from "@/utils/dynamicIcon";

export interface Menu {
    id: number;
    name: string;
    group: string;
    path: string;
    icon: keyof typeof LucideIconMap;
    theme: string;
}
