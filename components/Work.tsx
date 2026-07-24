import SectionHead from "./SectionHead";
import WorkIndex from "./WorkIndex";
import { projects } from "../content/projects";

export default function Work() {
  return (
    // The case study's back-link points at `/#work`, so the section it returns
    // to has to be addressable. Without the id the link lands at the top of the
    // page and the reader has to find their place again.
    <div id="work" className="scroll-mt-4">
      <SectionHead label="Selected work" counter="03 · 2024–2026" />
      <WorkIndex projects={projects} />
    </div>
  );
}
