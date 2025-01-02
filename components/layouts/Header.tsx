"use client";

import { useTheme } from "@/hooks/useTheme";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
library.add(faSun, faMoon);

export default function Header({
  mainPageIndex = -1,
}: {
  mainPageIndex?: number;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Header */}
      <header className="fixed z-50 w-full bg-gray-100 shadow-md dark:bg-slate-800 dark:text-gray-100">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/assets/images/icons/logo.webp"
              alt="logo"
              width={64}
              height={64}
              className="h-10 w-10"
            />
            <span className="cursor-pointer text-2xl font-bold">
              Ayoub Omari
            </span>
          </Link>
          <nav>
            {/* Desktop menu */}
            <ul className="hidden items-center justify-center gap-3 space-x-4 text-lg md:flex">
              <li
                className={`${mainPageIndex === 0 && "text-primary dark:text-purple-300"}`}
              >
                <Link href="/" className="cursor-pointer">
                  Home
                </Link>
              </li>
              <li
                className={`${mainPageIndex === 1 && "text-primary dark:text-purple-300"}`}
              >
                <Link href="/projects" className="cursor-pointer">
                  Projects
                </Link>
              </li>
              <li
                className={`${mainPageIndex === 2 && "text-primary dark:text-purple-300"}`}
              >
                <Link href="/blog" className="cursor-pointer">
                  Blog
                </Link>
              </li>
              <li
                className={`${mainPageIndex === 3 && "text-primary dark:text-purple-300"}`}
              >
                <Link href="/contact" className="cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <button
                  onClick={() => toggleTheme()}
                  className="ml-4 rounded-full p-2 transition-colors focus:outline-none"
                  aria-label="light/dark mode"
                >
                  <FontAwesomeIcon
                    icon={theme === "dark" ? "sun" : "moon"}
                    className="h-6 w-6"
                  />
                </button>
              </li>
            </ul>

            {/* Mobile menu */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => toggleTheme()}
                className="flex items-center space-x-2"
                aria-label="light/dark mode"
              >
                <FontAwesomeIcon
                  icon={theme === "dark" ? "sun" : "moon"}
                  className="h-6 w-6"
                />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="dropdown-menu"
                    variant="outline"
                    size="icon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gray-100 dark:bg-slate-800 dark:text-gray-100"
                >
                  <Link href="/">
                    <DropdownMenuItem
                      className={`cursor-pointer ${mainPageIndex === 0 && "text-primary dark:text-purple-300"}`}
                    >
                      Home
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/projects">
                    <DropdownMenuItem
                      className={`cursor-pointer ${mainPageIndex === 1 && "text-primary dark:text-purple-300"}`}
                    >
                      Projects
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/blog">
                    <DropdownMenuItem
                      className={`cursor-pointer ${mainPageIndex === 2 && "text-primary dark:text-purple-300"}`}
                    >
                      Blog
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/contact">
                    <DropdownMenuItem
                      className={`cursor-pointer ${mainPageIndex === 3 && "text-primary dark:text-purple-300"}`}
                    >
                      Contact
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </header>

      {/* seperator section */}
      <div className="h-[5.5rem] bg-gray-100 dark:bg-gray-900"></div>
    </>
  );
}
