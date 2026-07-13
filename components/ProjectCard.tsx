import Image from "next/image";
import type { Project } from "../content/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a className="group flex cursor-pointer flex-col gap-2.5">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-md border border-line transition duration-200 group-hover:-translate-y-0.5 group-hover:border-line-2"
        style={{ background: `linear-gradient(135deg, ${project.from}, ${project.to})` }}
      >
        <Image src={project.image} alt={project.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
      </div>
      <div className="text-base font-semibold tracking-[-0.01em]">{project.name}</div>
      <div className="text-[13px] leading-[1.45] text-fg-2">{project.desc}</div>
    </a>
  );
}
