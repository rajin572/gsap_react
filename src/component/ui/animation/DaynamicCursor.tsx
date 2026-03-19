"use client";
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

const DaynamicCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const [cursorLabel, setCursorLabel] = useState("");
    const [blendMode, setBlendMode] = useState(false);

    const onHover = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
        if (!target) return;

        const type = target.dataset.cursor;
        const label = target.dataset.cursorLabel ?? "";

        if (type === "textview") {
            setBlendMode(true);
            gsap.to(cursorRef.current, {
                scale: 10,
                duration: 0.5,
                ease: "power3",
            });
        }
        else if (type === "view-card") {
            setCursorLabel(label);
            gsap.to(cursorRef.current, {
                scale: 5,
                duration: 0.5,
                ease: "power3",
            });
            gsap.to(labelRef.current, { fontWeight: 600, scale: 0.25, opacity: 1, duration: 0, ease: "power3" });

        }
        else if (type === "hide") {
            gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 });

        } else if (type === "link") {
            gsap.to(cursorRef.current, {
                border: "  1px solid rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                scale: 6,
                duration: 0,
                ease: "power3",
            });
        }
        //  else if (type === "view") {
        //     // Mask + label text
        //     setCursorLabel(label);
        //     gsap.to(cursorWrapperRef.current, {
        //         clipPath: "circle(50% at 50% 50%)",
        //         duration:0,
        //         ease: "power3.out",
        //     });
        //     gsap.to(".dc-label", { opacity: 1, duration: 0.25, delay: 0.2 });
        // } else if (type === "hide") {
        //     gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 });
        // }
    };

    const onHoverLeave = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
        if (!target) return;

        const type = target.dataset.cursor;

        if (type === "textview") {
            setBlendMode(false);
            gsap.to(cursorRef.current, {
                scale: 1,
                duration: 0.4,
                ease: "power3",
            });
        } else if (type === "view-card") {
            setCursorLabel("");
            gsap.to(labelRef.current, { opacity: 0, scale: 0, duration: 0 });
            gsap.to(cursorRef.current, {
                scale: 1,
                duration: 0.4,
                ease: "power3",
            });
        } else if (type === "hide") {
            gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 });
        } else if (type === "link") {
            gsap.to(cursorRef.current, {
                borderColor: "  0px solid rgba(255, 255, 255, 0)",
                backgroundColor: "rgba(255, 255, 255)",
                scale: 1,
                duration: 0,
                ease: "power3",
            });
        }
    };

    useEffect(() => {
        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

        const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3" });
        const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3" });

        const onMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseover", onHover);
        window.addEventListener("mouseout", onHoverLeave);


        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onHover);
            window.removeEventListener("mouseout", onHoverLeave);
        };
    });

    return (
        <div
            ref={cursorRef}
            className={`fixed top-0 left-0 size-3.5 rounded-full bg-white pointer-events-none z-9999 flex items-center justify-center ${blendMode ? "mix-blend-difference" : ""}`}
        >
            <p ref={labelRef} className="dc-label opacity-0 text-xs px-3 leading-snug select-none whitespace-nowrap text-black">
                {cursorLabel}
            </p>

        </div>
    );
};

export default DaynamicCursor;