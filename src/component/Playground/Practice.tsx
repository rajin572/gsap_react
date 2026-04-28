"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const IMAGES = [
    "https://bzm-graphics-2026.vercel.app/video/work-cycle.gif",
    "https://bzm-graphics-2026.vercel.app/portfolio/bb-mascara-01.png",
    "https://bzm-graphics-2026.vercel.app/portfolio/smakk-raquel.jpg",
    "https://bzm-graphics-2026.vercel.app/portfolio/floof-hero.png",
    "https://bzm-graphics-2026.vercel.app/portfolio/aziza-and-chineze.jpg",
    "https://bzm-graphics-2026.vercel.app/portfolio/veggie-loops.webp",
];

export default function Practice() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);



    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".scroll-card");

        const section = sectionRef.current;
        const container = containerRef.current;
        if (!section || !container) return;
        const containerWidth = container?.scrollWidth;
        const innerWidth = window?.innerWidth;

        const totalWidth = containerWidth - innerWidth;

        const scrollTrack = gsap.to(containerRef.current, {
            x: -totalWidth,
            duration: totalWidth / 1000,
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${totalWidth}`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                markers: true,
            }
        })

        cards.forEach((card) => {
            gsap.fromTo(
                card,
                { opacity: 0.7, y: "50%", scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "left 95%",
                        end: "center 90%",
                        scrub: true,
                        containerAnimation: scrollTrack,
                    },
                }
            );
        });

    }, { scope: sectionRef });


    return (
        <section
            ref={sectionRef}
            className="relative w-full"
            style={{ background: "inherit" }}
        >
            <div
                ref={containerRef}
                className="flex flex-nowrap items-center h-screen w-full"
                style={{ willChange: "transform" }}
            >
                {IMAGES.map((src, i) => (
                    // <Link
                    //     href={src}
                    //     target="_blank"
                    //     data-cursor-label={`Visit site `}
                    //     data-cursor="view-card"
                    //     key={i}
                    //     className="scroll-card flex-none w-screen h-full opacity-0"
                    //     style={{ willChange: "transform, opacity" }}
                    // >
                    <div
                        key={i}
                        className="scroll-card flex-none w-screen md:w-[50vw] h-full "
                    >
                        <Image
                            width={1000}
                            height={1000}
                            src={src}
                            alt={`Card ${i + 1}`}
                            sizes="(max-width: 768px) 80vw, 50vw"
                            className="w-full h-full object-cover"
                            draggable={false}
                            fetchPriority="high"
                            priority
                        />
                    </div>
                    // </Link>
                ))}
            </div>
        </section>
    );
}