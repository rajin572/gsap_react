"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * CustomCursor — modern two-layer GSAP cursor
 *
 *  - dot   : accent-colored, snaps instantly, glows
 *  - ring  : smooth spring follow via gsap.quickTo
 *
 * Hover states (data attributes on any element):
 *  data-cursor="hover"          → ring expands with accent glow, dot hides
 *  data-cursor="view"           → ring becomes large pill with label text
 *  data-cursor="view" data-cursor-label="OPEN"  → custom label
 *  data-cursor="text"           → thin text-cursor bar
 *  data-cursor="drag"           → wide pill (drag affordance)
 *  data-cursor="hide"           → both layers invisible
 */

type CursorState = "default" | "hover" | "view" | "text" | "drag" | "hide";

const ACCENT = "#0ae448";

const CustomCursor = () => {
    const dotRef  = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const state = useRef<CursorState>("default");

    useLayoutEffect(() => {
        document.documentElement.style.cursor = "none";
        return () => { document.documentElement.style.cursor = ""; };
    }, []);

    useGSAP(() => {
        const dot   = dotRef.current!;
        const ring  = ringRef.current!;
        const label = labelRef.current!;

        // ── Ring: smooth spring follow via quickTo ─────────────────────
        const xTo = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
        const yTo = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });

        const moveDot = (e: MouseEvent) => {
            gsap.set(dot, { x: e.clientX, y: e.clientY });
            xTo(e.clientX);
            yTo(e.clientY);
        };

        // ── State machine ──────────────────────────────────────────────
        const applyState = (next: CursorState, labelText = "VIEW") => {
            if (state.current === next) return;
            state.current = next;

            // Reset defaults
            gsap.to(ring, {
                width: 36, height: 36,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.45)",
                backgroundColor: "rgba(255,255,255,0)",
                boxShadow: "none",
                borderRadius: "50%",
                opacity: 1,
                duration: 0.35,
                ease: "power3.out",
                overwrite: true,
            });
            gsap.to(dot, {
                width: 6, height: 6,
                backgroundColor: ACCENT,
                opacity: 1,
                scale: 1,
                duration: 0.25,
                ease: "power3.out",
                overwrite: true,
            });
            gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.15, overwrite: true });

            switch (next) {
                case "hover":
                    gsap.to(ring, {
                        width: 52, height: 52,
                        borderColor: "rgba(10,228,72,0.5)",
                        backgroundColor: "rgba(10,228,72,0.1)",
                        boxShadow: "0 0 18px 0 rgba(10,228,72,0.25)",
                        duration: 0.35,
                        ease: "power3.out",
                    });
                    gsap.to(dot, { opacity: 0, scale: 0, duration: 0.2 });
                    break;

                case "view":
                    if (label.textContent !== labelText) label.textContent = labelText;
                    gsap.to(ring, {
                        width: 80, height: 80,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.6)",
                        backgroundColor: "rgba(0,0,0,0.55)",
                        boxShadow: "0 0 0 0 transparent",
                        duration: 0.4,
                        ease: "back.out(1.4)",
                    });
                    gsap.to(dot, { opacity: 0, scale: 0, duration: 0.15 });
                    gsap.to(label, {
                        opacity: 1, scale: 1,
                        duration: 0.25,
                        delay: 0.1,
                        ease: "power2.out",
                    });
                    break;

                case "text":
                    gsap.to(ring, {
                        width: 2, height: 42,
                        borderWidth: 0,
                        backgroundColor: "rgba(255,255,255,0.85)",
                        borderRadius: 2,
                        duration: 0.25,
                        ease: "power3.out",
                    });
                    gsap.to(dot, { opacity: 0, scale: 0, duration: 0.15 });
                    break;

                case "drag":
                    gsap.to(ring, {
                        width: 70, height: 26,
                        borderColor: "rgba(255,255,255,0.75)",
                        borderRadius: 20,
                        duration: 0.3,
                        ease: "back.out(1.5)",
                    });
                    break;

                case "hide":
                    gsap.to([ring, dot], { opacity: 0, duration: 0.15 });
                    break;
            }
        };

        // ── Event delegation ───────────────────────────────────────────
        const onEnter = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
            const cursorType = (target?.dataset.cursor as CursorState) ?? "default";
            const cursorLabel = target?.dataset.cursorLabel ?? "VIEW";
            applyState(cursorType, cursorLabel);
        };

        const onLeave = (e: MouseEvent) => {
            if (!(e.relatedTarget as HTMLElement | null)?.closest("[data-cursor]")) {
                applyState("default");
            }
        };

        // ── Click ripple: ring pulses outward ──────────────────────────
        const onClick = () => {
            gsap.to(ring, {
                scale: 1.6,
                opacity: 0,
                duration: 0.45,
                ease: "power2.out",
                overwrite: false,
                onComplete: () => {
                    gsap.set(ring, { scale: 1, opacity: 1 });
                },
            });
            if (state.current !== "hover" && state.current !== "view") {
                gsap.fromTo(dot,
                    { scale: 1 },
                    { scale: 2, opacity: 0, duration: 0.35, ease: "power2.out",
                      onComplete: () => gsap.set(dot, { scale: 1, opacity: 1 }) }
                );
            }
        };

        window.addEventListener("mousemove", moveDot);
        document.addEventListener("mouseover", onEnter);
        document.addEventListener("mouseout", onLeave);
        window.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("mousemove", moveDot);
            document.removeEventListener("mouseover", onEnter);
            document.removeEventListener("mouseout", onLeave);
            window.removeEventListener("click", onClick);
        };
    });

    return (
        <>
            {/* ── Dot ─────────────────────────────────────────── */}
            <div
                ref={dotRef}
                aria-hidden
                style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: 6, height: 6,
                    borderRadius: "50%",
                    backgroundColor: ACCENT,
                    boxShadow: `0 0 10px 2px ${ACCENT}`,
                    pointerEvents: "none",
                    zIndex: 999999,
                    transform: "translate(-50%, -50%)",
                    willChange: "transform",
                }}
            />

            {/* ── Ring ─────────────────────────────────────────── */}
            <div
                ref={ringRef}
                aria-hidden
                style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: 36, height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.45)",
                    backgroundColor: "transparent",
                    pointerEvents: "none",
                    zIndex: 999998,
                    transform: "translate(-50%, -50%)",
                    willChange: "transform",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span
                    ref={labelRef}
                    aria-hidden
                    style={{
                        opacity: 0,
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                        fontFamily: "var(--font-geist-mono, monospace)",
                    }}
                >
                    VIEW
                </span>
            </div>
        </>
    );
};

export default CustomCursor;