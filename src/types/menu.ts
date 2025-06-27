import { LucideIconMap } from "@/utils/dynamicIcon";

export interface Menu {
    id: number | string;
    name: string;
    group: string;
    groupIcon: keyof typeof LucideIconMap | null;
    path: string;
    icon: keyof typeof LucideIconMap;
    theme: string;
}
