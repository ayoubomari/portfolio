import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEarth } from "@fortawesome/free-solid-svg-icons";

const colors: string[] = [
  "#0176B3",
  "#00712d",
  "#800000",
  "#673AB7",
  "#007677",
  "#3F51B5",
];

export default function ProjectCard2({
  thumbnail,
  title,
  slug,
  summary,
  technologies,
  githubLink,
  websiteLink,
}: {
  thumbnail?: string | null;
  title: string;
  slug: string;
  summary: string;
  technologies: string[];
  githubLink?: string | null;
  websiteLink?: string | null;
}) {
  return (
    <Card className="relative rounded-xl">
      <Link href={`/projects/${slug}`}>
        <div className="rounded-xl px-5 pt-5">
          <img
            src={
              thumbnail
                ? `/uploads/projects-thumbnails/${thumbnail}`
                : "/assets/images/contents/thumbnail2.webp"
            }
            className="w-full rounded-xl object-cover"
            alt={title}
            aria-label={title}
          />
        </div>
      </Link>

      <div className="absolute right-8 top-8 flex justify-end gap-2">
        {githubLink && (
          <Link href={githubLink} aria-label="source code" target="_blank">
            <FontAwesomeIcon
              icon={faGithub}
              className="h-4 w-4 rounded-full bg-gray-900 p-2 text-gray-100 hover:bg-primary"
            />
          </Link>
        )}
        {websiteLink && (
          <Link href={websiteLink} aria-label="website" target="_blank">
            <FontAwesomeIcon
              icon={faEarth}
              className="h-4 w-4 rounded-full bg-gray-900 p-2 text-gray-100 hover:bg-primary"
            />
          </Link>
        )}
      </div>
      <Link href={`/projects/${slug}`}>
        <CardHeader className="flex flex-col justify-between gap-1 px-5 py-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{summary}</p>
          <div className="flex flex-wrap gap-1">
            {technologies &&
              technologies.map((technology, i) => (
                <span key={i} style={{ color: colors[i % colors.length] }}>
                  #{technology}
                </span>
              ))}
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
}
