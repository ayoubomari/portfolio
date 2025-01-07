"use client";
import { domAnimation, LazyMotion } from "framer-motion";
import MotionImage from "../ui/MotionImage";
import Image from "next/image";

export default function HeroImage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="order-1 my-20 flex w-full justify-center md:order-2 md:w-1/2 md:justify-end md:pr-14">
        <div className="relative">
          <div className="h-56 w-56 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600 md:h-64 md:w-64 lg:h-72 lg:w-72">
            <Image
              width={260}
              height={260}
              priority={true}
              src="/assets/images/people/avatar1_1.jpg"
              alt="Ayoub Omari Software Engineer"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating 3D icons */}
          <MotionImage
            width={50}
            height={50}
            src="/assets/images/illustrators/presentation.webp" // Use the path to Image 1
            alt="presentation"
            className="absolute -left-16 -top-12 h-16 w-16"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
          />
          <MotionImage
            width={50}
            height={50}
            src="/assets/images/illustrators/3d-computer.webp" // Use the path to Image 2
            alt="Desktop Development"
            className="absolute -right-16 top-4 h-16 w-16"
            animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <MotionImage
            width={50}
            height={50}
            src="/assets/images/illustrators/responsive-design.webp" // Use the path to Image 3
            alt="responsive design"
            className="absolute -bottom-1 -left-16 h-16 w-16"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <MotionImage
            width={50}
            height={50}
            src="/assets/images/illustrators/3d-target.webp" // Use the path to Image 3
            alt="3d target"
            className="sx absolute -bottom-16 -right-14 h-16 w-16"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </div>
    </LazyMotion>
  );
}
