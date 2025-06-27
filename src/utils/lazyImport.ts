import { lazy } from "react";

const pageModules = import.meta.glob("/src/pages/**/*.tsx");

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
        file = capitalize(segments[1]);
    }

    const absolutePath = `/src/pages/${folder}/${file}.tsx`;

    const importer = pageModules[absolutePath] as () => Promise<{ default: React.ComponentType<any> }>;

    return lazy(importer);
};
