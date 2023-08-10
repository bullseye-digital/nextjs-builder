import { ProjectState } from "@silverstripe/nextjs-toolkit";
declare const createBulkQuery: ({ projectConfig }: ProjectState) => (query: string) => string | null;
export default createBulkQuery;
