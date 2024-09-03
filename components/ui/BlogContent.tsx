import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypePrismPlus from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import "./../../public/assets/css/prismjs-themes/prism-coldark-dark.css";

interface BlogPostProps {
  content: string;
}

interface BlogPostProps {
  content: string;
}

export default function BlogContent({ content }: BlogPostProps) {
  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkParse, remarkGfm, remarkRehype]}
        rehypePlugins={[rehypeRaw, rehypePrismPlus]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
