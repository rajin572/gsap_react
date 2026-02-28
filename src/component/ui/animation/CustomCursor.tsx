"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * CustomCursor
 *
 * A two-layer GSAP-powered cursor:
 *  - dot      : snaps exactly to the pointer (no lag)
 *  - ring     : follows with a smooth lag for a trailing effect
 *
 * Hover states (add these data attributes to any element):
 *  data-cursor="hover"    → ring expands + blends, dot hides
 *  data-cursor="text"     → ring turns into a thin text-select bar
 *  data-cursor="drag"     → ring stretches wide (drag affordance)
 *  data-cursor="hide"     → both layers invisible (e.g. over inputs)
 *
 * Usage:
 *   // In layout.tsx, render once outside <SmoothScroller>:
 *   <CustomCursor />
 *
 *   // In any component:
 *   <button data-cursor="hover">Click me</button>
 *   <p data-cursor="text">Some copy</p>
 */

type CursorState = "default" | "hover" | "text" | "drag" | "hide";

const RING_LAG = 0.12; // seconds — how far behind the ring trails

const CustomCursor = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    // Track raw mouse position without triggering re-renders
    const pos = useRef({ x: -100, y: -100 });
    const state = useRef<CursorState>("default");

    useLayoutEffect(() => {
        // Hide the native cursor globally
        document.documentElement.style.cursor = "none";
        return () => { document.documentElement.style.cursor = ""; };
    }, []);

    useGSAP(() => {
        const dot = dotRef.current!;
        const ring = ringRef.current!;

        // ── Dot: instant snap ──────────────────────────────────────────
        const moveDot = (e: MouseEvent) => {
            pos.current = { x: e.clientX, y: e.clientY };
            gsap.set(dot, { x: e.clientX, y: e.clientY });
        };

        // ── Ring: lagged follow using gsap.ticker ──────────────────────
        // We store the ring's "current" position and lerp it toward mouse
        const ringPos = { x: -100, y: -100 };

        const tick = () => {
            ringPos.x += (pos.current.x - ringPos.x) * (1 - Math.pow(1 - (1 / (RING_LAG * 60)), 1));
            ringPos.y += (pos.current.y - ringPos.y) * (1 - Math.pow(1 - (1 / (RING_LAG * 60)), 1));
            gsap.set(ring, { x: ringPos.x, y: ringPos.y });
        };

        gsap.ticker.add(tick);

        // ── State helpers ──────────────────────────────────────────────
        const applyState = (next: CursorState) => {
            if (state.current === next) return;
            state.current = next;

            // Reset to defaults first, then override
            gsap.to(ring, {
                width: 36,
                height: 36,
                borderWidth: 1.5,
                borderColor: "rgba(255,255,255,0.7)",
                backgroundColor: "transparent",
                mixBlendMode: "normal",
                opacity: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true,
            });
            gsap.to(dot, {
                width: 6,
                height: 6,
                opacity: 1,
                duration: 0.2,
                ease: "power2.out",
                overwrite: true,
            });

            switch (next) {
                case "hover":
                    gsap.to(ring, {
                        width: 56,
                        height: 56,
                        borderColor: "rgba(255,255,255,0)",
                        backgroundColor: "rgba(255,255,255,0.12)",
                        mixBlendMode: "difference",
                        duration: 0.35,
                        ease: "power2.out",
                    });
                    gsap.to(dot, { opacity: 0, width: 0, height: 0, duration: 0.2 });
                    break;

                case "text":
                    gsap.to(ring, {
                        width: 3,
                        height: 44,
                        borderWidth: 0,
                        backgroundColor: "rgba(255,255,255,0.9)",
                        borderRadius: 2,
                        duration: 0.25,
                        ease: "power2.out",
                    });
                    gsap.to(dot, { opacity: 0, duration: 0.15 });
                    break;

                case "drag":
                    gsap.to(ring, {
                        width: 72,
                        height: 28,
                        borderColor: "rgba(255,255,255,0.9)",
                        duration: 0.3,
                        ease: "back.out(1.5)",
                    });
                    break;

                case "hide":
                    gsap.to([ring, dot], { opacity: 0, duration: 0.15 });
                    break;
            }
        };

        // ── Event delegation via data-cursor ──────────────────────────
        const onEnter = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
            applyState((target?.dataset.cursor as CursorState) ?? "default");
        };

        const onLeave = (e: MouseEvent) => {
            const to = e.relatedTarget as HTMLElement | null;
            if (!to?.closest("[data-cursor]")) applyState("default");
        };

        // Click pulse on dot
        const onClick = () => {
            gsap.fromTo(dot,
                { scale: 1 },
                {
                    scale: 2.5, opacity: 0, duration: 0.4, ease: "power2.out",
                    onComplete: () => {
                        gsap.set(dot, { scale: 1, opacity: state.current === "hover" ? 0 : 1 });
                    }
                }
            );
        };

        window.addEventListener("mousemove", moveDot);
        document.addEventListener("mouseover", onEnter);
        document.addEventListener("mouseout", onLeave);
        window.addEventListener("click", onClick);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener("mousemove", moveDot);
            document.removeEventListener("mouseover", onEnter);
            document.removeEventListener("mouseout", onLeave);
            window.removeEventListener("click", onClick);
        };
    }, { scope: ringRef });

    return (
        <>
            {/* ── Dot ─────────────────────────────────────────────────── */}
            <div
                ref={dotRef}
                aria-hidden
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    pointerEvents: "none",
                    zIndex: 999999,
                    transform: "translate(-50%, -50%)",
                    willChange: "transform",
                }}
            />

            {/* ── Ring ─────────────────────────────────────────────────── */}
            <div
                ref={ringRef}
                aria-hidden
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(255,255,255,0.7)",
                    backgroundColor: "transparent",
                    pointerEvents: "none",
                    zIndex: 999998,
                    transform: "translate(-50%, -50%)",
                    willChange: "transform",
                }}
            />
        </>
    );
};

export default CustomCursor;