import { useAuth } from "@/contexts/AuthContext";

export const useUserAccess = () => {
    const { permissions } = useAuth();

    const canAccess = (menu: string, access: string = "view"): boolean => {
        if (!permissions) return false;
        const found = permissions.find(p => p.menu === menu);
        return found?.access.includes(access) ?? false;
    };

    return { canAccess };
};
