"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(useGSAP);

// ─────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────
const Box = ({ cls, color = "bg-secondary" }: { cls: string; color?: string }) => (
    <div className={`${cls} ${color} w-10 h-10 rounded-lg shrink-0`} />
);

const Track = ({ children }: { children: React.ReactNode }) => (
    <div className="relative bg-zinc-900 rounded-xl h-14 flex items-center px-2 overflow-hidden">
        {children}
    </div>
);

const Btn = ({ label, onClick, cls = "bg-zinc-700 text-white" }: { label: string; onClick: () => void; cls?: string }) => (
    <button onClick={onClick} className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${cls}`}>
        {label}
    </button>
);


// ─────────────────────────────────────────────
// 1. BASIC TIMELINE — sequential by default
// ─────────────────────────────────────────────
const BasicTimelineDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const createTl = contextSafe(() => {
        gsap.set([".tl-b1", ".tl-b2", ".tl-b3"], { clearProps: "all" });
        tlRef.current = gsap.timeline()
            .to(".tl-b1", { x: 220, duration: 0.6, ease: "power2.out" })
            .to(".tl-b2", { x: 220, duration: 0.6, ease: "power2.out" })
            .to(".tl-b3", { x: 220, duration: 0.6, ease: "power2.out" });
    });

    const play = () => { createTl(); };
    const reverse = () => tlRef.current?.reverse();

    return (
        <DemoCard
            label="1. basic timeline — tweens run one after another"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.timeline()</code> creates
                    a container that sequences tweens <strong className="text-zinc-200">one after another by default</strong>.
                    Each <code className="text-secondary bg-zinc-800 px-1 rounded">.to()</code> added
                    starts when the previous one ends.
                    <br /><br />
                    The timeline is itself a playback object — it has the same
                    <code className="text-secondary bg-zinc-800 px-1 rounded"> .play()</code>,
                    <code className="text-secondary bg-zinc-800 px-1 rounded"> .pause()</code>,
                    <code className="text-secondary bg-zinc-800 px-1 rounded"> .reverse()</code>,
                    <code className="text-secondary bg-zinc-800 px-1 rounded"> .restart()</code> API as a Tween.
                    Controlling the timeline controls <strong className="text-zinc-200">all tweens inside it</strong> at once.
                </>
            }
            pros={[
                "Tweens are sequenced automatically — no manual delay calculation",
                "Controlling one object (the timeline) controls all animations inside",
                "Easily reverse the entire sequence in one call",
            ]}
            cons={[
                "Sequential-only by default — overlapping requires the position parameter",
                "All tweens share the timeline's timeScale — can't slow one independently",
            ]}
            code={`const tl = gsap.timeline();

// Each .to() starts after the previous ends
tl.to(".box1", { x: 220, duration: 0.6 })
  .to(".box2", { x: 220, duration: 0.6 })
  .to(".box3", { x: 220, duration: 0.6 });

// Control the whole sequence
tl.play();
tl.reverse();`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <Track><Box cls="tl-b1" /></Track>
                <Track><Box cls="tl-b2" color="bg-blue-500" /></Track>
                <Track><Box cls="tl-b3" color="bg-purple-500" /></Track>
                <div className="flex gap-2">
                    <Btn label="▶ Play" onClick={play} cls="bg-secondary text-black" />
                    <Btn label="◀ Reverse" onClick={reverse} />
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 2. POSITION PARAMETER
// ─────────────────────────────────────────────
const PositionParamDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const [mode, setMode] = useState<"sequential" | "overlap" | "simultaneous" | "offset">("sequential");

    const { contextSafe } = useGSAP({ scope: containerRef });

    const run = contextSafe(() => {
        gsap.set([".pp-b1", ".pp-b2", ".pp-b3"], { clearProps: "all" });
        tlRef.current?.kill();

        const tl = gsap.timeline();

        if (mode === "sequential") {
            // default — no position param
            tl.to(".pp-b1", { x: 200, duration: 0.8 })
              .to(".pp-b2", { x: 200, duration: 0.8 })
              .to(".pp-b3", { x: 200, duration: 0.8 });
        } else if (mode === "simultaneous") {
            // "<" = start at the same time as previous
            tl.to(".pp-b1", { x: 200, duration: 0.8 })
              .to(".pp-b2", { x: 200, duration: 0.8 }, "<")
              .to(".pp-b3", { x: 200, duration: 0.8 }, "<");
        } else if (mode === "overlap") {
            // "<+=0.2" = 0.2s after start of previous
            tl.to(".pp-b1", { x: 200, duration: 0.8 })
              .to(".pp-b2", { x: 200, duration: 0.8 }, "<+=0.2")
              .to(".pp-b3", { x: 200, duration: 0.8 }, "<+=0.2");
        } else {
            // absolute time: start at exactly 0.4s
            tl.to(".pp-b1", { x: 200, duration: 0.8 })
              .to(".pp-b2", { x: 200, duration: 0.8 }, 0.4)
              .to(".pp-b3", { x: 200, duration: 0.8 }, 0.8);
        }

        tlRef.current = tl;
    });

    const modes = [
        { key: "sequential", label: "default" },
        { key: "simultaneous", label: '"<" — all at once' },
        { key: "overlap", label: '"<+=0.2" — staggered' },
        { key: "offset", label: "absolute time" },
    ] as const;

    return (
        <DemoCard
            label="2. position parameter — control when each tween starts"
            theory={
                <>
                    Every <code className="text-secondary bg-zinc-800 px-1 rounded">.to()</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.from()</code>, and{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.fromTo()</code>
                    on a timeline accepts an optional <strong className="text-zinc-200">position parameter</strong> as
                    the last argument — it sets WHERE on the timeline the tween starts.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1.5 text-[11px] font-mono">
                        <span><code className="text-secondary">{`(none)`}</code> — start after previous tween ends (default)</span>
                        <span><code className="text-secondary">"&lt;"</code> — start at the same time as previous tween</span>
                        <span><code className="text-secondary">"&lt;+=0.3"</code> — start 0.3s after start of previous tween</span>
                        <span><code className="text-secondary">"&gt;-=0.3"</code> — start 0.3s before end of previous tween (overlap)</span>
                        <span><code className="text-secondary">0.5</code> — absolute: start at exactly 0.5s in the timeline</span>
                        <span><code className="text-secondary">"myLabel"</code> — start at a named label position</span>
                    </span>
                </>
            }
            pros={[
                '"<" lets you run multiple tweens simultaneously without splitting into separate gsap.to() calls',
                'Relative offsets like "<+=0.2" create stagger effects with a single timeline',
                "Absolute positions give precise control over complex choreography",
            ]}
            cons={[
                "Position parameters only affect start time — duration is still independent",
                "Mixing absolute and relative positions in one timeline can be confusing to read",
            ]}
            code={`const tl = gsap.timeline();

// Default — sequential
tl.to(".a", { x: 200, duration: 0.8 })
  .to(".b", { x: 200, duration: 0.8 });       // starts after .a ends

// "<" — starts at the same time as previous
tl.to(".a", { x: 200, duration: 0.8 })
  .to(".b", { x: 200, duration: 0.8 }, "<");   // runs with .a

// "<+=0.2" — starts 0.2s after start of previous
tl.to(".a", { x: 200, duration: 0.8 })
  .to(".b", { x: 200, duration: 0.8 }, "<+=0.2");

// absolute time
tl.to(".a", { x: 200, duration: 0.8 })
  .to(".b", { x: 200, duration: 0.8 }, 0.4);  // starts at t=0.4s`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <Track><Box cls="pp-b1" /></Track>
                <Track><Box cls="pp-b2" color="bg-blue-500" /></Track>
                <Track><Box cls="pp-b3" color="bg-purple-500" /></Track>

                <div className="flex gap-1.5 flex-wrap">
                    {modes.map((m) => (
                        <button
                            key={m.key}
                            onClick={() => setMode(m.key)}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${mode === m.key ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
                <Btn label="▶ Run" onClick={run} cls="bg-secondary text-black self-start" />
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 3. TIMELINE CONTROLS
// ─────────────────────────────────────────────
const TimelineControlsDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const [prog, setProg] = useState(0);

    const { contextSafe } = useGSAP({ scope: containerRef });

    useGSAP(() => {
        tlRef.current = gsap.timeline({ paused: true, repeat: -1, yoyo: true,
            onUpdate: function(this: gsap.core.Timeline) {
                setProg(Math.round(this.progress() * 100));
            },
        })
            .to(".tc-b1", { x: 200, rotation: 360, duration: 1, ease: "power2.inOut" })
            .to(".tc-b2", { x: 200, scale: 1.4,    duration: 1, ease: "power2.inOut" }, "<")
            .to(".tc-b3", { x: 200, y: -20,        duration: 1, ease: "bounce.out"  }, "<+=0.2");
    }, { scope: containerRef });

    const seek = (p: number) => {
        tlRef.current?.pause();
        tlRef.current?.progress(p);
        setProg(Math.round(p * 100));
    };

    return (
        <DemoCard
            label="3. timeline controls — same API as Tween"
            theory={
                <>
                    A <strong className="text-zinc-200">Timeline</strong> exposes the exact same playback
                    methods as a Tween — because both extend GSAP's core animation class.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">.play()</code> — play forward from current position</span>
                        <span><code className="text-secondary">.pause()</code> — freeze</span>
                        <span><code className="text-secondary">.resume()</code> — unpause</span>
                        <span><code className="text-secondary">.reverse()</code> — play backward</span>
                        <span><code className="text-secondary">.restart()</code> — jump to start and play</span>
                        <span><code className="text-secondary">.seek(time)</code> — jump to a time in seconds</span>
                        <span><code className="text-secondary">.progress(0–1)</code> — jump to a normalised position</span>
                        <span><code className="text-secondary">.timeScale(n)</code> — speed up or slow down</span>
                    </span>
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">timeScale(2)</code> plays
                    at 2× speed. <code className="text-secondary bg-zinc-800 px-1 rounded">timeScale(0.5)</code> plays
                    at half speed. Negative values play in reverse.
                </>
            }
            pros={[
                "One control object manages all tweens — call .reverse() and every tween reverses",
                "timeScale lets you slow-motion the entire sequence for debugging",
                "progress(0–1) enables scroll-driven control of multi-step animations",
            ]}
            cons={[
                "seek() takes seconds — recalculate if you change individual tween durations",
                "repeat: -1 on a timeline with onUpdate fires indefinitely — clean up on unmount",
            ]}
            code={`const tl = gsap.timeline({ paused: true, repeat: -1, yoyo: true });

tl.to(".a", { x: 200, duration: 1 })
  .to(".b", { scale: 1.4, duration: 1 }, "<");

// All controls work on the timeline:
tl.play();
tl.pause();
tl.reverse();
tl.restart();
tl.seek(0.5);         // jump to 0.5s
tl.progress(0.5);     // jump to 50%
tl.timeScale(2);      // 2× speed`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <Track><Box cls="tc-b1" /></Track>
                <Track><Box cls="tc-b2" color="bg-blue-500" /></Track>
                <Track><Box cls="tc-b3" color="bg-purple-500" /></Track>

                {/* Progress bar */}
                <div className="bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-none" style={{ width: `${prog}%` }} />
                </div>
                <p className="text-zinc-400 text-[11px] font-mono">progress: {prog}%</p>

                <div className="flex gap-2 flex-wrap">
                    <Btn label="▶ play"    onClick={() => tlRef.current?.play()}    cls="bg-secondary text-black" />
                    <Btn label="⏸ pause"   onClick={() => tlRef.current?.pause()} />
                    <Btn label="▷ resume"  onClick={() => tlRef.current?.resume()} />
                    <Btn label="◀ reverse" onClick={() => tlRef.current?.reverse()} cls="bg-blue-700 text-white" />
                    <Btn label="↺ restart" onClick={() => tlRef.current?.restart()} />
                    <Btn label="0.5× slow" onClick={() => tlRef.current?.timeScale(0.5)} cls="bg-zinc-600 text-white" />
                    <Btn label="2× fast"   onClick={() => tlRef.current?.timeScale(2)}   cls="bg-zinc-600 text-white" />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-[11px] font-mono w-28">scrub progress</span>
                    <input type="range" min={0} max={1} step={0.01} value={prog / 100}
                        onChange={(e) => seek(parseFloat(e.target.value))}
                        className="flex-1 accent-secondary" />
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. STAGGER
// ─────────────────────────────────────────────
const StaggerDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [stagger, setStagger] = useState(0.1);
    const [from, setFrom] = useState<"start" | "center" | "end" | "random">("start");

    const { contextSafe } = useGSAP({ scope: containerRef });

    const run = contextSafe(() => {
        gsap.set(".stg-box", { clearProps: "all" });
        gsap.from(".stg-box", {
            y: 40,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: { amount: stagger * 5, from },
        });
    });

    return (
        <DemoCard
            label="4. stagger — animate many elements with offset"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">stagger</code> delays
                    the start of each element in a multi-target tween.
                    Pass a <strong className="text-zinc-200">number</strong> (seconds between each),
                    or an <strong className="text-zinc-200">object</strong> for advanced control.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1.5 text-[11px] font-mono">
                        <span><code className="text-secondary">stagger: 0.1</code> — 0.1s between each element</span>
                        <span><code className="text-secondary">{`stagger: { amount: 0.5, from: "center" }`}</code> — distribute 0.5s total, starting from center</span>
                        <span><code className="text-secondary">{`stagger: { each: 0.1, from: "random" }`}</code> — 0.1s each, random order</span>
                        <span><code className="text-secondary">{`stagger: { each: 0.1, from: "end" }`}</code> — reverse order</span>
                    </span>
                    <br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">amount</code> distributes
                    a total time across all elements.{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">each</code> sets
                    a fixed delay per element.
                </>
            }
            pros={[
                "stagger: 0.1 in a single gsap.to() replaces a whole forEach loop",
                "from: 'center' creates ripple effects without any extra code",
                "amount vs each: amount adapts to array length, each is always fixed",
            ]}
            cons={[
                "stagger adds to total duration — a 5-element stagger of 0.2s adds 1s total",
                "random order isn't seeded — re-running picks a new random sequence each time",
            ]}
            code={`// Simple stagger — 0.1s between each
gsap.from(".box", { y: 40, opacity: 0, duration: 0.5, stagger: 0.1 });

// Advanced stagger object
gsap.from(".box", {
  y: 40, opacity: 0, duration: 0.5,
  stagger: {
    amount: 0.6,      // 0.6s spread across ALL elements
    from: "center",   // start from middle outward
  },
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="stg-box w-9 h-9 rounded-lg bg-secondary opacity-100" />
                    ))}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-36">amount: {(stagger * 5).toFixed(1)}s</span>
                        <input type="range" min={0.04} max={0.4} step={0.02} value={stagger}
                            onChange={(e) => setStagger(parseFloat(e.target.value))}
                            className="flex-1 accent-secondary" />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {(["start", "center", "end", "random"] as const).map((f) => (
                            <button key={f} onClick={() => setFrom(f)}
                                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${from === f ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}>
                                from: {f}
                            </button>
                        ))}
                    </div>
                </div>

                <Btn label="▶ Run" onClick={run} cls="bg-secondary text-black self-start" />
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 5. NESTED TIMELINES
// ─────────────────────────────────────────────
const NestedTimelineDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const masterRef = useRef<gsap.core.Timeline | null>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const build = contextSafe(() => {
        gsap.set([".nt-a", ".nt-b", ".nt-c", ".nt-d"], { clearProps: "all" });
        masterRef.current?.kill();

        // Sub-timeline A: two boxes animate together
        const tlA = gsap.timeline()
            .to(".nt-a", { x: 200, duration: 0.6, ease: "power2.out" })
            .to(".nt-b", { x: 200, duration: 0.6, ease: "power2.out" }, "<");

        // Sub-timeline B: two boxes bounce in
        const tlB = gsap.timeline()
            .from(".nt-c", { y: -40, opacity: 0, duration: 0.5, ease: "bounce.out" })
            .from(".nt-d", { y: -40, opacity: 0, duration: 0.5, ease: "bounce.out" }, "<+=0.15");

        // Master: runs tlA, then tlB
        masterRef.current = gsap.timeline()
            .add(tlA)
            .add(tlB, "+=0.2");  // 0.2s gap after tlA
    });

    return (
        <DemoCard
            label="5. nested timelines — compose complex sequences"
            theory={
                <>
                    You can <code className="text-secondary bg-zinc-800 px-1 rounded">.add()</code> a
                    timeline <em>inside</em> another timeline using{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.add(childTl, position)</code>.
                    This is called <strong className="text-zinc-200">nesting</strong>.
                    <br /><br />
                    Nesting lets you build animations in reusable, isolated pieces:
                    define a <em>button hover</em> timeline in one function,
                    a <em>card enter</em> in another, then compose them in a master.
                    <br /><br />
                    The master timeline controls all nested timelines with a single
                    <code className="text-secondary bg-zinc-800 px-1 rounded"> .reverse()</code> or{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">.seek()</code>.
                </>
            }
            pros={[
                "Build animations as isolated functions, compose them in a master timeline",
                "Master .reverse() reverses all nested timelines — perfect for intro/outro",
                "Nested timelines can have their own repeat, yoyo, or ease independently",
            ]}
            cons={[
                "Deeply nested timelines are harder to debug — use GSDevTools",
                "Killing the master doesn't automatically kill nested timelines if stored separately",
            ]}
            code={`// Build two sub-timelines separately
const enterTl = gsap.timeline()
  .from(".title", { y: -30, opacity: 0, duration: 0.5 })
  .from(".subtitle", { y: -20, opacity: 0, duration: 0.4 }, "<+=0.1");

const exitTl = gsap.timeline()
  .to(".title", { y: 30, opacity: 0, duration: 0.4 })
  .to(".subtitle", { y: 20, opacity: 0, duration: 0.3 }, "<");

// Compose in a master
const master = gsap.timeline()
  .add(enterTl)
  .add(exitTl, "+=1");   // 1s after enterTl ends

master.reverse(); // reverses everything`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <p className="text-zinc-500 text-[11px] font-mono">Sub-timeline A</p>
                <Track><Box cls="nt-a" /></Track>
                <Track><Box cls="nt-b" color="bg-blue-500" /></Track>
                <p className="text-zinc-500 text-[11px] font-mono">Sub-timeline B (added 0.2s after A)</p>
                <Track><Box cls="nt-c" color="bg-purple-500" /></Track>
                <Track><Box cls="nt-d" color="bg-pink-500" /></Track>

                <div className="flex gap-2">
                    <Btn label="▶ Play master" onClick={build} cls="bg-secondary text-black" />
                    <Btn label="◀ Reverse"      onClick={() => masterRef.current?.reverse()} />
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 6. TIMELINE DEFAULTS
// ─────────────────────────────────────────────
const TimelineDefaultsDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const run = contextSafe(() => {
        gsap.set([".td-b1", ".td-b2", ".td-b3"], { clearProps: "all" });
        // defaults apply to every tween inside unless overridden
        gsap.timeline({ defaults: { duration: 0.8, ease: "elastic.out(1, 0.5)" } })
            .to(".td-b1", { x: 200 })
            .to(".td-b2", { x: 200 })
            .to(".td-b3", { x: 200, ease: "power2.out" }); // ← overrides defaults.ease
    });

    return (
        <DemoCard
            label="6. timeline defaults — share common props across all tweens"
            theory={
                <>
                    Pass a <code className="text-secondary bg-zinc-800 px-1 rounded">defaults</code> object
                    when creating a timeline — any property in it is applied to <strong className="text-zinc-200">every
                    tween inside</strong> unless that tween overrides it explicitly.
                    <br /><br />
                    This is the cleanest way to avoid repeating{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">ease</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">duration</code>, or{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">overwrite</code> on
                    every single tween.
                    <br /><br />
                    Individual tweens can <strong className="text-zinc-200">override defaults</strong> by
                    specifying the property — the tween's value always wins.
                </>
            }
            pros={[
                "Eliminates repetition — set duration/ease once for the whole timeline",
                "Tween-level override still works — defaults are just fallbacks",
                "Combined with gsap.defaults() you can set app-wide and timeline-level defaults",
            ]}
            cons={[
                "Easy to forget a tween is inheriting defaults — can cause unexpected behavior",
                "defaults only applies inside that specific timeline, not globally",
            ]}
            code={`const tl = gsap.timeline({
  defaults: {
    duration: 0.8,
    ease: "elastic.out(1, 0.5)",
  },
});

tl.to(".a", { x: 200 })           // uses defaults
  .to(".b", { x: 200 })           // uses defaults
  .to(".c", { x: 200, ease: "power2.out" }); // overrides ease only`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <Track><Box cls="td-b1" /></Track>
                <Track><Box cls="td-b2" color="bg-blue-500" /></Track>
                <Track>
                    <div className="relative">
                        <Box cls="td-b3" color="bg-purple-500" />
                        <span className="absolute -top-4 left-0 text-[10px] text-zinc-500 font-mono whitespace-nowrap">overrides ease</span>
                    </div>
                </Track>
                <Btn label="▶ Run" onClick={run} cls="bg-secondary text-black self-start" />
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────
const LearningTimeline = () => (
    <Container>
        <div className="flex flex-col gap-3 mb-8">
            <h2 className="text-2xl font-bold text-white font-mono">Timeline</h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                A <strong className="text-zinc-200">Timeline</strong> is a container that sequences multiple tweens.
                It has the same playback API as a Tween — but controls all animations inside it at once.
                Use the <strong className="text-zinc-200">position parameter</strong> to overlap tweens,
                <strong className="text-zinc-200"> stagger</strong> to offset many elements,
                <strong className="text-zinc-200"> defaults</strong> to share common props, and
                <strong className="text-zinc-200"> nesting</strong> to compose complex sequences from reusable pieces.
            </p>
        </div>
        <div className="flex flex-col gap-5">
            <BasicTimelineDemo />
            <PositionParamDemo />
            <TimelineControlsDemo />
            <StaggerDemo />
            <NestedTimelineDemo />
            <TimelineDefaultsDemo />
        </div>
    </Container>
);

export default LearningTimeline;
