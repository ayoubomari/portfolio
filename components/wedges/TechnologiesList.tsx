"use client";
import { technology } from "@/db/schema";
import Image from "next/image";
import { Card } from "../ui/card";
import Link from "next/link";
import { domAnimation, LazyMotion, m } from "framer-motion";


export default function TechnologiesList({ technologies }: { technologies: (typeof technology.$inferSelect)[] }) {
    return (
        <LazyMotion features={domAnimation}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {
                    technologies.map((technology, i) => (
                        <Link
                            href={technology.link ? technology.link : "#"}
                            target="_blank"
                            key={i}
                        >
                            <m.div
                                whileHover={{
                                    scale: [1, 1.1, 1], // Scale animation on hover
                                    rotate: [25, -25, 25, -25, 0], // Rotate from 45 to -45 degrees twice and return to 0
                                    transition: {
                                        duration: 0.4, // Faster animation duration
                                        ease: "easeInOut", // Smooth transition
                                    },
                                }}
                                id={`${technology.name.replace(".","-")}-${i}`}
                                onAnimationComplete={() => {
                                    // Reset the rotation to 0 when the hover animation ends
                                    const element = document.querySelector(`#${technology.name.replace(".","-")}-${i}`) as HTMLElement;
                                    if (element) {
                                        element.style.transform = 'rotate(0deg)';
                                    }
                                }}
                            >
                                <Card
                                    className="flex flex-col items-center justify-center gap-6 py-6 rounded-2xl dark:bg-gray-800"
                                    aria-label={technology.name}
                                >
                                    <Image
                                        src={technology.icon ? `/uploads/technologies-icons/${technology.icon}` : "/assets/images/contents/thumbnail2.webp"}
                                        alt={`${technology.name} icon`}
                                        width={72}
                                        height={72}
                                        className="h-auto"
                                    />
                                    <span>{technology.name}</span>
                                </Card>
                            </m.div>
                        </Link>
                    ))
                }
            </div>
        </LazyMotion>
    );
}