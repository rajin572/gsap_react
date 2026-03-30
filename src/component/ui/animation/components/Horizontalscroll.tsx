"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
    "https://bzm-graphics-2026.vercel.app/portfolio/bb-mascara-01.png",
    "https://bzm-graphics-2026.vercel.app/portfolio/smakk-raquel.jpg",
    "https://bzm-graphics-2026.vercel.app/portfolio/floof-hero.png",
    "https://bzm-graphics-2026.vercel.app/portfolio/aziza-and-chineze.jpg",
    "https://bzm-graphics-2026.vercel.app/portfolio/veggie-loops.webp",
    "https://bzm-graphics-2026.vercel.app/video/work-cycle.gif",
];

export default function HorizontalScroll() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const container = containerRef.current;
        if (!section || !container) return;

        const cards = gsap.utils.toArray<HTMLElement>(".scroll-card");

        // totalScroll: push until last card fully exits left side of screen
        const totalScroll = container.scrollWidth - window.innerWidth;

        const scrollTrack = gsap.to(container, {
            x: -1 * totalScroll,
            duration: totalScroll,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${totalScroll}`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
            },
        });

        cards.forEach((card) => {
            gsap.fromTo(
                card,
                { opacity: 0.7 },
                {
                    opacity: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "left 95%",
                        end: "center 80%",
                        scrub: true,
                        containerAnimation: scrollTrack,
                    },
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden w-full h-screen"
            style={{ background: "inherit" }}
        >
            <div
                ref={containerRef}
                className="flex flex-nowrap items-center h-full w-full"
                style={{ willChange: "transform" }}
            >
                {IMAGES.map((src, i) => (
                    <div
                        data-cursor-label={`Visit site `}
                        data-cursor="view-card"
                        key={i}
                        className="scroll-card flex-none w-[50vw] h-full opacity-0"
                        style={{ willChange: "transform, opacity" }}
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
                ))}
            </div>
        </section>
    );
}