"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(useGSAP);


// ─────────────────────────────────────────────
// 1. WHAT gsap.from() DOES
// ─────────────────────────────────────────────
const BasicFromDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        gsap.set(".basic-from-box", { clearProps: "all" });
        gsap.from(".basic-from-box", {
            x: -150,
            opacity: 0,
            scale: 0.5,
            duration: 0.9,
            ease: "power3.out",
        });
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".basic-from-box");
        gsap.set(".basic-from-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="1. what gsap.from() does"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from(target, vars)</code> reads the
                    element&apos;s <strong className="text-zinc-200">current CSS position as the end state</strong> and
                    animates <em>from</em> the values you specify back to that position.
                    <br /><br />
                    The element starts at <code className="text-secondary bg-zinc-800 px-1 rounded">x:-150, opacity:0, scale:0.5</code> (the values you wrote),
                    then travels back to its natural CSS state — wherever it sits in the document flow.
                    <br /><br />
                    This is the <strong className="text-zinc-200">opposite of gsap.to()</strong>:
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">to()</code> — current state <strong className="text-zinc-200">→</strong> your values
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">from()</code> — your values <strong className="text-zinc-200">→</strong> current state
                </>
            }
            pros={[
                "End state is always the natural CSS position — resilient to layout changes",
                "No need to define where the element ends up — CSS handles it",
                "Perfect for entrance animations on page load or scroll",
            ]}
            cons={[
                "End state depends on current DOM/CSS — stale inline styles break it",
                "Re-triggering without clearProps causes compounding transform bugs",
            ]}
            code={`// gsap.from() animates FROM your values → TO the element's CSS state
gsap.from(".box", {
  x: -150,       // starts 150px to the left
  opacity: 0,    // starts invisible
  scale: 0.5,    // starts at half size
  duration: 0.9,
  ease: "power3.out",
  // ends at: x:0, opacity:1, scale:1  ← whatever CSS defines
});

// Always clear GSAP's inline styles before re-running
gsap.set(".box", { clearProps: "all" });
gsap.from(".box", { x: -150, opacity: 0, duration: 0.9 });`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="bg-zinc-900 rounded-xl h-20 flex items-center justify-center overflow-hidden">
                    <div className="basic-from-box w-16 h-14 rounded-xl bg-secondary flex items-center justify-center text-black font-bold text-sm">
                        Box
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Play</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 2. ENTRANCE ANIMATIONS
// ─────────────────────────────────────────────
const EntranceDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState("fade");
    const { contextSafe } = useGSAP({ scope: containerRef });

    const entrances: Record<string, gsap.TweenVars> = {
        fade:      { opacity: 0, duration: 0.7, ease: "power2.out" },
        slideLeft: { x: -100, opacity: 0, duration: 0.7, ease: "power3.out" },
        slideUp:   { y: 60, opacity: 0, duration: 0.7, ease: "power3.out" },
        scaleUp:   { scale: 0.4, opacity: 0, duration: 0.7, ease: "back.out(1.7)" },
        rotateIn:  { rotation: -90, opacity: 0, transformOrigin: "left center", duration: 0.7, ease: "power3.out" },
        elastic:   { scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1, 0.4)" },
    };

    const play = contextSafe(() => {
        gsap.set(".entrance-box", { clearProps: "all" });
        gsap.from(".entrance-box", entrances[active]);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".entrance-box");
        gsap.set(".entrance-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="2. entrance animations"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from()</code> is the standard
                    tool for entrance animations — you define <strong className="text-zinc-200">where the element comes from</strong>,
                    and GSAP uses the element&apos;s natural CSS position as the destination automatically.
                    <br /><br />
                    You never need to define the end state. This means the animation always lands at the correct
                    final position even if layout shifts or the component re-renders.
                    <br /><br />
                    Common patterns:
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">{"{ opacity: 0 }"}</code> — fade in
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">{"{ x: -100, opacity: 0 }"}</code> — slide in from left
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">{"{ scale: 0, opacity: 0 }"}</code> — scale up
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">{"{ y: 60, opacity: 0 }"}</code> — rise up
                </>
            }
            pros={[
                "End state is always the natural CSS state — resilient to layout changes",
                "No need to reset after animation — the element ends at its correct CSS position",
                "Pairs naturally with ScrollTrigger for scroll-driven entrances",
            ]}
            cons={[
                "If the element has stale GSAP inline styles, from() lands on those, not CSS",
                "Multiple re-triggers without clearProps compound the inline styles",
            ]}
            code={`// Fade in
gsap.from(".box", { opacity: 0, duration: 0.7 });

// Slide in from left
gsap.from(".box", { x: -100, opacity: 0, duration: 0.7, ease: "power3.out" });

// Rise up
gsap.from(".box", { y: 60, opacity: 0, duration: 0.7, ease: "power3.out" });

// Scale up with spring
gsap.from(".box", { scale: 0.4, opacity: 0, duration: 0.7, ease: "back.out(1.7)" });

// Elastic pop
gsap.from(".box", { scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1, 0.4)" });

// With ScrollTrigger (entrance on scroll)
gsap.from(".box", {
  y: 60, opacity: 0, duration: 0.8,
  scrollTrigger: { trigger: ".box", start: "top 80%" },
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="bg-zinc-900 rounded-xl h-24 flex items-center justify-center">
                    <div className="entrance-box w-20 h-16 rounded-xl bg-secondary flex items-center justify-center text-black font-bold text-sm">
                        Element
                    </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {Object.keys(entrances).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActive(key)}
                            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${active === key ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}
                        >
                            {key}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Play</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 3. autoAlpha
// ─────────────────────────────────────────────
const AutoAlphaDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const showOpacity = contextSafe(() => {
        gsap.set(".opacity-box", { opacity: 0 });
        gsap.to(".opacity-box", { opacity: 1, duration: 0.8, ease: "power2.out" });
    });

    const hideOpacity = contextSafe(() => {
        gsap.to(".opacity-box", { opacity: 0, duration: 0.8 });
    });

    const showAutoAlpha = contextSafe(() => {
        gsap.set(".alpha-box", { autoAlpha: 0 });
        gsap.to(".alpha-box", { autoAlpha: 1, duration: 0.8, ease: "power2.out" });
    });

    const hideAutoAlpha = contextSafe(() => {
        gsap.to(".alpha-box", { autoAlpha: 0, duration: 0.8 });
    });

    return (
        <DemoCard
            label="3. autoAlpha"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">opacity: 0</code> makes an element
                    invisible but it&apos;s still <strong className="text-zinc-200">in the tab order, receives pointer events,
                    and occupies layout space</strong>.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">autoAlpha</code> is a GSAP shorthand
                    that combines <code className="text-secondary bg-zinc-800 px-1 rounded">opacity</code> and{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">visibility</code>:
                    <br />
                    — <code className="text-secondary bg-zinc-800 px-1 rounded">autoAlpha: 0</code> → <code className="text-secondary bg-zinc-800 px-1 rounded">opacity:0</code> + <code className="text-secondary bg-zinc-800 px-1 rounded">visibility:hidden</code>
                    <br />
                    — <code className="text-secondary bg-zinc-800 px-1 rounded">autoAlpha: 1</code> → <code className="text-secondary bg-zinc-800 px-1 rounded">opacity:1</code> + <code className="text-secondary bg-zinc-800 px-1 rounded">visibility:visible</code>
                    <br /><br />
                    Also solves the <strong className="text-zinc-200">FOUC problem</strong>: set{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">visibility:hidden</code> in CSS,
                    then use <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from(el, {"{ autoAlpha: 0 }"})</code> —
                    the element is invisible before GSAP runs.
                </>
            }
            pros={[
                "Removes element from tab order and pointer events when fully hidden",
                "Solves FOUC — set visibility:hidden in CSS, reveal with autoAlpha",
                "Single property controls both opacity and visibility together",
            ]}
            cons={[
                "Only available in GSAP — not a real CSS property",
                "visibility:hidden still occupies layout space (unlike display:none)",
            ]}
            code={`// ❌ opacity alone — invisible but still focusable
gsap.to(".box", { opacity: 0, duration: 0.8 });

// ✅ autoAlpha — truly hidden (no pointer events, no tab order)
gsap.to(".box",  { autoAlpha: 0, duration: 0.8 });
gsap.from(".box", { autoAlpha: 0, duration: 0.8 });

// FOUC fix:
// CSS: .box { visibility: hidden; }
gsap.from(".box", { autoAlpha: 0, y: 30, duration: 0.8 });
// GSAP sees visibility:hidden → autoAlpha starts at 0
// → sets visibility:visible once opacity > 0`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">opacity</p>
                        <div className="bg-zinc-900 rounded-xl h-16 flex items-center justify-center">
                            <div className="opacity-box w-12 h-12 rounded-lg bg-sky-400" />
                        </div>
                        <div className="flex gap-1.5">
                            <button onClick={showOpacity} className="flex-1 px-2 py-1 rounded bg-zinc-700 text-white text-[11px]">Show</button>
                            <button onClick={hideOpacity} className="flex-1 px-2 py-1 rounded bg-zinc-700 text-white text-[11px]">Hide</button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">autoAlpha</p>
                        <div className="bg-zinc-900 rounded-xl h-16 flex items-center justify-center">
                            <div className="alpha-box w-12 h-12 rounded-lg bg-secondary" />
                        </div>
                        <div className="flex gap-1.5">
                            <button onClick={showAutoAlpha} className="flex-1 px-2 py-1 rounded bg-zinc-700 text-white text-[11px]">Show</button>
                            <button onClick={hideAutoAlpha} className="flex-1 px-2 py-1 rounded bg-zinc-700 text-white text-[11px]">Hide</button>
                        </div>
                    </div>
                </div>
                <p className="text-zinc-600 text-[11px] font-mono">After hiding, try tabbing — autoAlpha box is unreachable.</p>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. clearProps
// ─────────────────────────────────────────────
const ClearPropsDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const playWithout = contextSafe(() => {
        gsap.from(".no-clear", { x: -100, opacity: 0, scale: 0.5, duration: 0.7, ease: "power3.out" });
    });

    const playWith = contextSafe(() => {
        gsap.set(".with-clear", { clearProps: "all" });
        gsap.from(".with-clear", { x: -100, opacity: 0, scale: 0.5, duration: 0.7, ease: "power3.out" });
    });

    return (
        <DemoCard
            label="4. clearProps"
            theory={
                <>
                    When GSAP animates an element it writes <strong className="text-zinc-200">inline styles</strong> onto
                    the DOM node. These persist after the tween completes.
                    <br /><br />
                    The next time you run <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from()</code>, GSAP
                    reads those leftover inline styles as the current state — so the animation ends in the wrong place.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.set(el, {"{ clearProps: 'all' }"})</code> wipes
                    all GSAP inline styles, restoring the element to its pure CSS state before re-animating.
                    <br /><br />
                    You can also clear specific props only:{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">{"{ clearProps: 'x,opacity' }"}</code>
                </>
            }
            pros={[
                "Guarantees from() always starts from a clean CSS-defined state",
                "Essential when re-triggering entrance animations (e.g. on scroll re-entry)",
                "Can clear specific props only — preserves intentional inline overrides",
            ]}
            cons={[
                "Forgetting clearProps on repeated animations causes compounding transform bugs",
                "clearProps:'all' removes ALL inline styles — be specific if others must persist",
            ]}
            code={`// ❌ Without clearProps — second play starts from wrong inline styles
gsap.from(".box", { x: -100, opacity: 0, duration: 0.7 });
// trigger again → leftover transform on DOM → animation is broken

// ✅ With clearProps — always clean CSS baseline
gsap.set(".box", { clearProps: "all" });
gsap.from(".box", { x: -100, opacity: 0, duration: 0.7 });

// Clear only specific properties
gsap.set(".box", { clearProps: "x,opacity" });

// Or clean up automatically after the animation completes
gsap.from(".box", {
  x: -100, opacity: 0, duration: 0.7,
  onComplete: () => gsap.set(".box", { clearProps: "all" }),
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">without clearProps</p>
                        <div className="bg-zinc-900 rounded-xl h-16 flex items-center justify-center overflow-hidden">
                            <div className="no-clear w-12 h-12 rounded-lg bg-red-400" />
                        </div>
                        <button onClick={playWithout} className="px-2 py-1 rounded bg-red-900/50 border border-red-700/40 text-red-300 text-[11px] font-mono">
                            Play again (broken)
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">with clearProps</p>
                        <div className="bg-zinc-900 rounded-xl h-16 flex items-center justify-center overflow-hidden">
                            <div className="with-clear w-12 h-12 rounded-lg bg-secondary" />
                        </div>
                        <button onClick={playWith} className="px-2 py-1 rounded bg-emerald-900/50 border border-emerald-700/40 text-emerald-300 text-[11px] font-mono">
                            Play again (correct)
                        </button>
                    </div>
                </div>
                <p className="text-zinc-600 text-[11px] font-mono">Click each button multiple times to see the difference.</p>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 5. immediateRender
// ─────────────────────────────────────────────
const ImmediateRenderDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<"default" | "false">("default");
    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        gsap.killTweensOf([".ir-default", ".ir-false"]);
        gsap.set([".ir-default", ".ir-false"], { clearProps: "all" });

        if (mode === "default") {
            // immediateRender: true (default) — start values jump in IMMEDIATELY
            // even though the tween has a 0.8s delay
            gsap.from(".ir-default", {
                x: -120, opacity: 0,
                duration: 0.8, delay: 0.8,
                ease: "power3.out",
                // immediateRender: true  ← this is the default
            });
        } else {
            // immediateRender: false — element stays at CSS position during delay
            // only jumps to from-values right when the tween actually starts
            gsap.from(".ir-false", {
                x: -120, opacity: 0,
                duration: 0.8, delay: 0.8,
                ease: "power3.out",
                immediateRender: false,
            });
        }
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf([".ir-default", ".ir-false"]);
        gsap.set([".ir-default", ".ir-false"], { clearProps: "all" });
    });

    const descriptions: Record<typeof mode, string> = {
        default: "immediateRender: true (default) — the box JUMPS to x:-120, opacity:0 BEFORE the delay starts. Flash of incorrect state during the 0.8s wait.",
        false: "immediateRender: false — the box stays visible at its CSS position during the 0.8s delay, then slides in normally. No flash.",
    };

    return (
        <DemoCard
            label="5. immediateRender"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from()</code> defaults to{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">immediateRender: true</code> — meaning
                    the <strong className="text-zinc-200">from-values are applied instantly</strong> at time=0, even before
                    a <code className="text-secondary bg-zinc-800 px-1 rounded">delay</code> elapses.
                    <br /><br />
                    This causes a <strong className="text-zinc-200">Flash of Unstyled Content (FOUC)</strong>: the element
                    jumps to <code className="text-secondary bg-zinc-800 px-1 rounded">opacity:0 / x:-120</code> the moment the
                    tween is created, then sits there invisibly until the delay passes.
                    <br /><br />
                    Fix: set <code className="text-secondary bg-zinc-800 px-1 rounded">immediateRender: false</code> — the element
                    keeps its CSS state during the delay and only snaps to the from-values when the animation actually begins.
                    <br /><br />
                    Note: <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code> defaults to{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">immediateRender: false</code> — this is a{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">from()</code>-specific gotcha.
                </>
            }
            pros={[
                "immediateRender: true prevents layout flicker on page-load entrance animations",
                "immediateRender: false is essential for delayed from() animations — no FOUC",
                "Understanding this difference prevents the most common gsap.from() bug",
            ]}
            cons={[
                "The default (true) causes FOUC when delay > 0 — easy to miss",
                "fromTo() defaults immediateRender to true for the from-state too — same gotcha",
            ]}
            code={`// ❌ FOUC — box flashes to x:-120, opacity:0 immediately,
//    then sits invisible for 0.8s before animating
gsap.from(".box", {
  x: -120, opacity: 0,
  duration: 0.8, delay: 0.8,
  // immediateRender: true  ← default
});

// ✅ No FOUC — box stays at CSS position during delay,
//    snaps to from-values only when animation starts
gsap.from(".box", {
  x: -120, opacity: 0,
  duration: 0.8, delay: 0.8,
  immediateRender: false,
});

// Rule of thumb:
// — from() with delay? → add immediateRender: false
// — from() on page load (no delay)? → default is fine`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">immediateRender: true</p>
                        <div className="bg-zinc-900 rounded-xl h-16 flex items-center justify-center overflow-hidden">
                            <div className="ir-default w-12 h-12 rounded-lg bg-red-400" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">immediateRender: false</p>
                        <div className="bg-zinc-900 rounded-xl h-16 flex items-center justify-center overflow-hidden">
                            <div className="ir-false w-12 h-12 rounded-lg bg-secondary" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                    {(["default", "false"] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${mode === m ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}
                        >
                            immediateRender: {m}
                        </button>
                    ))}
                </div>

                <p className="text-zinc-400 text-[11px] font-mono bg-zinc-800/50 rounded-lg px-3 py-2 leading-relaxed">
                    {descriptions[mode]}
                </p>

                <div className="flex gap-2">
                    <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">
                        Play (0.8s delay)
                    </button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 6. STAGGER WITH FROM
// ─────────────────────────────────────────────
const StaggerFromDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [from, setFrom] = useState<"start" | "end" | "center" | "random">("start");
    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        gsap.set(".sf-box", { clearProps: "all" });
        gsap.from(".sf-box", {
            y: -40,
            opacity: 0,
            scale: 0.5,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: { amount: 0.7, from },
        });
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".sf-box");
        gsap.set(".sf-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="6. stagger with gsap.from()"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">stagger</code> works identically with{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from()</code> as it does with{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code> — each element enters
                    from the specified values with an offset start time.
                    <br /><br />
                    The key difference: each element&apos;s <strong className="text-zinc-200">end state is its own natural CSS
                    position</strong>. You don&apos;t specify where they land — GSAP reads each element&apos;s position in the
                    document flow automatically.
                    <br /><br />
                    Always <code className="text-secondary bg-zinc-800 px-1 rounded">clearProps: &quot;all&quot;</code> before
                    re-running staggered <code className="text-secondary bg-zinc-800 px-1 rounded">from()</code> calls.
                </>
            }
            pros={[
                "Each element lands at its own CSS position — no manual end-state needed",
                "from: 'center' creates a ripple/cascade effect with one line",
                "Works for any number of elements — scales effortlessly",
            ]}
            cons={[
                "clearProps required before re-trigger or staggered landing positions break",
                "Elements are visible until play() is called — use autoAlpha or CSS visibility to pre-hide",
            ]}
            code={`// Stagger entrance — each element drops in from above
gsap.from(".sf-box", {
  y: -40,
  opacity: 0,
  scale: 0.5,
  duration: 0.6,
  ease: "back.out(1.7)",
  stagger: {
    amount: 0.7,       // 0.7s total stagger spread across all elements
    from: "center",    // "start" | "end" | "center" | "random"
  },
});

// Always clear before re-running
gsap.set(".sf-box", { clearProps: "all" });
gsap.from(".sf-box", { y: -40, opacity: 0, duration: 0.6, stagger: 0.08 });`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="sf-box w-10 h-10 rounded-lg bg-rose-400 flex items-center justify-center text-white text-xs font-bold"
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                <div className="flex gap-1.5 flex-wrap">
                    {(["start", "end", "center", "random"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFrom(f)}
                            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${from === f ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Play</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// Root page
// ─────────────────────────────────────────────
const LearningGsapFrom = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Container>
                <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl text-secondary font-bold font-mono">{"gsap.from()"}</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                            Animates a target <code className="text-zinc-400 bg-zinc-800 px-1 rounded">from specified values</code> back
                            to its natural CSS state. The standard method for entrance animations.
                        </p>
                        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4 mt-1 max-w-2xl">
                            <p className="text-zinc-200 font-semibold mb-2 text-sm">Signature</p>
                            <code className="block bg-zinc-950 text-secondary px-3 py-2 rounded-lg text-[11px] leading-6 whitespace-pre">{`gsap.from(target, fromVars)

// target   — selector string, DOM element, ref.current, or array
// fromVars — where to start FROM; GSAP reads current CSS as the end`}</code>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <BasicFromDemo />
                        <EntranceDemo />
                        <AutoAlphaDemo />
                        <ClearPropsDemo />
                        <ImmediateRenderDemo />
                        <StaggerFromDemo />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default LearningGsapFrom;
