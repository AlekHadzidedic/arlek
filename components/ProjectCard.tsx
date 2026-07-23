import Image from "next/image";
import type { Project } from "../content/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url || undefined}
      target={project.url ? "_blank" : undefined}
      rel={project.url ? "noopener noreferrer" : undefined}
      className="group flex cursor-pointer flex-col gap-2.5"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-md border border-line transition duration-200 group-hover:border-line-2 motion-safe:group-hover:-translate-y-0.5"
        style={{ background: `linear-gradient(135deg, ${project.from}, ${project.to})` }}
      >
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 92vw"
          className="object-cover"
        />
      </div>
      <h3 className="font-mono text-[0.9375rem] font-medium tracking-[-0.01em]">
        {project.name}
      </h3>
      <p className="text-[0.8125rem] leading-[1.45] text-fg-2">{project.desc}</p>
    </a>
  );
}
