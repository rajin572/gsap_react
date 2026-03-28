"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import CircularBadge from "./CircleBadge";

const colors = [
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
];

const Practice = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRingRef = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        gsap.from(containerRef.current!.children, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.51,
        });

        // Continuously rotate the text ring
        gsap.to(textRingRef.current, {
            rotation: 360,
            duration: 8,
            ease: "none",
            repeat: -1,
            transformOrigin: "center center",
        });
    }, { scope: containerRef });

    return (
        <div>
            {/* <CircularBadge /> */}
            <div className="max-w-3xl mx-auto py-40 ">

                <p data-cursor="textview" className="text-4xl leading-tight hyphens-auto">
                    In this tutorial, you&apos;ll learn how to create a stunning *mask cursor
                    animation* using **Next.js**, **Tailwind CSS**, and **GSAP**. Perfect
                    for modern websites and UI projects!
                </p>
            </div>

            <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mb-5">
                {Array?.from({ length: 3 })?.map((_, index) => (
                    <div
                        data-cursor="view-card"
                        data-cursor-label={`Card ${index + 1}`}
                        className={`w-full h-40 rounded-3xl ${colors[index % colors.length]}`}
                        key={index}
                    ></div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
                {Array?.from({ length: 3 })?.map((_, index) => (
                    <div
                        data-cursor="view-card"
                        data-cursor-label={`Card ${index + 4}`}
                        className={`w-full h-40 rounded-3xl ${colors[index % colors.length]}`}
                        key={index}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Practice;
