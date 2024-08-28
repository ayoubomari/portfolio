import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Header />
      <main className="bg-light-gradient bg-fixed dark:bg-dark-gradient">
        {/* Hero Section */}
        <section className="container flex flex-col gap-8 md:justify-between md:items-center px-4 py-16 md:flex-row">
          <div className="order-2 md:order-1 md:min-w-[400px]">
            <h1 className="text-6xl font-bold hidden mb-6 md:block">
              Whooops!
            </h1>
            <p className=" hidden md:block mb-10">
              Sorry, the page that you are looking for does not exist.
            </p>
            <Link href="/">
              <Button size="lg" className="w-full md:w-auto">
                Go Home
              </Button>
            </Link>
          </div>

          <div className="order-1 md:order-2 md:max-w-[650px]">
            <div className="flex flex-col gap-2 text-center mb-8 md:hidden">
              <h1 className="text-3xl font-bold md:text-4xl">
                Whooops!
              </h1>
              <p className="text-lg md:text-xl">
                the page not found.
              </p>
            </div>

            <Image
              src="/assets/images/illustrators/404.svg"
              width={700}
              height={700}
              alt="404 illustration"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
