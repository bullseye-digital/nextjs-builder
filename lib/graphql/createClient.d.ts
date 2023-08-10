import { ProjectConfig } from "@silverstripe/nextjs-toolkit";
interface ChunkedFetch {
    [key: string]: {
        nodes: Array<{
            [key: string]: unknown;
        }>;
        pageInfo: {
            hasNextPage: boolean;
        };
    };
}
export interface Variables {
    [key: string]: any;
}
declare const createClient: (projectConfig: ProjectConfig) => {
    query: (query: string, variables?: Variables) => Promise<any>;
    createChunkFetch: (queryStr: string, variables?: Variables) => () => Promise<ChunkedFetch | null>;
};
export default createClient;
