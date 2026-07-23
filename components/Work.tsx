import SectionHead from "./SectionHead";
import WorkIndex from "./WorkIndex";
import { projects } from "../content/projects";

export default function Work() {
  return (
    <>
      <SectionHead label="Selected work" counter="03 · 2024–2026" />
      <WorkIndex projects={projects} />
    </>
  );
}
