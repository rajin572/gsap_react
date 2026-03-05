"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(useGSAP);


// ─────────────────────────────────────────────
// 1. from() vs to() vs fromTo() — side by side
// ─────────────────────────────────────────────
const ThreeMethodsDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const playTo = contextSafe(() => {
        gsap.set(".to-box", { clearProps: "all" });
        gsap.to(".to-box", { x: 160, opacity: 0.2, duration: 0.8, ease: "power2.out" });
    });

    const playFrom = contextSafe(() => {
        gsap.set(".from-box", { clearProps: "all" });
        gsap.from(".from-box", { x: 160, opacity: 0, duration: 0.8, ease: "power2.out" });
    });

    const playFromTo = contextSafe(() => {
        gsap.fromTo(
            ".fromto-box",
            { x: -80, opacity: 0, scale: 0.6 },
            { x: 80, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
        );
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf([".to-box", ".from-box", ".fromto-box"]);
        gsap.set([".to-box", ".from-box", ".fromto-box"], { clearProps: "all" });
    });

    return (
        <DemoCard
            label="1. to() vs from() vs fromTo()"
            theory={
                <>
                    All three methods animate the same properties — the difference is <strong className="text-zinc-200">which state GSAP controls</strong>.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code> — reads current DOM state as start, your values as end
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from()</code> — your values as start, reads current DOM state as end
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.fromTo()</code> — you define <strong className="text-zinc-200">both</strong> start and end; DOM state is never read
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">fromTo()</code> is the most predictable of the three because it is
                    completely independent of whatever inline styles or CSS the element currently has.
                </>
            }
            pros={[
                "fromTo() is immune to stale inline styles — both endpoints are explicit",
                "from() is the quickest for entrance animations (end state = CSS)",
                "to() is best when animating away from an unknown current state",
            ]}
            cons={[
                "fromTo() requires knowing both positions — can't land at CSS state like from()",
                "from() and to() both read DOM state — can be unpredictable if re-triggered",
            ]}
            code={`// gsap.to()  — current state → your values
gsap.to(".box",  { x: 160, opacity: 0.2, duration: 0.8 });

// gsap.from() — your values → current state
gsap.from(".box", { x: 160, opacity: 0, duration: 0.8 });

// gsap.fromTo() — explicit start AND end (DOM state ignored)
gsap.fromTo(
  ".box",
  { x: -80, opacity: 0, scale: 0.6 },   // FROM
  { x:  80, opacity: 1, scale: 1,        // TO
    duration: 0.8, ease: "back.out(1.7)" }
);`}
        >
            <div ref={containerRef} className="flex flex-col gap-5">
                <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">gsap.to()</p>
                    <div className="relative bg-zinc-900 rounded-xl h-12">
                        <div className="to-box absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-sky-400" />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">gsap.from()</p>
                    <div className="relative bg-zinc-900 rounded-xl h-12">
                        <div className="from-box absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">gsap.fromTo()</p>
                    <div className="relative bg-zinc-900 rounded-xl h-12">
                        <div className="fromto-box absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-violet-400" />
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={playTo} className="px-3 py-1 rounded bg-sky-700 text-white text-sm">Play to()</button>
                    <button onClick={playFrom} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Play from()</button>
                    <button onClick={playFromTo} className="px-3 py-1 rounded bg-violet-700 text-white text-sm">Play fromTo()</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 2. fromTo() — explicit start & end
// ─────────────────────────────────────────────
const FromToControlDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const [fromX, setFromX] = useState(-120);
    const [toX, setToX] = useState(120);
    const [fromOpacity, setFromOpacity] = useState(0);
    const [fromScale, setFromScale] = useState(0.5);

    const play = contextSafe(() => {
        gsap.fromTo(
            ".fromto-ctrl-box",
            { x: fromX, opacity: fromOpacity, scale: fromScale },
            { x: toX, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        );
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".fromto-ctrl-box");
        gsap.set(".fromto-ctrl-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="2. fromTo() explicit endpoints"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.fromTo(target, fromVars, toVars)</code> gives you
                    complete control over both endpoints — GSAP <strong className="text-zinc-200">never reads the element&apos;s current DOM state</strong>.
                    <br /><br />
                    The start is always exactly <code className="text-secondary bg-zinc-800 px-1 rounded">fromVars</code>.
                    The end is always exactly <code className="text-secondary bg-zinc-800 px-1 rounded">toVars</code>.
                    Leftover inline styles from a previous run are completely irrelevant.
                    <br /><br />
                    <strong className="text-zinc-200">Rule:</strong> Special GSAP keys — <code className="text-secondary bg-zinc-800 px-1 rounded">ease</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">duration</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">stagger</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">onComplete</code> — always go in{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">toVars</code>, never in <code className="text-secondary bg-zinc-800 px-1 rounded">fromVars</code>.
                </>
            }
            pros={[
                "Fully deterministic — same input always produces identical animation",
                "No dependency on element's current DOM state — safe to re-trigger freely",
                "Ideal for timeline sequences where exact positions matter",
            ]}
            cons={[
                "More verbose than from() or to()",
                "Requires knowing the final position — can't land at CSS state like from()",
            ]}
            code={`gsap.fromTo(
  ".box",
  // fromVars — only animatable CSS/transform properties
  { x: -120, opacity: 0, scale: 0.5 },
  // toVars — end values + ALL GSAP special keys
  {
    x: 120,
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: "power3.out",
    onComplete: () => console.log("done"),
  }
);

// With stagger on multiple elements
gsap.fromTo(
  ".item",
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
);`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-16 overflow-hidden">
                    <div className="fromto-ctrl-box absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-orange-400" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-24">from x: {fromX}</span>
                        <input type="range" min={-160} max={0} step={10} value={fromX} onChange={(e) => setFromX(Number(e.target.value))} className="flex-1 accent-secondary" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-24">to x: {toX}</span>
                        <input type="range" min={0} max={160} step={10} value={toX} onChange={(e) => setToX(Number(e.target.value))} className="flex-1 accent-secondary" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-24">from opacity: {fromOpacity}</span>
                        <input type="range" min={0} max={1} step={0.1} value={fromOpacity} onChange={(e) => setFromOpacity(Number(e.target.value))} className="flex-1 accent-secondary" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-24">from scale: {fromScale}</span>
                        <input type="range" min={0.1} max={2} step={0.1} value={fromScale} onChange={(e) => setFromScale(Number(e.target.value))} className="flex-1 accent-secondary" />
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
// 3. fromTo() safe re-trigger vs from()
// ─────────────────────────────────────────────
const RetriggerDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const playFrom = contextSafe(() => {
        // No clearProps — after first run, GSAP inline styles accumulate
        gsap.from(".retrig-from", { x: -120, opacity: 0, duration: 0.7, ease: "power2.out" });
    });

    const playFromTo = contextSafe(() => {
        // fromTo is always safe to re-trigger — no DOM state dependency
        gsap.fromTo(
            ".retrig-fromto",
            { x: -120, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
        );
    });

    return (
        <DemoCard
            label="3. re-trigger safety"
            theory={
                <>
                    Click each button <strong className="text-zinc-200">multiple times rapidly</strong> to see the difference.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">from()</code> reads the element&apos;s current
                    DOM state as the end. If a previous tween left inline styles on the element and you re-trigger without
                    <code className="text-secondary bg-zinc-800 px-1 rounded"> clearProps</code>, the end position drifts each time.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">fromTo()</code> never reads the DOM —
                    both endpoints are hard-coded in your call. Re-triggering any number of times always produces
                    the <strong className="text-zinc-200">exact same animation</strong>.
                </>
            }
            pros={[
                "fromTo() is always safe to re-trigger — zero DOM-state dependency",
                "Ideal for buttons, hover effects, and scroll-re-entry animations",
            ]}
            cons={[
                "from() needs clearProps before each re-trigger to behave correctly",
                "fromTo() requires knowing the exact final position",
            ]}
            code={`// ❌ from() — breaks on re-trigger (inline styles compound)
gsap.from(".box", { x: -120, opacity: 0, duration: 0.7 });
// second trigger: GSAP reads leftover x:0 inline style → ends at wrong place

// ✅ fromTo() — always correct, no matter how many times triggered
gsap.fromTo(
  ".box",
  { x: -120, opacity: 0 },
  { x: 0,    opacity: 1, duration: 0.7, ease: "power2.out" }
);

// ✅ from() with clearProps — also correct
gsap.set(".box", { clearProps: "all" });
gsap.from(".box", { x: -120, opacity: 0, duration: 0.7 });`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">from() — unsafe</p>
                        <div className="bg-zinc-900 rounded-xl h-14 flex items-center justify-center overflow-hidden">
                            <div className="retrig-from w-12 h-10 rounded-lg bg-red-400" />
                        </div>
                        <button onClick={playFrom} className="px-2 py-1 rounded bg-red-900/50 border border-red-700/40 text-red-300 text-[11px] font-mono">
                            Re-trigger (drifts)
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">fromTo() — safe</p>
                        <div className="bg-zinc-900 rounded-xl h-14 flex items-center justify-center overflow-hidden">
                            <div className="retrig-fromto w-12 h-10 rounded-lg bg-secondary" />
                        </div>
                        <button onClick={playFromTo} className="px-2 py-1 rounded bg-emerald-900/50 border border-emerald-700/40 text-emerald-300 text-[11px] font-mono">
                            Re-trigger (stable)
                        </button>
                    </div>
                </div>
                <p className="text-zinc-600 text-[11px] font-mono">Click each button rapidly multiple times.</p>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. fromTo() with stagger
// ─────────────────────────────────────────────
const FromToStaggerDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [from, setFrom] = useState<"start" | "end" | "center" | "random">("start");
    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        gsap.fromTo(
            ".ft-stagger-box",
            { y: 40, opacity: 0, scale: 0.6 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
                stagger: { amount: 0.6, from },
            }
        );
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".ft-stagger-box");
        gsap.set(".ft-stagger-box", { y: 40, opacity: 0, scale: 0.6 });
    });

    return (
        <DemoCard
            label="4. fromTo() with stagger"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">fromTo()</code> works identically
                    with <code className="text-secondary bg-zinc-800 px-1 rounded">stagger</code> — all elements share
                    the same explicit start and end values, offset in time.
                    <br /><br />
                    Because <code className="text-secondary bg-zinc-800 px-1 rounded">fromTo()</code> ignores DOM state,
                    the <strong className="text-zinc-200">stagger is safe to re-trigger</strong> at any point without
                    needing clearProps — each element always starts from the exact same <code className="text-secondary bg-zinc-800 px-1 rounded">fromVars</code>.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">stagger.from</code> controls which
                    element starts first: <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;start&quot;</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;end&quot;</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;center&quot;</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;random&quot;</code>.
                </>
            }
            pros={[
                "Re-triggerable stagger with no clearProps needed",
                "from: 'center' or 'random' creates visually interesting cascades",
                "amount distributes total stagger time evenly regardless of element count",
            ]}
            cons={[
                "Requires knowing the exact final position of every element",
                "More verbose than from() with stagger",
            ]}
            code={`// fromTo() with stagger — fully re-triggerable
gsap.fromTo(
  ".item",
  { y: 40, opacity: 0, scale: 0.6 },      // FROM (applied instantly)
  {
    y: 0, opacity: 1, scale: 1,            // TO
    duration: 0.5,
    ease: "back.out(1.7)",
    stagger: {
      amount: 0.6,       // total stagger spread across all elements
      from: "center",    // "start" | "end" | "center" | "random"
    },
  }
);`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="ft-stagger-box w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center text-white text-xs font-bold"
                            style={{ opacity: 0 }}
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
const LearningGsapFromTo = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Container>
                <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl text-secondary font-bold font-mono">{"gsap.fromTo()"}</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                            The most predictable tween method — you define{" "}
                            <code className="text-zinc-400 bg-zinc-800 px-1 rounded">both start and end</code> explicitly.
                            GSAP never reads the element&apos;s current DOM state.
                        </p>
                        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4 mt-1 max-w-2xl">
                            <p className="text-zinc-200 font-semibold mb-2 text-sm">Signature</p>
                            <code className="block bg-zinc-950 text-secondary px-3 py-2 rounded-lg text-[11px] leading-6 whitespace-pre">{`gsap.fromTo(target, fromVars, toVars)

// fromVars — start state (animatable properties only)
// toVars   — end state + ALL special keys:
//            ease, duration, delay, stagger, repeat,
//            yoyo, onStart, onUpdate, onComplete …`}</code>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <ThreeMethodsDemo />
                        <FromToControlDemo />
                        <RetriggerDemo />
                        <FromToStaggerDemo />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default LearningGsapFromTo;
