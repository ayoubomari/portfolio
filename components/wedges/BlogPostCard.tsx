import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import Image from "next/image";
import { fromYYYY_MM_DD_to_DD_month_YYYY } from "@/lib/converters/date";

export default function BlogPostCard({
  thumbnail,
  title,
  slug,
  summary,
  date,
}: {
  thumbnail?: string | null;
  title: string;
  slug: string;
  summary: string;
  date: string;
}) {
  return (
    <Card className="overflow-hidden border-primary">
      <Link href={`/blog/${slug}`}>
        <Image
          src={ thumbnail ? `/uploads/blog-posts-thumbnails/${thumbnail}` : "/assets/images/contents/thumbnail1.webp"}
          width={400}
          height={237}
          className="w-full object-cover"
          alt="Post thumbnail"
        />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="line-clamp-2 text-start font-bold leading-tight">
                {title}
              </h2>
              <p className="mr-2 mt-2 line-clamp-2 rounded text-xs text-gray-500 dark:text-gray-300">
                {summary}
              </p>
              <p className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-300">
                {fromYYYY_MM_DD_to_DD_month_YYYY(date)}
              </p>
            </div>
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
}
