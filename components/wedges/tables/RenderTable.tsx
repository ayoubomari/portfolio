import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProjectTable from '@/components/wedges/tables/ProjectsTable';
import BlogPostTable from '@/components/wedges/tables/BlogPostTable';
import NewsletterTable from '@/components/wedges/tables/NewsletterTable';
import ContactFormTable from '@/components/wedges/tables/ContactFormTable';
import TagTable from '@/components/wedges/tables/TagTable';
import TechnologyTable from '@/components/wedges/tables/TechnologyTable';

interface TableProps<T> {
  title: string;
  button: { link: string; callToAction: string };
  data: T[];
  tableType: 'project' | 'blogPost' | 'newsletter' | 'contactForm' | 'tag' | 'technology';
}

function RenderTable<T>({ title, button, data, tableType }: TableProps<T>) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {tableType === 'project' && <ProjectTable projects={data as any[]} />}
      {tableType === 'blogPost' && <BlogPostTable blogPosts={data as any[]} />}
      {tableType === 'newsletter' && <NewsletterTable entries={data as any[]} />}
      {tableType === 'contactForm' && <ContactFormTable entries={data as any[]} />}
      {tableType === 'tag' && <TagTable tags={data as any[]} />}
      {tableType === 'technology' && <TechnologyTable technologies={data as any[]} />}
      <div className="mt-8 flex justify-center">
        <Link href={button.link}>
          <Button>{button.callToAction}</Button>
        </Link>
      </div>
    </div>
  );
}

export default RenderTable;