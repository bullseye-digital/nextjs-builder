import { ProjectState } from "@silverstripe/nextjs-toolkit";
declare const createGetQueryForType: ({ cacheManifest: { queryManifest, typeAncestry } }: ProjectState) => (type: string) => string | null;
export default createGetQueryForType;
