import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import NewsLetter from "../forms/NewsLetter";
library.add(faLinkedin, faEnvelope, faGithub, faPhone);

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-primary pb-8 pt-12 text-gray-100 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div>
              <Link href="/" className="mb-4 flex items-center gap-1">
                <Image
                  src="/assets/images/icons/logo.webp"
                  alt="logo"
                  width={32}
                  height={32}
                />
                <h2 className="text-2xl font-bold">Ayoub Omari</h2>
              </Link>
              <p className="text-sm">
                Innovative Full Stack and Web3 Developer delivering efficient
                solutions and driving profitability. Let's collaborate to
                transform your ideas into reality.
              </p>
            </div>

            {/* Social Media Column */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Connect With Me</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  target="_blank"
                  href="https://www.linkedin.com/in/ayoub-omari-58140a1a4/"
                  className="flex items-center text-gray-100 hover:underline"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="mr-2 h-6 w-6" />
                  <span>LinkedIn</span>
                </Link>
                <Link
                  target="_blank"
                  href="https://github.com/ayoubomari/"
                  className="flex items-center text-gray-100 hover:underline"
                >
                  <FontAwesomeIcon icon={faGithub} className="mr-2 h-6 w-6" />
                  <span>GitHub</span>
                </Link>
                <Link
                  href="mailto:contact@ayoubomari.com"
                  className="flex items-center text-gray-100 hover:underline"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 h-6 w-6" />
                  <span>contact@ayoubomari.com</span>
                </Link>
                <Link
                  href="tel:+212632351553"
                  className="flex items-center text-gray-100 hover:underline"
                >
                  <FontAwesomeIcon icon={faPhone} className="mr-2 h-6 w-6" />
                  <span>+212 632 351 553</span>
                </Link>
              </div>
            </div>

            {/* Sitemap Column */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="cursor-pointer hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="cursor-pointer hover:underline"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="cursor-pointer hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="cursor-pointer hover:underline"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Form Column */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Stay Updated</h3>
              <p className="mb-2 text-sm">Track my innovation journey</p>
              <NewsLetter />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Ayoub Omari. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
