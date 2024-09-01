import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faProjectDiagram,
  faBlog,
  faTags,
  faLaptopCode,
  faEnvelope,
  faComments,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions";

interface MenuItem {
  icon: IconDefinition;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: faHome, label: "Home", href: "/dashboard/" },
  { icon: faLaptopCode, label: "Projects", href: "/dashboard/projects" },
  { icon: faBlog, label: "Blog posts", href: "/dashboard/blog-posts" },
  { icon: faTags, label: "Tags", href: "/dashboard/tags" },
  {
    icon: faProjectDiagram,
    label: "Technologies",
    href: "/dashboard/technologies",
  },
  { icon: faEnvelope, label: "Emails", href: "/dashboard/emails" },
  { icon: faComments, label: "Messages", href: "/dashboard/messages" },
];

export default function Sidebar() {
  return (
    <aside className="top-22 md:top-22 fixed left-0 flex min-h-full w-14 flex-col overflow-y-auto bg-white pt-6 dark:bg-gray-800 md:w-52">
      {/* <div className="flex items-center p-4 sticky top-0 bg-white dark:bg-gray-800 z-50">
        <Image src="/assets/images/icons/logo.webp" alt="Ayoub Omari logo" className="h-8 w-auto" width={32} height={32} />
        <span className="ml-4 hidden md:inline">Dashboard</span>
      </div> */}
      <nav>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center p-4 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
            <span className="ml-4 hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="pt-6">
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-400 dark:hover:text-red-800"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
            <span className="ml-4 hidden md:inline">Logout</span>
          </Button>
        </form>
      </div>
    </aside>
  );
}
