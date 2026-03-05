"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(useGSAP);


// ─────────────────────────────────────────────
// 1. BASIC PROPERTIES
// ─────────────────────────────────────────────
const BasicPropertiesDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const animate = contextSafe((prop: string) => {
        gsap.set(".basic-box", { clearProps: "all" });
        switch (prop) {
            case "x":
                gsap.to(".basic-box", { x: 120, duration: 0.7, ease: "power2.out" });
                break;
            case "y":
                gsap.to(".basic-box", { y: 40, duration: 0.7, ease: "power2.out" });
                break;
            case "scale":
                gsap.to(".basic-box", { scale: 1.8, duration: 0.7, ease: "power2.out" });
                break;
            case "rotation":
                gsap.to(".basic-box", { rotation: 180, duration: 0.7, ease: "power2.out" });
                break;
            case "opacity":
                gsap.to(".basic-box", { opacity: 0.15, duration: 0.7, ease: "power2.out" });
                break;
            case "reset":
                gsap.to(".basic-box", { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "power2.inOut" });
                break;
        }
    });

    return (
        <DemoCard
            label="1. basic properties"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to(target, vars)</code> animates
                    a target <strong className="text-zinc-200">from its current state to the values you specify</strong>.
                    <br /><br />
                    The most common transform properties are:
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">x</code> / <code className="text-secondary bg-zinc-800 px-1 rounded">y</code> — translate (pixels, uses transform — no layout reflow)
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">scale</code> — uniform scale (or <code className="text-secondary bg-zinc-800 px-1 rounded">scaleX</code> / <code className="text-secondary bg-zinc-800 px-1 rounded">scaleY</code>)
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">rotation</code> — degrees
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">opacity</code> — 0–1
                    <br /><br />
                    GSAP always uses <code className="text-secondary bg-zinc-800 px-1 rounded">transform</code> under the hood for
                    positional properties — keeping animations GPU-accelerated and jank-free.
                </>
            }
            pros={[
                "GPU-accelerated — x/y never cause layout reflow unlike top/left",
                "Shorthand properties (x, y, scale) are more readable than raw CSS transforms",
                "Animates any numeric CSS property or DOM attribute",
            ]}
            cons={[
                "x/y values are in pixels by default — use xPercent/yPercent for % values",
                "clearProps is needed to reset inline styles left behind after animation",
            ]}
            code={`const BasicPropertiesDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const animate = contextSafe((prop: string) => {
    gsap.set(".basic-box", { clearProps: "all" });

    // Animate to a specific property value
    gsap.to(".basic-box", { x: 120, duration: 0.7, ease: "power2.out" });
    // or:
    gsap.to(".basic-box", { scale: 1.8, duration: 0.7 });
    gsap.to(".basic-box", { rotation: 180, duration: 0.7 });
    gsap.to(".basic-box", { opacity: 0.15, duration: 0.7 });
    // reset:
    gsap.to(".basic-box", {
      x: 0, y: 0, scale: 1, rotation: 0, opacity: 1,
      duration: 0.5, ease: "power2.inOut",
    });
  });

  return (
    <div ref={containerRef} className="flex flex-col gap-3">
      <div className="basic-box w-14 h-14 rounded-xl bg-secondary
                      flex items-center justify-center text-black font-bold" />
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => animate("x")}>x: 120</button>
        <button onClick={() => animate("y")}>y: 40</button>
        <button onClick={() => animate("scale")}>scale: 1.8</button>
        <button onClick={() => animate("rotation")}>rotation: 180</button>
        <button onClick={() => animate("opacity")}>opacity: 0.15</button>
        <button onClick={() => animate("reset")}>reset</button>
      </div>
    </div>
  );
};`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="basic-box w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-black font-bold" />
                <div className="flex gap-2 flex-wrap">
                    {[
                        { label: "x: 120", key: "x" },
                        { label: "y: 40", key: "y" },
                        { label: "scale: 1.8", key: "scale" },
                        { label: "rotation: 180", key: "rotation" },
                        { label: "opacity: 0.15", key: "opacity" },
                        { label: "reset", key: "reset" },
                    ].map(({ label, key }) => (
                        <button
                            key={key}
                            onClick={() => animate(key)}
                            className="px-3 py-1 rounded bg-zinc-700 text-sm text-white hover:bg-zinc-600 transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 2. DURATION, DELAY & EASE
// ─────────────────────────────────────────────
const TimingDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeEase, setActiveEase] = useState("power2.out");
    const [duration, setDuration] = useState(0.8);
    const [delay, setDelay] = useState(0);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        gsap.fromTo(
            ".timing-box",
            { x: 0 },
            { x: 200, duration, delay, ease: activeEase }
        );
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".timing-box");
        gsap.set(".timing-box", { x: 0 });
    });

    const eases = ["none", "power1.out", "power2.out", "power4.out", "bounce.out", "elastic.out(1,0.3)", "back.out(1.7)", "expo.out", "circ.out"];

    return (
        <DemoCard
            label="2. duration, delay & ease"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">duration</code> controls how long
                    the animation takes (seconds). <code className="text-secondary bg-zinc-800 px-1 rounded">delay</code> waits
                    before starting.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">ease</code> is the motion curve — it defines
                    how the animated value <strong className="text-zinc-200">accelerates and decelerates</strong> over the duration.
                    GSAP includes dozens: <code className="text-secondary bg-zinc-800 px-1 rounded">power1–4</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">bounce</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">elastic</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">back</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">expo</code>, etc.
                    <br /><br />
                    Each ease has three variants: <code className="text-secondary bg-zinc-800 px-1 rounded">.in</code> (starts slow),{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.out</code> (ends slow),{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.inOut</code> (both).
                </>
            }
            pros={[
                "ease: 'none' gives a perfectly linear tween when needed",
                "elastic and bounce eases simulate real-world physics cheaply",
                "Negative delay staggers animations backward in a timeline",
            ]}
            cons={[
                "Very short durations (< 0.1s) make easing imperceptible",
                "elastic/bounce eases can overshoot — avoid on layout-affecting properties",
            ]}
            code={`gsap.to(".timing-box", {
  x: 200,
  duration: 0.8,   // seconds
  delay: 0.2,      // wait 0.2s before starting
  ease: "bounce.out",
});

// Common ease options:
// "none"                — linear
// "power1/2/3/4.out"   — smooth deceleration
// "bounce.out"         — bounces at the end
// "elastic.out(1,0.3)" — springy overshoot
// "back.out(1.7)"      — slight overshoot then settles
// "expo.out"           — fast start, slow finish
// "circ.out"           — circular arc`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                {/* Track */}
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden">
                    <div className="timing-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-2">
                    {/* Ease picker */}
                    <div className="flex gap-1.5 flex-wrap">
                        {eases.map((e) => (
                            <button
                                key={e}
                                onClick={() => setActiveEase(e)}
                                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${activeEase === e ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}
                            >
                                {e}
                            </button>
                        ))}
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-20">duration: {duration}s</span>
                        <input
                            type="range" min={0.1} max={3} step={0.1}
                            value={duration}
                            onChange={(e) => setDuration(parseFloat(e.target.value))}
                            className="flex-1 accent-secondary"
                        />
                    </div>

                    {/* Delay */}
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-20">delay: {delay}s</span>
                        <input
                            type="range" min={0} max={2} step={0.1}
                            value={delay}
                            onChange={(e) => setDelay(parseFloat(e.target.value))}
                            className="flex-1 accent-secondary"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">
                            Play
                        </button>
                        <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 3. STAGGER
// ─────────────────────────────────────────────
const StaggerDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [stagger, setStagger] = useState(0.1);
    const [from, setFrom] = useState<"start" | "end" | "center" | "random">("start");

    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        gsap.fromTo(
            ".stagger-box",
            { y: 30, opacity: 0, scale: 0.7 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
                stagger: { amount: stagger * 8, from },
            }
        );
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".stagger-box");
        gsap.set(".stagger-box", { y: 30, opacity: 0, scale: 0.7 });
    });

    return (
        <DemoCard
            label="3. stagger"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">stagger</code> offsets the start
                    time of each element in a matched set, creating a <strong className="text-zinc-200">cascade effect</strong>.
                    <br /><br />
                    As a plain number: <code className="text-secondary bg-zinc-800 px-1 rounded">stagger: 0.1</code> — each
                    element starts 0.1s after the previous one.
                    <br /><br />
                    As an object: <code className="text-secondary bg-zinc-800 px-1 rounded">{"stagger: { amount: 0.8, from: 'center' }"}</code> —
                    distributes the total stagger time and controls which element animates first.
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">from</code> can be{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;start&quot;</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;end&quot;</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;center&quot;</code>, or{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;random&quot;</code>.
                </>
            }
            pros={[
                "One tween animates all matched elements — no loops needed",
                "from: 'center' and 'random' create visually interesting cascades",
                "amount spreads total time evenly regardless of element count",
            ]}
            cons={[
                "Plain number stagger grows with element count — use amount for predictable timing",
                "Random stagger re-randomizes on each play — store the seed if reproducibility matters",
            ]}
            code={`// Simple stagger
gsap.fromTo(".stagger-box",
  { y: 30, opacity: 0, scale: 0.7 },
  {
    y: 0, opacity: 1, scale: 1,
    duration: 0.5,
    ease: "back.out(1.7)",
    stagger: 0.1,            // 0.1s between each element
  }
);

// Advanced stagger object
gsap.fromTo(".stagger-box",
  { y: 30, opacity: 0 },
  {
    y: 0, opacity: 1,
    duration: 0.5,
    stagger: {
      amount: 0.8,           // total stagger time spread across all elements
      from: "center",        // "start" | "end" | "center" | "random"
    },
  }
);`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="stagger-box w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold"
                            style={{ opacity: 0 }}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-20">stagger: {(stagger * 8).toFixed(1)}s</span>
                        <input
                            type="range" min={0.05} max={0.3} step={0.05}
                            value={stagger}
                            onChange={(e) => setStagger(parseFloat(e.target.value))}
                            className="flex-1 accent-secondary"
                        />
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
                        <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">
                            Play
                        </button>
                        <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. REPEAT & YOYO
// ─────────────────────────────────────────────
const RepeatYoyoDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [repeat, setRepeat] = useState(2);
    const [yoyo, setYoyo] = useState(false);
    const [repeatDelay, setRepeatDelay] = useState(0);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        gsap.killTweensOf(".repeat-box");
        gsap.fromTo(
            ".repeat-box",
            { x: 0 },
            {
                x: 160,
                duration: 0.6,
                ease: "power2.inOut",
                repeat,
                yoyo,
                repeatDelay,
            }
        );
    });

    const stop = contextSafe(() => {
        gsap.killTweensOf(".repeat-box");
        gsap.set(".repeat-box", { x: 0 });
    });

    return (
        <DemoCard
            label="4. repeat & yoyo"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">repeat: n</code> plays the tween{" "}
                    <strong className="text-zinc-200">n additional times</strong> after the first play.
                    Use <code className="text-secondary bg-zinc-800 px-1 rounded">repeat: -1</code> for an infinite loop.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">yoyo: true</code> reverses the tween on
                    every other repeat — the element <strong className="text-zinc-200">bounces back and forth</strong>{" "}
                    instead of jumping back to the start position.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">repeatDelay</code> adds a pause
                    (seconds) between each repeat cycle.
                </>
            }
            pros={[
                "repeat: -1 creates effortless infinite loops — no setInterval needed",
                "yoyo: true makes ping-pong loops with a single tween",
                "repeatDelay gives breathing room between cycles",
            ]}
            cons={[
                "Infinite tweens must be killed on component unmount (useGSAP handles this)",
                "yoyo reverses the ease too — the return trip uses the mirrored curve",
            ]}
            code={`// Repeat 2 extra times (plays 3 total)
gsap.to(".repeat-box", {
  x: 160,
  duration: 0.6,
  ease: "power2.inOut",
  repeat: 2,
  yoyo: true,       // reverses on every other repeat
  repeatDelay: 0.3, // pause between cycles
});

// Infinite loop
gsap.to(".repeat-box", {
  rotation: 360,
  duration: 1,
  ease: "none",
  repeat: -1,
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden">
                    <div className="repeat-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-pink-500" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-28">
                            repeat: {repeat === -1 ? "∞" : repeat}
                        </span>
                        <input
                            type="range" min={-1} max={5} step={1}
                            value={repeat}
                            onChange={(e) => setRepeat(parseInt(e.target.value))}
                            className="flex-1 accent-secondary"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-28">repeatDelay: {repeatDelay}s</span>
                        <input
                            type="range" min={0} max={1} step={0.1}
                            value={repeatDelay}
                            onChange={(e) => setRepeatDelay(parseFloat(e.target.value))}
                            className="flex-1 accent-secondary"
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input
                            type="checkbox"
                            checked={yoyo}
                            onChange={(e) => setYoyo(e.target.checked)}
                            className="accent-secondary w-4 h-4"
                        />
                        <span className="text-zinc-400 text-[11px] font-mono">yoyo</span>
                    </label>

                    <div className="flex gap-2">
                        <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">
                            Play
                        </button>
                        <button onClick={stop} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">
                            Stop
                        </button>
                    </div>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 5. CALLBACKS
// ─────────────────────────────────────────────
const CallbacksDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [log, setLog] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    const addLog = (msg: string) =>
        setLog((prev) => [`${new Date().toLocaleTimeString("en", { hour12: false })}  ${msg}`, ...prev].slice(0, 6));

    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        setLog([]);
        setProgress(0);
        gsap.fromTo(
            ".cb-box",
            { x: 0, backgroundColor: "#6ee7b7" },
            {
                x: 180,
                backgroundColor: "#f472b6",
                duration: 1.5,
                ease: "power2.inOut",
                onStart: () => addLog("onStart — tween begins"),
                onUpdate: function () {
                    setProgress(Math.round((this as unknown as gsap.core.Tween).progress() * 100));
                },
                onComplete: () => addLog("onComplete — tween finished"),
            }
        );
    });

    return (
        <DemoCard
            label="5. callbacks"
            theory={
                <>
                    GSAP tweens expose lifecycle callbacks you can hook into:
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">onStart</code> — fires once when the tween begins (after any delay)
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">onUpdate</code> — fires every frame while the tween is active
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">onComplete</code> — fires once when the tween finishes
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">onRepeat</code> — fires at the start of each repeat cycle
                    <br /><br />
                    Inside <code className="text-secondary bg-zinc-800 px-1 rounded">onUpdate</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">this</code> refers to the tween instance —
                    so <code className="text-secondary bg-zinc-800 px-1 rounded">this.progress()</code> gives a 0–1 value.
                </>
            }
            pros={[
                "onComplete is the correct place to chain next animations or update state",
                "onUpdate gives per-frame progress — useful for driving custom UI like progress bars",
                "Callbacks receive the tween as 'this' — no extra ref needed",
            ]}
            cons={[
                "Avoid setState in onUpdate for complex state — it triggers re-renders every frame",
                "onStart fires after delay — don't use it to sync visual state set before the delay",
            ]}
            code={`gsap.to(".cb-box", {
  x: 180,
  duration: 1.5,
  ease: "power2.inOut",

  onStart: () => {
    console.log("tween started");
  },

  onUpdate: function () {
    // 'this' is the tween instance
    const pct = Math.round(this.progress() * 100);
    setProgress(pct);
  },

  onComplete: () => {
    console.log("tween finished");
  },

  onRepeat: () => {
    console.log("repeat cycle started");
  },
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden">
                    <div
                        className="cb-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg"
                        style={{ backgroundColor: "#6ee7b7" }}
                    />
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-[11px] font-mono w-16">progress</span>
                    <div className="flex-1 bg-zinc-900 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-secondary rounded-full transition-none"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-zinc-400 text-[11px] font-mono w-8">{progress}%</span>
                </div>

                {/* Log */}
                <div className="bg-zinc-950 border border-zinc-700/40 rounded-xl p-3 min-h-16 flex flex-col gap-1">
                    {log.length === 0 && (
                        <p className="text-zinc-600 text-[11px] font-mono">Press play to see callbacks fire…</p>
                    )}
                    {log.map((entry, i) => (
                        <p key={i} className="text-[11px] font-mono text-secondary">{entry}</p>
                    ))}
                </div>

                <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold w-fit">
                    Play
                </button>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 6. OVERWRITE
// ─────────────────────────────────────────────
const OverwriteDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<"none" | "true" | "auto">("none");
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) =>
        setLog((prev) => [`• ${msg}`, ...prev].slice(0, 4));

    const { contextSafe } = useGSAP({ scope: containerRef });

    const fire = contextSafe(() => {
        setLog([]);
        const overwriteVal = mode === "true" ? true : mode === "auto" ? "auto" : false;

        // First tween: move x to 160 over 2s
        addLog(`tween A: x→160 over 2s (overwrite: ${String(overwriteVal)})`);
        gsap.to(".ow-box", { x: 160, duration: 2, ease: "none", overwrite: overwriteVal });

        // Second tween fires 0.3s later targeting x AND rotation
        setTimeout(() => {
            addLog("tween B (0.3s later): x→0, rotation→180");
            gsap.to(".ow-box", { x: 0, rotation: 180, duration: 1, ease: "power2.out", overwrite: overwriteVal });
        }, 300);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".ow-box");
        gsap.set(".ow-box", { clearProps: "all" });
        setLog([]);
    });

    const descriptions: Record<typeof mode, string> = {
        none: "Both tweens fight over x — jittery / unpredictable",
        true: "Tween B kills tween A entirely (x AND rotation of A) before starting",
        auto: "Tween B only kills the x property from tween A — rotation from A survives",
    };

    return (
        <DemoCard
            label="6. overwrite"
            theory={
                <>
                    When two tweens target the <strong className="text-zinc-200">same element and same property</strong>, they
                    fight each frame — producing jitter or unexpected values.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">overwrite: true</code> — kills <strong className="text-zinc-200">all active tweens</strong> on
                    the target before the new one starts. Safest option.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">overwrite: &quot;auto&quot;</code> — surgically kills only the
                    conflicting properties, leaving other properties from other tweens intact. Most flexible.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">overwrite: false</code> (default) — no cleanup,
                    tweens stack. Usually wrong when re-triggering.
                </>
            }
            pros={[
                "overwrite: true is the safest choice for button-triggered animations",
                "overwrite: 'auto' lets multiple tweens coexist on separate properties",
                "Prevents jitter from competing tweens without needing killTweensOf()",
            ]}
            cons={[
                "overwrite: true kills ALL tweens on the target — even unrelated ones",
                "Default is false — easy to forget and create tween conflicts",
            ]}
            code={`// ❌ No overwrite — tween A and B fight over x
gsap.to(".box", { x: 160, duration: 2 });
setTimeout(() => {
  gsap.to(".box", { x: 0, rotation: 180, duration: 1 }); // conflict!
}, 300);

// ✅ overwrite: true — kill ALL tweens on target before starting
gsap.to(".box", { x: 0, rotation: 180, duration: 1, overwrite: true });

// ✅ overwrite: "auto" — kill only conflicting props
// Tween A animates x+opacity, Tween B animates x only with auto
// → Tween B kills A's x but A's opacity keeps running
gsap.to(".box", { x: 160, opacity: 0.3, duration: 2 });
setTimeout(() => {
  gsap.to(".box", { x: 0, duration: 1, overwrite: "auto" });
  // opacity from tween A still animates — only x is overwritten
}, 300);`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden">
                    <div className="ow-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-violet-500" />
                </div>

                <div className="flex gap-1.5 flex-wrap">
                    {(["none", "true", "auto"] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${mode === m ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}
                        >
                            overwrite: {m}
                        </button>
                    ))}
                </div>

                <p className="text-zinc-400 text-[11px] font-mono bg-zinc-800/50 rounded-lg px-3 py-2">
                    {descriptions[mode]}
                </p>

                <div className="bg-zinc-950 border border-zinc-700/40 rounded-xl p-3 min-h-14 flex flex-col gap-1">
                    {log.length === 0
                        ? <p className="text-zinc-600 text-[11px] font-mono">Press Fire to see two tweens fight…</p>
                        : log.map((e, i) => <p key={i} className="text-[11px] font-mono text-secondary">{e}</p>)
                    }
                </div>

                <div className="flex gap-2">
                    <button onClick={fire} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Fire</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 7. FUNCTION-BASED VALUES
// ─────────────────────────────────────────────
const FunctionValuesDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        gsap.set(".fn-box", { clearProps: "all" });
        gsap.to(".fn-box", {
            x: (i: number) => (i + 1) * 40,
            rotation: (i: number) => i * 15,
            scale: (i: number) => 0.7 + i * 0.1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05,
        });
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".fn-box");
        gsap.set(".fn-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="7. function-based values"
            theory={
                <>
                    Any GSAP property can accept a <strong className="text-zinc-200">function</strong> instead of a static
                    value. GSAP calls it for each element, passing:
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">(index, target, targets)</code>
                    <br /><br />
                    This lets each element in a matched set receive a <strong className="text-zinc-200">unique value</strong> —
                    without any refs, without any loops, without any extra state.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">x: (i) =&gt; i * 40</code> — each box
                    ends at a different x position based on its index.
                    <br /><br />
                    Also works with <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.set()</code> and{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from()</code> — any tween method.
                </>
            }
            pros={[
                "No refs, no loops — apply unique per-element values in one tween call",
                "index, target, and the full targets array are available in each call",
                "Works with all tween methods: to(), from(), fromTo(), set()",
            ]}
            cons={[
                "Function runs once at tween creation — not reactive to state changes",
                "For complex logic, consider building a values array with map() instead",
            ]}
            code={`// Each element gets a unique value based on its index
gsap.to(".fn-box", {
  x: (i) => (i + 1) * 40,         // 40, 80, 120, 160 …
  rotation: (i) => i * 15,         // 0, 15, 30, 45 …
  scale: (i) => 0.7 + i * 0.1,    // 0.7, 0.8, 0.9, 1.0 …
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.05,
});

// Full signature: (index, target, targets) => value
gsap.to(".fn-box", {
  opacity: (i, el) => parseFloat(el.dataset.opacity ?? "1"),
  backgroundColor: (i) => \`hsl(\${i * 40}, 70%, 60%)\`,
  duration: 0.6,
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="fn-box w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center text-black text-xs font-bold"
                        >
                            {i}
                        </div>
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
// 8. PAUSED — CREATE WITHOUT PLAYING
// ─────────────────────────────────────────────
const PausedDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const [status, setStatus] = useState<"idle" | "playing" | "paused" | "done">("idle");

    useGSAP(() => {
        tweenRef.current = gsap.to(".paused-box", {
            x: 200,
            rotation: 360,
            duration: 2,
            ease: "power2.inOut",
            paused: true,          // ← created but NOT playing
            onStart: () => setStatus("playing"),
            onUpdate: function () {
                if ((this as unknown as gsap.core.Tween).paused()) setStatus("paused");
            },
            onComplete: () => setStatus("done"),
        });
    }, { scope: containerRef });

    const handlePlay = () => { tweenRef.current?.play(); setStatus("playing"); };
    const handlePause = () => { tweenRef.current?.pause(); setStatus("paused"); };
    const handleReverse = () => { tweenRef.current?.reverse(); setStatus("playing"); };
    const handleRestart = () => { tweenRef.current?.restart(); setStatus("playing"); };

    const statusColors: Record<typeof status, string> = {
        idle: "text-zinc-500",
        playing: "text-emerald-400",
        paused: "text-amber-400",
        done: "text-secondary",
    };

    return (
        <DemoCard
            label="8. paused — control a tween manually"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">paused: true</code> creates the tween
                    without starting it. You get back a <strong className="text-zinc-200">Tween instance</strong> you can
                    control at any time:
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.play()</code> — start / resume from current position
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.pause()</code> — freeze at current position
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.reverse()</code> — play backwards to start
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.restart()</code> — jump to time=0 and play
                    <br /><br />
                    This is the foundation of building <strong className="text-zinc-200">interactive animations</strong> — hover
                    effects, carousels, step-through animations, and more.
                </>
            }
            pros={[
                "Full playback control — play, pause, reverse, restart, seek",
                "Create the tween once in useGSAP, control it from event handlers safely",
                "tween.progress(0.5) seeks to 50% — great for scroll-driven or slider animations",
            ]}
            cons={[
                "Must store the tween ref — can't use inline gsap.to() calls for paused tweens",
                "paused tween still needs cleanup — useGSAP handles this automatically",
            ]}
            code={`// Create tween without playing
const tween = gsap.to(".box", {
  x: 200, rotation: 360,
  duration: 2, ease: "power2.inOut",
  paused: true,
});

// Control it later
tween.play();     // start / resume
tween.pause();    // freeze
tween.reverse();  // play backwards
tween.restart();  // back to start and play

// Seek to specific time or progress
tween.seek(1);           // jump to 1 second
tween.progress(0.5);     // jump to 50%

// In React — store in a ref:
useGSAP(() => {
  tweenRef.current = gsap.to(".box", { x: 200, paused: true });
}, { scope: containerRef });`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden">
                    <div className="paused-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-cyan-400" />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-[11px] font-mono">status:</span>
                    <span className={`text-[11px] font-mono font-semibold ${statusColors[status]}`}>{status}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button onClick={handlePlay} className="px-3 py-1 rounded bg-emerald-700 text-white text-sm">Play</button>
                    <button onClick={handlePause} className="px-3 py-1 rounded bg-amber-700 text-white text-sm">Pause</button>
                    <button onClick={handleReverse} className="px-3 py-1 rounded bg-blue-700 text-white text-sm">Reverse</button>
                    <button onClick={handleRestart} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Restart</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// Root page
// ─────────────────────────────────────────────
const LearningGsapTo = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Container>
                <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-6">

                    {/* Page header */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl text-secondary font-bold font-mono">{"gsap.to()"}</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                            The core tween method — animates a target{" "}
                            <code className="text-zinc-400 bg-zinc-800 px-1 rounded">from its current state</code>{" "}
                            to the values you define. Every GSAP animation ultimately uses this under the hood.
                        </p>

                        {/* Signature callout */}
                        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4 mt-1 text-[12px] text-zinc-400 leading-relaxed max-w-2xl">
                            <p className="text-zinc-200 font-semibold mb-2 text-sm">Signature</p>
                            <code className="block bg-zinc-950 text-secondary px-3 py-2 rounded-lg text-[11px] leading-6 whitespace-pre">{`gsap.to(target, vars)

// target  — selector string, DOM element, React ref.current, or array
// vars    — object with CSS/transform properties + special GSAP keys:
//           duration, ease, delay, stagger, repeat, yoyo,
//           onStart, onUpdate, onComplete, onRepeat …`}</code>
                        </div>
                    </div>

                    {/* Demo grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <BasicPropertiesDemo />
                        <TimingDemo />
                        <StaggerDemo />
                        <RepeatYoyoDemo />
                        <CallbacksDemo />
                        <OverwriteDemo />
                        <FunctionValuesDemo />
                        <PausedDemo />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default LearningGsapTo;
