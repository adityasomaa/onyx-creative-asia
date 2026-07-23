"use client";

import Link from "next/link";
import ProjectCover from "@/components/ProjectCover";
import {
  serviceSlugByTitle,
  serviceTagsForProject,
  type Project,
} from "@/lib/data";

/**
 * One project in any works loop (home, /works, related work on a service
 * page). The heading is just the brand name; the services that project
 * used render underneath as pill tags, each linking to /works filtered by
 * that service.
 *
 * The tags sit OUTSIDE the card's <Link> on purpose — nesting anchors is
 * invalid HTML and breaks keyboard navigation.
 */
export default function WorkCard({
  project,
  sizes = "(min-width: 768px) 50vw, 100vw",
  className,
}: {
  project: Project;
  sizes?: string;
  className?: string;
}) {
  const tags = serviceTagsForProject(project);

  return (
    <div className={className}>
      <Link
        href={`/works/${project.slug}`}
        className="group block"
        data-cursor="hover"
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink">
          <ProjectCover
            src={project.cover}
            loop={project.coverLoop}
            alt={project.client}
            sizes={sizes}
          />
          <div className="absolute inset-0 rounded-2xl bg-ink/0 transition-colors duration-700 group-hover:bg-ink/10 z-10" />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-medium tracking-tight">
            {project.client}
          </h3>
          <span
            aria-hidden
            className="text-xl transition-transform duration-700 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            ↗
          </span>
        </div>
      </Link>

      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const slug = serviceSlugByTitle(tag);
            if (!slug) return null;
            return (
              <li key={tag}>
                <Link
                  href={`/works?service=${slug}`}
                  className="inline-flex rounded-full border border-hairline px-3 py-1 text-xs tracking-tight text-ink/70 transition-colors duration-300 hover:border-ink/40 hover:bg-ink hover:text-bone"
                >
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
