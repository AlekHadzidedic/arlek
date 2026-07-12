import SectionHead from "./SectionHead";
import ProjectCard from "./ProjectCard";
import { projects } from "../content/projects";

export default function Work() {
  return (
    <>
      <SectionHead label="Selected work" counter="03 · 2024–2026" />
      <section className="grid grid-cols-2 gap-3.5 px-5 pb-8 md:grid-cols-3 md:gap-[18px] md:px-10">
        {projects.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </section>
    </>
  );
}
