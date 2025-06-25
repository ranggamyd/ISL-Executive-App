import { lazy } from "react";

export const lazyImport = (path: string) => {
    const segments = path.split("/").map(segment => segment.charAt(0).toUpperCase() + segment.slice(1));
    const importPath = `../pages/${segments.join("/")}`;

    return lazy(() => import(/* @vite-ignore */ importPath));
};
