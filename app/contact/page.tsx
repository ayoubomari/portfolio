import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPhone,
  faEnvelope,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import ContactForm from "@/components/forms/ContactForm";
import { Metadata } from "next";
import { env } from "@/env";
library.add(faPhone, faEnvelope, faGithub, faLinkedin, faUpRightFromSquare);

export const metadata: Metadata = {
  title: "Contact Ayoub Omari - Full Stack Web3 Developer",
  description:
    "Get in touch with Ayoub Omari, a skilled Full Stack Web3 Developer with expertise in blockchain, e-commerce, and innovative web solutions.",
  keywords: [
    "Contact Ayoub Omari",
    "Full Stack Developer",
    "Web3 Developer",
    "Blockchain Expert",
    "E-commerce Developer",
    "Hire Developer",
    "Freelance Developer",
    "Moroccan Developer",
  ],
  authors: [{ name: "Ayoub Omari" }],
  openGraph: {
    title: "Contact Ayoub Omari - Full Stack Web3 Developer",
    description:
      "Reach out to Ayoub Omari for full-stack development, Web3, blockchain, and e-commerce projects. Let's collaborate on your next innovative solution.",
    url: `${env.NEXT_PUBLIC_SITE_URL}/contact`,
    siteName: "Ayoub Omari Portfolio",
    images: [
      {
        url: `${env.NEXT_PUBLIC_SITE_URL}/images/icons/icon.webp`,
        width: 1200,
        height: 630,
        alt: "Contact Ayoub Omari",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Ayoub Omari - Full Stack Web3 Developer",
    description:
      "Reach out to Ayoub Omari for full-stack development, Web3, blockchain, and e-commerce projects. Let's collaborate on your next innovative solution.",
    images: [`${env.NEXT_PUBLIC_SITE_URL}/images/icons/icon.webp`],
    creator: "@AyoubOmari01",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: `${env.NEXT_PUBLIC_SITE_URL}/contact`,
  },
};

export default function Contact() {
  return (
    <>
      <Header mainPageIndex={3} />
      <main>
        {/* Hero Section */}
        <section className="flex flex-col items-center bg-white bg-hero-light bg-cover bg-no-repeat pb-0 pt-16 text-gray-900 dark:bg-black dark:bg-hero-dark dark:text-gray-100 md:px-4 md:py-0">
          <div className="container mx-auto flex flex-col items-center px-4 md:flex-row md:justify-between">
            <div className="order-2 mb-8 flex flex-col items-start md:order-1 md:mb-0 md:w-1/2">
              <div className="order-3 mb-6 flex gap-4 md:order-1">
                <Link
                  href="https://www.linkedin.com/in/ayoub-omari-58140a1a4/"
                  target="_blank"
                  aria-label="LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
                </Link>
                <Link
                  href="https://github.com/ayoubomari/"
                  target="_blank"
                  aria-label="GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
                </Link>
                <Link href="mailto:contact@ayoubomari.com" aria-label="Email">
                  <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6" />
                </Link>
                <Link href="tel:+212632351553" aria-label="Phone">
                  <FontAwesomeIcon icon={faPhone} className="h-6 w-6" />
                </Link>
              </div>
              <p className="order-1 mb-4 text-3xl font-bold md:order-2 md:text-4xl">
                Let's Connect and Create Something Amazing 📨
              </p>
              <h1 className="order-2 mb-6 text-lg md:order-3 md:text-xl">
                Ready to bring your ideas to life? It's just a message away.
                Let's connect and create something amazing together. Reach out
                to start a conversation about your next project or idea today.
                💬
              </h1>
            </div>
            <div className="my-20 flex hidden w-full justify-center md:order-2 md:block md:max-w-md md:justify-end lg:max-w-lg">
              <Image
                width={600}
                height={600}
                src="/assets/images/contents/contact-illustration.webp"
                alt="contact illustration"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          className="bg-white py-20 text-gray-900 dark:bg-black dark:text-gray-100"
          id="contact"
        >
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-3xl font-bold">
              Let's have a chat 👋
            </h2>
            <div className="mb-10 flex flex-col items-center text-sm">
              <p className="max-w-2xl text-center">
                Your vision, my expertise – let's create something amazing
                together! Drop me a message and let's get started.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
