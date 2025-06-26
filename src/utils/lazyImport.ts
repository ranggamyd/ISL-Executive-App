import { lazy } from "react";

// export const lazyImport = (path: string) => {
//     const segments = path.split("/").map(segment => segment.charAt(0).toUpperCase() + segment.slice(1));
//     const importPath = `../pages/${segments.join("/")}`;

//     return lazy(() => import(/* @vite-ignore */ importPath));
// };

const capitalize = (pathName: string) => pathName.charAt(0).toUpperCase() + pathName.slice(1);

export const lazyImport = (path: string) => {
    const segments = path.split("/").filter(Boolean);

    let folder = "";
    let file = "";

    if (segments.length === 1) {
        folder = capitalize(segments[0]);
        file = folder;
    } else {
        folder = capitalize(segments[0]);
        file = capitalize(segments[segments.length - 1]);
    }

    const importPath = `../pages/${folder}/${file}`;

    return lazy(() => import(/* @vite-ignore */ importPath));
};
