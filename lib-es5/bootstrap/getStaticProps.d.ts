import { GetStaticProps } from "next";
import { ProjectState } from "@silverstripe/nextjs-toolkit";
declare const getStaticProps: (project: ProjectState) => GetStaticProps;
export default getStaticProps;
