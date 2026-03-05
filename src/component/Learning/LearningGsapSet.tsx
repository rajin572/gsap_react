"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(useGSAP);


// ─────────────────────────────────────────────
// 1. WHAT gsap.set() DOES
// ─────────────────────────────────────────────
const BasicSetDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const applySet = contextSafe(() => {
        gsap.set(".set-box", {
            x: 100,
            rotation: 45,
            scale: 1.4,
            backgroundColor: "#f472b6",
        });
    });

    const reset = contextSafe(() => {
        gsap.set(".set-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="1. what gsap.set() does"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.set(target, vars)</code> is
                    a <strong className="text-zinc-200">zero-duration tween</strong> — it applies property
                    values <em>instantly</em>, with no animation.
                    <br /><br />
                    It&apos;s functionally identical to <code className="text-secondary bg-zinc-800 px-1 rounded">{"gsap.to(target, { ...vars, duration: 0 })"}</code>,
                    but more explicit and semantically clearer.
                    <br /><br />
                    Under the hood, <code className="text-secondary bg-zinc-800 px-1 rounded">set()</code> writes the
                    same <strong className="text-zinc-200">inline styles</strong> that any tween would write —
                    so all GSAP shorthand properties work: <code className="text-secondary bg-zinc-800 px-1 rounded">x</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">rotation</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">scale</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">autoAlpha</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">clearProps</code>, etc.
                </>
            }
            pros={[
                "Zero-duration — instant state change with no animation",
                "All GSAP shorthand properties work (x, rotation, autoAlpha, clearProps…)",
                "Consistent with the rest of GSAP's API — no context switching",
            ]}
            cons={[
                "Writes inline styles like any tween — those styles persist until cleared",
                "Has no ease, duration, or callbacks — it's purely for instant state setting",
            ]}
            code={`// Instantly apply properties — no animation, no duration
gsap.set(".box", {
  x: 100,
  rotation: 45,
  scale: 1.4,
  backgroundColor: "#f472b6",
});

// Equivalent to gsap.to() with duration: 0
gsap.to(".box", { x: 100, rotation: 45, duration: 0 });
// ↑ same result, but gsap.set() is cleaner and more readable

// Works on multiple targets at once
gsap.set([".box-a", ".box-b", ".box-c"], { opacity: 0 });
gsap.set(".item", { x: 0, clearProps: "all" });`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="bg-zinc-900 rounded-xl h-24 flex items-center justify-center">
                    <div className="set-box w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-black font-bold text-sm" />
                </div>
                <div className="flex gap-2">
                    <button onClick={applySet} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Apply set()</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset (clearProps)</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 2. set() vs to() — instant vs animated
// ─────────────────────────────────────────────
const SetVsToDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const applySet = contextSafe(() => {
        gsap.set(".set-instant", { x: 180, backgroundColor: "#f472b6", scale: 1.3 });
    });

    const applyTo = contextSafe(() => {
        gsap.to(".to-animated", { x: 180, backgroundColor: "#f472b6", scale: 1.3, duration: 0.8, ease: "power2.out" });
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf([".set-instant", ".to-animated"]);
        gsap.set([".set-instant", ".to-animated"], { clearProps: "all" });
    });

    return (
        <DemoCard
            label="2. set() vs to()"
            theory={
                <>
                    The key difference is <strong className="text-zinc-200">time</strong>:
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.set()</code> — instantaneous, no animation,
                    no duration, no ease. The element teleports to the new state on the next frame.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code> — animated over time,
                    with duration and ease.
                    <br /><br />
                    Both write the same inline styles. The only difference is that{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">to()</code> interpolates values
                    over many frames, while <code className="text-secondary bg-zinc-800 px-1 rounded">set()</code>{" "}
                    applies them in one frame.
                    <br /><br />
                    Use <code className="text-secondary bg-zinc-800 px-1 rounded">set()</code> when you want to
                    position/configure an element <strong className="text-zinc-200">before</strong> animating it —
                    for example, hiding it before a <code className="text-secondary bg-zinc-800 px-1 rounded">from()</code> or
                    setting the start state in a complex sequence.
                </>
            }
            pros={[
                "set() is the fastest way to apply a known state without creating a tween object",
                "Perfect for setting up initial state before a from() or timeline",
                "No ease/duration overhead — just a direct property write",
            ]}
            cons={[
                "No callbacks — use to({ duration: 0, onComplete }) if you need one",
                "No interpolation — the value jumps instantly (can look jarring if misused)",
            ]}
            code={`// Instant — teleports to the new state
gsap.set(".box", { x: 180, scale: 1.3 });

// Animated — transitions smoothly
gsap.to(".box",  { x: 180, scale: 1.3, duration: 0.8, ease: "power2.out" });

// Common pattern: set initial state, then animate in
gsap.set(".box", { x: -100, opacity: 0 });   // hide immediately
gsap.to(".box",  { x: 0, opacity: 1, duration: 0.6, delay: 0.5 }); // reveal later`}
        >
            <div ref={containerRef} className="flex flex-col gap-5">
                <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">gsap.set() — instant</p>
                    <div className="relative bg-zinc-900 rounded-xl h-12 overflow-hidden">
                        <div className="set-instant absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">gsap.to() — animated</p>
                    <div className="relative bg-zinc-900 rounded-xl h-12 overflow-hidden">
                        <div className="to-animated absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={applySet} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Apply set()</button>
                    <button onClick={applyTo} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Apply to()</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-600 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 3. set() for initial state (before animation)
// ─────────────────────────────────────────────
const InitialStateDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [step, setStep] = useState<"idle" | "hidden" | "animating">("idle");

    const hide = contextSafe(() => {
        gsap.set(".init-box", { x: -80, opacity: 0, scale: 0.6 });
        setStep("hidden");
    });

    const animate = contextSafe(() => {
        gsap.to(".init-box", { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" });
        setStep("animating");
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".init-box");
        gsap.set(".init-box", { clearProps: "all" });
        setStep("idle");
    });

    return (
        <DemoCard
            label="3. set() for initial state"
            theory={
                <>
                    A common pattern is to use <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.set()</code> to
                    position an element <strong className="text-zinc-200">before</strong> the animation runs,
                    then use <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code> or a
                    timeline to animate it into place.
                    <br /><br />
                    This avoids the <strong className="text-zinc-200">FOUC (Flash of Unstyled Content)</strong> problem —
                    the element is already in its hidden state before the user sees anything, and the animation
                    reveals it smoothly.
                    <br /><br />
                    This pattern is preferred over <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from()</code> when
                    you need to <strong className="text-zinc-200">delay the animation</strong> — using{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">from()</code> with a delay
                    shows the element at its CSS position for the delay duration before hiding it.
                    <code className="text-secondary bg-zinc-800 px-1 rounded">set()</code> hides it immediately.
                </>
            }
            pros={[
                "Element is hidden instantly — no flash of content before animation",
                "Decouples hiding from animating — useful when delay is involved",
                "More explicit than from() — the initial state is clear in code",
            ]}
            cons={[
                "Two-step process — remember to call both set() and to()/from()",
                "set() inline styles must be cleared after animation if element needs to be responsive",
            ]}
            code={`// Step 1: hide the element immediately (before any animation runs)
gsap.set(".box", { x: -80, opacity: 0, scale: 0.6 });

// Step 2: animate it in (later, on scroll, on click, in a timeline…)
gsap.to(".box", { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" });

// Why not just gsap.from() with a delay?
// from() shows the element at its CSS state for the delay duration — FOUC!
gsap.from(".box", { x: -80, opacity: 0, delay: 1 }); // ← visible for 1s before hiding

// set() + to() is FOUC-free regardless of delay:
gsap.set(".box", { x: -80, opacity: 0 });
gsap.to(".box",  { x: 0, opacity: 1, delay: 1, duration: 0.8 }); // hidden the whole time`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="bg-zinc-900 rounded-xl h-20 flex items-center justify-center">
                    <div className="init-box w-20 h-14 rounded-xl bg-secondary flex items-center justify-center text-black font-bold text-sm">
                        Element
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <button
                        onClick={hide}
                        disabled={step === "hidden"}
                        className="px-3 py-1 rounded bg-zinc-700 text-white text-sm disabled:opacity-40"
                    >
                        1. set() — hide
                    </button>
                    <span className="text-zinc-600 text-xs font-mono">then</span>
                    <button
                        onClick={animate}
                        disabled={step !== "hidden"}
                        className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold disabled:opacity-40"
                    >
                        2. to() — animate in
                    </button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-600 text-white text-sm">Reset</button>
                </div>
                <p className="text-zinc-600 text-[11px] font-mono">
                    {step === "idle" && "Click step 1 to hide immediately, then step 2 to animate in."}
                    {step === "hidden" && "Element is hidden (set). Now animate it in."}
                    {step === "animating" && "Animating in with to(). Click reset to start over."}
                </p>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. clearProps via set()
// ─────────────────────────────────────────────
const ClearPropsDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const applyStyles = contextSafe(() => {
        gsap.set(".cp-box", {
            x: 80, rotation: 30, scale: 1.5,
            backgroundColor: "#f472b6", borderRadius: "50%",
        });
    });

    const clearAll = contextSafe(() => {
        gsap.set(".cp-box", { clearProps: "all" });
    });

    const clearSpecific = contextSafe(() => {
        gsap.set(".cp-box", { clearProps: "x,rotation" });
    });

    return (
        <DemoCard
            label="4. clearProps via set()"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">clearProps</code> is a special
                    GSAP property that <strong className="text-zinc-200">removes inline styles</strong> written
                    by previous GSAP tweens, restoring the element&apos;s pure CSS-defined appearance.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">{"gsap.set(el, { clearProps: 'all' })"}</code> —
                    clears every GSAP-written inline style at once.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">{"gsap.set(el, { clearProps: 'x,rotation' })"}</code> —
                    clears only specific properties, preserving others.
                    <br /><br />
                    You can also pass <code className="text-secondary bg-zinc-800 px-1 rounded">clearProps</code> inside
                    a regular tween&apos;s <code className="text-secondary bg-zinc-800 px-1 rounded">onComplete</code>:
                    useful for cleaning up after an entrance animation so the element is fully CSS-controlled again.
                </>
            }
            pros={[
                "'all' is the safest — removes every GSAP inline style at once",
                "Specific clearProps preserves intentional inline overrides",
                "Can be passed to any tween method: set(), to(), from(), fromTo()",
            ]}
            cons={[
                "clearProps: 'all' removes every inline style, not just GSAP ones",
                "Forgetting to clear after animations causes layout/style bugs on re-render",
            ]}
            code={`// Apply some GSAP inline styles
gsap.set(".box", { x: 80, rotation: 30, scale: 1.5, backgroundColor: "#f472b6" });

// Clear ALL inline styles — element reverts fully to CSS
gsap.set(".box", { clearProps: "all" });

// Clear only specific properties
gsap.set(".box", { clearProps: "x,rotation" });
// scale and backgroundColor remain, x and rotation are cleared

// Practical: clean up after entrance animation
gsap.from(".box", {
  y: 40, opacity: 0, duration: 0.7,
  onComplete: () => gsap.set(".box", { clearProps: "all" }),
});

// Inside a tween directly (applied at tween end)
gsap.to(".box", { x: 100, duration: 0.5, clearProps: "x" });`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="bg-zinc-900 rounded-xl h-24 flex items-center justify-center">
                    <div className="cp-box w-14 h-14 rounded-xl bg-secondary" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={applyStyles} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Apply styles</button>
                    <button onClick={clearSpecific} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Clear x + rotation</button>
                    <button onClick={clearAll} className="px-3 py-1 rounded bg-zinc-600 text-white text-sm">Clear all</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 5. set() on multiple targets
// ─────────────────────────────────────────────
const MultipleTargetsDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const setAll = contextSafe(() => {
        gsap.set(".multi-box", { x: 60, rotation: 20, scale: 1.2, backgroundColor: "#f472b6" });
    });

    const setOdd = contextSafe(() => {
        gsap.set(".multi-box:nth-child(odd)", { x: 40, backgroundColor: "#60a5fa" });
    });

    // GSAP function-based values — each property receives (index, target, targets)
    const setByIndex = contextSafe(() => {
        gsap.set(".multi-box", {
            x: (i: number) => i * 20,
            rotation: (i: number) => i * 10,
            backgroundColor: (i: number) => `hsl(${i * 40}, 70%, 60%)`,
        });
    });

    const reset = contextSafe(() => {
        gsap.set(".multi-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="5. set() on multiple targets"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.set()</code> accepts the
                    same target formats as any other tween:
                    <br /><br />
                    — <strong className="text-zinc-200">Selector string</strong>: <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;.box&quot;</code> — all matching elements get the same values
                    <br />
                    — <strong className="text-zinc-200">Array</strong>: <code className="text-secondary bg-zinc-800 px-1 rounded">[&quot;#a&quot;, &quot;#b&quot;, ref.current]</code>
                    <br />
                    — <strong className="text-zinc-200">NodeList</strong>: <code className="text-secondary bg-zinc-800 px-1 rounded">document.querySelectorAll(&quot;.box&quot;)</code>
                    <br />
                    — <strong className="text-zinc-200">Individual element</strong>: <code className="text-secondary bg-zinc-800 px-1 rounded">ref.current</code>
                    <br /><br />
                    When you need <strong className="text-zinc-200">different values per element</strong>,
                    iterate with <code className="text-secondary bg-zinc-800 px-1 rounded">forEach</code> and call
                    <code className="text-secondary bg-zinc-800 px-1 rounded"> gsap.set(el, ...)</code> per element.
                </>
            }
            pros={[
                "One call sets all matched elements instantly — efficient for bulk resets",
                "Accepts any target format: string, array, NodeList, or DOM element",
                "forEach iteration allows per-element values without a tween",
            ]}
            cons={[
                "All elements get identical values — use forEach or a tween with stagger for per-element control",
                "CSS pseudo-selectors like :nth-child work in set() but are scoped to the GSAP context",
            ]}
            code={`// All matching elements — same values
gsap.set(".box", { x: 60, rotation: 20, scale: 1.2 });

// Array of mixed targets
gsap.set(["#header", ".nav-item", footerRef.current], { opacity: 0 });

// Per-element values — GSAP function-based values (index, target, targets)
gsap.set(".box", {
  x:               (i) => i * 20,
  rotation:        (i) => i * 10,
  backgroundColor: (i) => \`hsl(\${i * 40}, 70%, 60%)\`,
});

// Bulk reset
gsap.set(".box", { clearProps: "all" });`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="multi-box w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-black text-xs font-bold">
                            {i + 1}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={setAll} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Set all</button>
                    <button onClick={setOdd} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Set odd</button>
                    <button onClick={setByIndex} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Set by index</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-600 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// Root page
// ─────────────────────────────────────────────
const LearningGsapSet = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Container>
                <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl text-secondary font-bold font-mono">{"gsap.set()"}</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                            A <code className="text-zinc-400 bg-zinc-800 px-1 rounded">zero-duration tween</code> that
                            applies property values instantly. Used for setting initial state, resetting
                            inline styles, and configuring elements before animation.
                        </p>
                        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4 mt-1 max-w-2xl">
                            <p className="text-zinc-200 font-semibold mb-2 text-sm">Signature</p>
                            <code className="block bg-zinc-950 text-secondary px-3 py-2 rounded-lg text-[11px] leading-6 whitespace-pre">{`gsap.set(target, vars)

// Equivalent to: gsap.to(target, { ...vars, duration: 0 })
// Special vars: clearProps — removes GSAP inline styles
//   clearProps: "all"         — remove everything
//   clearProps: "x,rotation"  — remove specific props`}</code>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <BasicSetDemo />
                        <SetVsToDemo />
                        <InitialStateDemo />
                        <ClearPropsDemo />
                        <MultipleTargetsDemo />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default LearningGsapSet;
