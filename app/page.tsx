import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HeroImage from "@/components/wedges/HeroImage";
import ContactForm from "@/components/forms/ContactForm";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPhone,
  faEnvelope,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Tag from "@/components/ui/Tag";
import ProjectCard2 from "@/components/wedges/ProjectCard2";
library.add(faPhone, faEnvelope, faGithub, faLinkedin, faUpRightFromSquare);

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <>
      <Header mainPageIndex={0} />
      <main>
        {/* Hero Section */}
        <section className="bg-hero-light bg-cover bg-no-repeat text-gray-900 dark:bg-black dark:bg-hero-dark dark:text-gray-100 md:px-4 md:py-36">
          <div className="container mx-auto flex flex-col items-center px-4 md:flex-row">
            <div className="order-2 mb-8 w-full md:order-1 md:mb-0 md:w-1/2">
              <div className="mb-6 flex gap-4">
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
              <p className="mb-4 text-3xl font-bold md:text-4xl">
              Web3 & Full-Stack Developer | Crafting the Future 🚀
              </p>
              <h1 className="mb-6 text-lg md:text-xl">
              Bringing blockchain solutions and DeFi innovations to life with cutting-edge technologies. Let's collaborate! 🌟
              </h1>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/assets/pdfs/ayoub_omari_cv.pdf"
                  target="_blank"
                  className="w-full min-w-[13rem] sm:w-auto"
                >
                  <Button size="lg" className="w-full min-w-[13rem] sm:w-auto">
                    Download Resume
                  </Button>
                </Link>
                <Link
                  href="/contact"
                  className="w-full min-w-[13rem] sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full min-w-[13rem] sm:w-auto"
                  >
                    Say Hello 👋
                  </Button>
                </Link>
              </div>
            </div>
            <HeroImage />
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-gray-100 py-20 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
              Turning Ideas Into Impactful Applications. 💡
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col items-center px-6 py-9 text-center">
                <Image
                  src="/assets/images/icons/web-design.webp"
                  alt="Frontend Development"
                  width={50}
                  height={50}
                  className="mb-4"
                />
                <h3 className="mb-4 text-xl font-bold">
                  Frontend Development
                </h3>
                <p className="text-sm">
                I craft responsive and accessible user interfaces with clean, modular design principles, focusing on intuitive user experiences and modern web standards.</p>
              </Card>
              <Card className="flex flex-col items-center px-6 py-9 text-center">
                <Image
                  src="/assets/images/icons/serveur.webp"
                  alt="Backend Development"
                  width={50}
                  height={50}
                  className="mb-4"
                />
                <h3 className="mb-4 text-xl font-bold">Backend Development</h3>
                <p className="text-sm">
                I architect scalable and secure server solutions with clean code practices, implementing robust APIs and optimized database structures following industry standards.                </p>
              </Card>
              <Card className="flex flex-col items-center px-6 py-9 text-center">
                <Image
                  src="/assets/images/icons/smart-contract.webp"
                  alt="Web3 Development"
                  width={50}
                  height={50}
                  className="mb-4"
                />
                <h3 className="mb-4 text-xl font-bold">Web3 Development</h3>
                <p className="text-sm">
                  I develop smart contracts, create decentralized applications,
                  and leverage blockchain technologies for advanced web
                  solutions.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          className="py-20 text-gray-900 dark:bg-slate-700 dark:text-gray-100"
          id="projects"
        >
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
              Featured Projects 💻
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Project Cards */}
              {/* <ProjectCard
                link="#"
                thumbnail="project1.webp"
                title="Saas Landing Page"
                description="Website/Landing page"
              />
              <ProjectCard
                link="#"
                thumbnail="project2.webp"
                title="Saas Landing Page"
                description="Website/Landing page"
              />
              <ProjectCard
                link="#"
                thumbnail="project3.webp"
                title="Saas Landing Page"
                description="Website/Landing page"
              />
              <ProjectCard
                link="#"
                thumbnail="project1.webp"
                title="Saas Landing Page"
                description="Website/Landing page"
              /> */}
              <ProjectCard2
                thumbnail="lahagni_thumb.webp"
                slug="lahagni"
                title="Lahagni App"
                summary="A mobile app for driving sharing, where users can book rides, manage their vehicles, and submite proposals."
                technologies={["Golang", "Postgresql", "NextJS"]}
                // githubLink="https://www.github.com/ayoubomari"
                websiteLink="https://www.lahagni.com/"
              />
              <ProjectCard2
                thumbnail="arbitrage_thumb.webp"
                slug="algorand-arbitrage-bot"
                title="Algorand Arbitrage Bot"
                summary="A bot that automates the execution of arbitrage opportunities on Algorand, maximizing returns and minimizing risk."
                technologies={["NodeJS", "Typescript", "Pyteal"]}
                // githubLink="https://www.github.com/ayoubomari"
                websiteLink="https://allo.info/account/IMY4T476PRNOSCNNHDBLEOIEU3HOE6FM3VY6RFEJ7CQKWWOPZBATTXRXJM"
              />
              <ProjectCard2
                thumbnail="pacshare_thumb.webp"
                slug="pacshare-chat-bot"
                title="PacShare Chat Bot"
                summary="Facebook Messenger Chatbot that help people with limit internet access to fetch content from the web."
                technologies={["Golang", "Web-Scraping", "Chatbot"]}
                githubLink="https://github.com/ayoubomari/pacshare"
                websiteLink="https://www.facebook.com/pacshare1"
              />
              <ProjectCard2
                thumbnail="checkers_thumb.webp"
                slug="dame"
                title="Dame Game"
                summary="A desktop GUI game of checkers where players can play against each other or against the computer."
                technologies={["JAVA", "AWT", "Swing"]}
                githubLink="https://www.github.com/ayoubomari/dame"
                // websiteLink="https://www.google.com/"
              />
            </div>
            <Link href="/projects" className="mt-10 flex justify-center">
              <Button>
                View All Projects
                <FontAwesomeIcon icon={faUpRightFromSquare} className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-gray-100 py-20 dark:bg-gray-800" id="blog">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
              Skills & Technologies 🛠️
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <h3 className="mb-4 text-center text-xl font-bold">
                  Frontend and Mobile
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  <Tag text="Javascript" />
                  <Tag text="Typescript" />
                  <Tag text="React.js" />
                  <Tag text="Next.js" />
                  <Tag text="Tailwind CSS" />
                  <Tag text="Material UI" />
                  <Tag text="React Native" />
                  <Tag text="Responsive Design" />
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="mb-4 text-center text-xl font-bold">
                  Backend Prowess
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  <Tag text="Node.js" />
                  <Tag text="Express.js" />
                  <Tag text="Golang" />
                  <Tag text="Fiber" />
                  <Tag text="SQL" />
                  <Tag text="MongoDB" />
                  <Tag text="Docker" />
                  <Tag text="GraphQL" />
                  <Tag text="Redis" />
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="mb-4 text-center text-xl font-bold">
                  Blockchain & Web3
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  <Tag text="Algorand SDK" />
                  <Tag text="Pyteal" />
                  <Tag text="Beaker" />
                  <Tag text="AlgoKit" />
                  <Tag text="Smart Contract Development" />
                  <Tag text="Solidity" />
                  <Tag text="Web3.js" />
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 dark:bg-slate-600">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">
              Frequently Asked Questions 🤔
            </h2>
            <div className="grid gap-x-8 md:grid-cols-2">
              <Accordion
                type="single"
                collapsible
                className="mx-auto min-w-full max-w-2xl"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    What is your development process?
                  </AccordionTrigger>
                  <AccordionContent>
                    My development process follows an agile methodology,
                    emphasizing iterative development, continuous feedback, and
                    adaptability. I start with thorough planning and requirement
                    gathering, followed by design, development, testing, and
                    deployment phases. Regular check-ins and sprint reviews
                    ensure the project stays on track and meets your
                    expectations.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How do you handle project communication?
                  </AccordionTrigger>
                  <AccordionContent>
                    Clear and consistent communication is key to project
                    success. I use tools like Slack for daily updates,
                    Obsidian's Kanban or Jira for project management, and
                    schedule regular video calls for in-depth discussions.
                    You'll always be kept in the loop about project progress,
                    challenges, and milestones.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What makes you unique as a developer?
                  </AccordionTrigger>
                  <AccordionContent>
                    My unique blend of full-stack expertise, blockchain
                    knowledge, and mobile development skills allows me to create
                    comprehensive, cutting-edge solutions across various
                    platforms. I'm passionate about staying ahead of tech trends
                    and implementing best practices in security, scalability,
                    and user experience. My ability to bridge traditional and
                    emerging technologies enables me to tackle complex
                    challenges innovatively. My goal is always to deliver not
                    just code, but transformative digital experiences that make
                    a real impact."
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    How do you approach problem-solving in your projects?
                  </AccordionTrigger>
                  <AccordionContent>
                    I tackle problems systematically, breaking them down into
                    manageable components. I research thoroughly, consider
                    multiple solutions, and often prototype to test ideas before
                    implementation. I'm not afraid to seek input from colleagues
                    or the developer community when faced with complex
                    challenges.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="md:hidden">
                  <AccordionTrigger>
                    How do you stay updated with the latest technologies?
                  </AccordionTrigger>
                  <AccordionContent>
                    I dedicate time to continuous learning through online
                    courses, tech blogs, and participating in developer
                    communities. I also work on personal projects to experiment
                    with new technologies and attend industry conferences when
                    possible.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="md:hidden">
                  <AccordionTrigger>
                    How do you ensure the security of your applications?
                  </AccordionTrigger>
                  <AccordionContent>
                    Security is a top priority in my development process. I
                    follow best practices like input validation, encryption of
                    sensitive data, and regular security audits. I stay informed
                    about the latest security threats and implement appropriate
                    measures to protect against them.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7" className="md:hidden">
                  <AccordionTrigger>
                    What's your experience with cross-platform development?
                  </AccordionTrigger>
                  <AccordionContent>
                    I have extensive experience in cross-platform development,
                    particularly using React Native for mobile apps. I focus on
                    creating responsive designs and ensuring consistent
                    functionality across different devices and operating
                    systems.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8" className="md:hidden">
                  <AccordionTrigger>
                    What's your approach to code quality and maintenance?
                  </AccordionTrigger>
                  <AccordionContent>
                    I write clean, well-documented code following industry
                    standards and best practices. I use version control systems,
                    conduct regular code reviews, and implement automated
                    testing to ensure maintainability. I also focus on creating
                    modular, reusable components to improve efficiency in future
                    projects.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion
                type="single"
                collapsible
                className="mx-auto hidden min-w-full max-w-2xl md:block"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do you stay updated with the latest technologies?
                  </AccordionTrigger>
                  <AccordionContent>
                    I dedicate time to continuous learning through online
                    courses, tech blogs, and participating in developer
                    communities. I also work on personal projects to experiment
                    with new technologies and attend industry conferences when
                    possible.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How do you ensure the security of your applications?
                  </AccordionTrigger>
                  <AccordionContent>
                    Security is a top priority in my development process. I
                    follow best practices like input validation, encryption of
                    sensitive data, and regular security audits. I stay informed
                    about the latest security threats and implement appropriate
                    measures to protect against them.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What's your experience with cross-platform development?
                  </AccordionTrigger>
                  <AccordionContent>
                    I have extensive experience in cross-platform development,
                    particularly using React Native for mobile apps. I focus on
                    creating responsive designs and ensuring consistent
                    functionality across different devices and operating
                    systems.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    What's your approach to code quality and maintenance?
                  </AccordionTrigger>
                  <AccordionContent>
                    I write clean, well-documented code following industry
                    standards and best practices. I use version control systems,
                    conduct regular code reviews, and implement automated
                    testing to ensure maintainability. I also focus on creating
                    modular, reusable components to improve efficiency in future
                    projects.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          className="bg-gray-100 py-20 text-gray-900 dark:bg-slate-700 dark:text-gray-100"
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
