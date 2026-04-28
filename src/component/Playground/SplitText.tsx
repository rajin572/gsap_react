"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useRef } from "react";

const SplitTextPractice = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    gsap.registerPlugin(SplitText);

    useGSAP(
        () => {
            const text = SplitText.create(".text", { type: "chars, words", });

            gsap.from(text.chars, {
                yPercent: "random([-100, 100])",
                xPercent: "random([-200, 200])",
                rotation: "random(-80, 80)",
                autoAlpha: 0,
                stagger: {
                    amount: 1,
                    from: "random",

                }
            });
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className=" py-40">
            <h1 className="text text-center text-6xl font-bold max-w-3xl mx-auto">
                Break apart HTML text into characters, words, and/or lines for easy
                animation{" "}
            </h1>
        </div>
    );
};

export default SplitTextPractice;
