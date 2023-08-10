export interface QueryData {
    query: string | null;
    batchQuery: string | null;
}
export declare const extractPageQueries: (absPath: string) => QueryData;
