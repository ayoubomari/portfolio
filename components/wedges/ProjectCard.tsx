import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader } from "../ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function ProjectCard({
  thumbnail,
  title,
  link,
  description,
}: {
  thumbnail?: string | null;
  title: string;
  link: string;
  description: string;
}) {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <Link href={link}>
        <Image
          src={ thumbnail ? `/uploads/projects-thumbnails/${thumbnail}` : "/assets/images/contents/thumbnail2.webp"}
          width={400}
          height={400}
          className="w-full rounded-lg object-cover"
          alt="Project Thumbnail"
        />
        <CardHeader className="px-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {description}
              </p>
            </div>
            <FontAwesomeIcon
              className="h-6 w-6 rounded-full bg-primary p-2 text-white dark:bg-purple-600"
              icon={faEye}
            />
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
}
