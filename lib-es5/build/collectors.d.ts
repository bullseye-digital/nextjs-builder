interface StringMap {
    [key: string]: string;
}
export declare const createName: (absPath: string) => string;
export declare const collectTemplates: (baseDir: string) => StringMap;
export declare const collectQueries: (baseDir: string) => StringMap;
export declare const collectGetProps: (baseDir: string) => StringMap;
export declare const collectElementalBlocks: (baseDir: string, elementalDir: string) => StringMap;
export {};
