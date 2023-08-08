export declare const save: (key: string, content: any) => void;
export declare const saveJSON: (key: string, content: any) => void;
export declare const writeJSONFile: (name: string, content: any) => void;
export declare const clear: () => Promise<void>;
export declare const writeFile: (name: string, content: string) => void;
declare const _default: {
    save: (key: string, content: any) => void;
    saveJSON: (key: string, content: any) => void;
    clear: () => Promise<void>;
    writeFile: (name: string, content: string) => void;
    writeJSONFile: (name: string, content: any) => void;
};
export default _default;
