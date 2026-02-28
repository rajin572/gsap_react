"use client";

// app/page.tsx  — example page demonstrating ScrollSmoother features
//
// data-speed="0.5"   → moves at half scroll speed (parallax slower)
// data-speed="1.5"   → moves at 1.5x scroll speed (parallax faster)
// data-speed="clamp(0.5)" → same as 0.5 but clamps so it never scrolls
//                           off-screen at the start/end
// data-lag="0.3"     → element "lags" behind scroll by 0.3 seconds
//
// ScrollTrigger.create() → pin, scrub, toggle classes, etc.

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useSmoother } from "../ui/animation/SmoothScroller";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Banner() {
    const containerRef = useRef<HTMLDivElement>(null);
    const smoother = useSmoother(); // access the smoother instance from context

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // ── Pin an element when it reaches the center ──────────────────
            ScrollTrigger.create({
                trigger: "#pinned-box",
                pin: true,
                start: "center center",
                end: "+=400",
            });

            // ── Scrub a heading's opacity as you scroll ────────────────────
            gsap.fromTo(
                "#fade-heading",
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: "#fade-heading",
                        start: "top 80%",
                        end: "top 40%",
                        scrub: 1,
                    },
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Jump to an element using the smoother instance
    const scrollToShape = () => {
        smoother?.scrollTo("#pinned-box", true, "center center");
    };

    return (
        <main ref={containerRef} className="relative">

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section className="flex flex-col items-center justify-center h-screen text-white">
                <h1 className="text-6xl font-bold">ScrollSmoother</h1>
                <button
                    onClick={scrollToShape}
                    className="mt-6 px-6 py-2 bg-white text-black rounded-full"
                >
                    Jump to pinned box
                </button>
            </section>

            {/* ── Parallax boxes ─────────────────────────────────────────── */}

            {/* Slower than scroll speed */}
            <div
                data-speed="clamp(0.5)"
                className="absolute left-1/4 top-[400px] w-24 h-24 bg-pink-400 rounded-xl flex items-center justify-center text-white font-bold"
            >
                0.5×
            </div>

            {/* Slightly slower */}
            <div
                data-speed="clamp(0.8)"
                className="absolute left-1/2 -translate-x-1/2 top-[900px] w-24 h-24 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold"
            >
                0.8×
            </div>

            {/* Faster than scroll speed — flies upward */}
            <img
                data-speed="1.5"
                src="https://assets.codepen.io/16327/2D-keyframe-2.png"
                alt="parallax shape"
                className="absolute left-1/2 -translate-x-1/2 top-[1300px] w-24 h-24"
            />

            {/* ── Lagging element ────────────────────────────────────────── */}
            <div
                data-lag="0.4"
                className="absolute right-16 top-[700px] w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center text-white text-xs text-center"
            >
                lag 0.4s
            </div>

            {/* ── Pinned box (ScrollTrigger pin) ─────────────────────────── */}
            <section
                id="pinned-box"
                className="flex items-center justify-center h-screen"
            >
                <div className="w-40 h-40 bg-yellow-400 rounded-2xl flex items-center justify-center text-black font-bold text-lg">
                    Pinned!
                </div>
            </section>

            {/* ── Scrubbed fade heading ───────────────────────────────────── */}
            <section className="flex items-center justify-center h-screen">
                <h2 id="fade-heading" className="text-5xl font-bold text-white opacity-0">
                    Scrubbed Fade
                </h2>
            </section>

            {/* Spacer so we can scroll past the last section */}
            <div className="h-screen" />
        </main>
    );
}