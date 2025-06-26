import { LucideIconMap } from "@/utils/dynamicIcon";

export interface Menu {
    id: number;
    name: string;
    group: string;
    groupIcon: keyof typeof LucideIconMap;
    path: string;
    icon: keyof typeof LucideIconMap;
    theme: string;
}
