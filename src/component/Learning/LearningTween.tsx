"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(useGSAP);


// ─────────────────────────────────────────────
// 1. TWEEN INSTANCE — store & control
// ─────────────────────────────────────────────
const TweenInstanceDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const [status, setStatus] = useState("idle");

    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        tweenRef.current?.kill();
        tweenRef.current = gsap.to(".tween-box", {
            x: 220,
            duration: 2,
            ease: "power2.inOut",
            paused: false,
            onStart: () => setStatus("running"),
            onComplete: () => setStatus("complete"),
        });
    });

    const pause = () => {
        tweenRef.current?.pause();
        setStatus("paused");
    };

    const resume = () => {
        tweenRef.current?.resume();
        setStatus("running");
    };

    const reverse = () => {
        tweenRef.current?.reverse();
        setStatus("reversing");
    };

    const restart = contextSafe(() => {
        tweenRef.current?.restart();
        setStatus("running");
    });

    const kill = contextSafe(() => {
        tweenRef.current?.kill();
        gsap.set(".tween-box", { clearProps: "all" });
        setStatus("killed");
    });

    const statusColor: Record<string, string> = {
        idle: "text-zinc-400",
        running: "text-emerald-400",
        paused: "text-yellow-400",
        reversing: "text-blue-400",
        complete: "text-secondary",
        killed: "text-red-400",
    };

    return (
        <DemoCard
            label="1. tween instance & controls"
            theory={
                <>
                    Every <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.from()</code>, and{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.fromTo()</code> returns a{" "}
                    <strong className="text-zinc-200">Tween instance</strong>.
                    Storing it in a <code className="text-secondary bg-zinc-800 px-1 rounded">useRef</code> gives you
                    full playback control from anywhere in your component.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">.pause()</code> — freeze at current position</span>
                        <span><code className="text-secondary">.resume()</code> — continue from where it paused</span>
                        <span><code className="text-secondary">.reverse()</code> — play backward from current position</span>
                        <span><code className="text-secondary">.restart()</code> — jump to start and play forward</span>
                        <span><code className="text-secondary">.kill()</code> — destroy tween, free memory</span>
                        <span><code className="text-secondary">.progress(0.5)</code> — jump to 50% of the tween</span>
                        <span><code className="text-secondary">.time(1)</code> — jump to 1 second in</span>
                        <span><code className="text-secondary">.duration()</code> — get total duration</span>
                        <span><code className="text-secondary">.isActive()</code> — true while running</span>
                        <span><code className="text-secondary">.paused()</code> — true if paused</span>
                    </span>
                </>
            }
            pros={[
                "Full imperative control — pause on user input, reverse on hover-out, etc.",
                "kill() removes all tweens and cleans up scheduled callbacks — prevents memory leaks",
                "progress(0–1) lets you scrub animations exactly like a ScrollTrigger",
                "reverse() plays back from the exact current position — no jump to end first",
            ]}
            cons={[
                "Must store the Tween in a ref — not state, re-creating on every render is wasteful",
                "kill() destroys the tween; you must create a new one to play again",
                "Calling play() on a completed (not paused) tween does nothing — use restart()",
            ]}
            code={`const tweenRef = useRef<gsap.core.Tween | null>(null);

// Create the tween (paused or playing)
tweenRef.current = gsap.to(".box", {
  x: 220, duration: 2, ease: "power2.inOut",
});

// Control it anywhere
tweenRef.current.pause();
tweenRef.current.resume();
tweenRef.current.reverse();
tweenRef.current.restart();
tweenRef.current.kill();

// Scrub to 50%
tweenRef.current.progress(0.5);

// Jump to 1.2 seconds
tweenRef.current.time(1.2);`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                {/* Track */}
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden px-2">
                    <div className="tween-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                </div>

                {/* Status */}
                <p className={`text-[11px] font-mono ${statusColor[status] ?? "text-zinc-400"}`}>
                    status: <strong>{status}</strong>
                </p>

                {/* Controls */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { label: "▶ play", fn: play, cls: "bg-secondary text-black" },
                        { label: "⏸ pause", fn: pause, cls: "bg-zinc-700 text-white" },
                        { label: "▷ resume", fn: resume, cls: "bg-zinc-700 text-white" },
                        { label: "◀ reverse", fn: reverse, cls: "bg-blue-700 text-white" },
                        { label: "↺ restart", fn: restart, cls: "bg-zinc-700 text-white" },
                        { label: "✕ kill", fn: kill, cls: "bg-red-700 text-white" },
                    ].map(({ label, fn, cls }) => (
                        <button
                            key={label}
                            onClick={fn}
                            className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${cls}`}
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
// 2. CALLBACKS
// ─────────────────────────────────────────────
const CallbacksDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [log, setLog] = useState<string[]>(["— waiting for animation —"]);
    const [progress, setProgress] = useState(0);

    const push = (msg: string) =>
        setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 7)]);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        setLog(["— started —"]);
        setProgress(0);
        gsap.fromTo(
            ".cb-box",
            { x: 0 },
            {
                x: 220,
                duration: 2,
                ease: "power2.inOut",
                repeat: 1,
                yoyo: true,
                onStart: () => push("onStart — tween began"),
                onUpdate: function () {
                    setProgress(Math.round((this as gsap.core.Tween).progress() * 100));
                    if (Math.round((this as gsap.core.Tween).progress() * 100) % 10 === 0) {
                        push(`onUpdate — ${Math.round((this as gsap.core.Tween).progress() * 100)}%`);
                    }
                },
                onRepeat: () => push("onRepeat — loop restarted"),
                onReverseComplete: () => push("onReverseComplete — reversed to start"),
                onComplete: () => push("onComplete — finished"),
            }
        );
    });

    return (
        <DemoCard
            label="2. callbacks"
            theory={
                <>
                    GSAP tweens fire <strong className="text-zinc-200">lifecycle callbacks</strong> at key moments.
                    Add them directly inside the vars object passed to <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code>.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">onStart</code> — fires once when the tween begins playing</span>
                        <span><code className="text-secondary">onUpdate</code> — fires every frame while the tween is active</span>
                        <span><code className="text-secondary">onComplete</code> — fires when the tween finishes (forward direction)</span>
                        <span><code className="text-secondary">onRepeat</code> — fires each time the tween loops (needs repeat &gt; 0)</span>
                        <span><code className="text-secondary">onReverseComplete</code> — fires when a reversed tween reaches the start</span>
                    </span>
                    <br />
                    Inside <code className="text-secondary bg-zinc-800 px-1 rounded">onUpdate</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">this</code> refers
                    to the Tween instance — use <code className="text-secondary bg-zinc-800 px-1 rounded">this.progress()</code> to read playback position.
                    Use <strong>regular functions</strong> (not arrow functions) for callbacks where you need <code className="text-secondary bg-zinc-800 px-1 rounded">this</code>.
                </>
            }
            pros={[
                "onUpdate fires every frame — ideal for driving React state, progress bars, counters",
                "onComplete is the cleanest place to chain the next animation",
                "this.progress() inside onUpdate gives a 0–1 scrub value for free",
            ]}
            cons={[
                "onUpdate fires 60× per second — keep it cheap (no heavy state updates inside)",
                "Arrow functions lose the 'this' context — use regular functions when reading this.progress()",
                "Callbacks aren't cleaned up if you kill() mid-animation — handle manually if needed",
            ]}
            code={`gsap.to(".box", {
  x: 220,
  duration: 2,
  repeat: 1,
  yoyo: true,

  onStart() { console.log("started"); },

  onUpdate() {
    // 'this' = the Tween instance
    console.log("progress:", this.progress());
  },

  onRepeat() { console.log("looped"); },

  onReverseComplete() { console.log("reversed to start"); },

  onComplete() { console.log("done"); },
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden px-2">
                    <div className="cb-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                </div>

                {/* Progress bar */}
                <div className="bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-secondary rounded-full transition-none"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <button onClick={play} className="self-start px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">
                    ▶ Play (repeat + yoyo)
                </button>

                {/* Log */}
                <div className="bg-zinc-950 rounded-xl p-3 font-mono text-[11px] flex flex-col gap-1 max-h-40 overflow-y-auto">
                    {log.map((l, i) => (
                        <span key={i} className={i === 0 ? "text-secondary" : "text-zinc-500"}>{l}</span>
                    ))}
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 3. REPEAT & YOYO
// ─────────────────────────────────────────────
const RepeatYoyoDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const [repeat, setRepeat] = useState(2);
    const [yoyo, setYoyo] = useState(false);
    const [repeatDelay, setRepeatDelay] = useState(0);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const play = contextSafe(() => {
        tweenRef.current?.kill();
        gsap.set(".ry-box", { clearProps: "all" });
        tweenRef.current = gsap.to(".ry-box", {
            x: 220,
            duration: 0.7,
            ease: "power2.inOut",
            repeat,
            yoyo,
            repeatDelay,
        });
    });

    const stop = contextSafe(() => {
        tweenRef.current?.kill();
        gsap.set(".ry-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="3. repeat & yoyo"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">repeat</code> replays
                    the tween after it completes. <code className="text-secondary bg-zinc-800 px-1 rounded">repeat: -1</code> loops
                    forever. <code className="text-secondary bg-zinc-800 px-1 rounded">repeat: 2</code> plays
                    a total of 3 times (original + 2 repeats).
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">yoyo: true</code> makes
                    every other cycle play <strong className="text-zinc-200">in reverse</strong>,
                    so the animation bounces back and forth seamlessly.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">repeatDelay</code> inserts
                    a pause (seconds) between each repeat — useful for breathing room between loops.
                </>
            }
            pros={[
                "repeat: -1 creates an infinite loop with zero overhead — cleaner than setInterval",
                "yoyo: true gives a smooth ping-pong with no jump back — values reverse naturally",
                "repeatDelay creates natural rhythm for attention-drawing animations",
            ]}
            cons={[
                "repeat counts repeats, not total plays — repeat: 2 = 3 total plays",
                "yoyo only affects the tween direction, not the ease — ease applies in both directions",
                "Infinite tweens (repeat: -1) must be killed manually to stop — they never complete",
            ]}
            code={`gsap.to(".box", {
  x: 220,
  duration: 0.7,
  ease: "power2.inOut",

  repeat: 2,         // play 3× total  (use -1 for infinite)
  yoyo: true,        // reverse every other cycle
  repeatDelay: 0.3,  // pause 0.3s between each cycle
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden px-2">
                    <div className="ry-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-32">repeat: {repeat === -1 ? "−1 (∞)" : repeat}</span>
                        <input type="range" min={-1} max={5} step={1} value={repeat}
                            onChange={(e) => setRepeat(parseInt(e.target.value))}
                            className="flex-1 accent-secondary" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-[11px] font-mono w-32">repeatDelay: {repeatDelay}s</span>
                        <input type="range" min={0} max={1.5} step={0.1} value={repeatDelay}
                            onChange={(e) => setRepeatDelay(parseFloat(e.target.value))}
                            className="flex-1 accent-secondary" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-400 text-[11px] font-mono select-none">
                        <input type="checkbox" checked={yoyo} onChange={(e) => setYoyo(e.target.checked)}
                            className="accent-secondary w-3.5 h-3.5" />
                        yoyo: {yoyo ? "true" : "false"}
                    </label>
                </div>

                <div className="flex gap-2">
                    <button onClick={play} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">▶ Play</button>
                    <button onClick={stop} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">■ Stop</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. OVERWRITE
// ─────────────────────────────────────────────
const OverwriteDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [mode, setMode] = useState<"none" | "auto" | true>("auto");

    const spamTweens = contextSafe(() => {
        // Fire 3 conflicting tweens in quick succession
        gsap.to(".ow-box", { x: 80, duration: 1.5, ease: "power2.out", overwrite: mode });
        setTimeout(() => {
            gsap.to(".ow-box", { x: 160, duration: 1.5, ease: "power2.out", overwrite: mode });
        }, 300);
        setTimeout(() => {
            gsap.to(".ow-box", { x: 240, duration: 1.5, ease: "power2.out", overwrite: mode });
        }, 600);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".ow-box");
        gsap.set(".ow-box", { clearProps: "all" });
    });

    return (
        <DemoCard
            label="4. overwrite"
            theory={
                <>
                    When two tweens animate the <strong className="text-zinc-200">same property on the same target</strong>,
                    GSAP has to decide what to do. <code className="text-secondary bg-zinc-800 px-1 rounded">overwrite</code> controls this.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-2 text-[11px] font-mono">
                        <span>
                            <code className="text-secondary">overwrite: false</code> (default) — both tweens run simultaneously.
                            They fight over the property, causing <strong className="text-zinc-200">jitter</strong>.
                        </span>
                        <span>
                            <code className="text-secondary">overwrite: "auto"</code> — GSAP only kills the conflicting
                            properties on older tweens. Non-conflicting properties survive.
                            <strong className="text-zinc-200"> Recommended default.</strong>
                        </span>
                        <span>
                            <code className="text-secondary">overwrite: true</code> — kills ALL active tweens on the
                            target entirely before starting the new one.
                        </span>
                    </span>
                    <br />
                    You can also set the global default: <code className="text-secondary bg-zinc-800 px-1 rounded">{"gsap.defaults({ overwrite: 'auto' })"}</code>
                </>
            }
            pros={[
                "'auto' is surgical — only kills the specific conflicting property, not the whole tween",
                "Setting gsap.defaults({ overwrite: 'auto' }) prevents jitter across your whole app",
                "true (full overwrite) is useful when you know a new animation should fully replace the old",
            ]}
            cons={[
                "false (default) causes fighting/jitter when multiple tweens target the same property",
                "true kills ALL properties on the target — beware if other properties should keep animating",
                "'auto' adds a small cost per tween to scan active tweens — irrelevant at normal scale",
            ]}
            code={`// Set globally once at app startup
gsap.defaults({ overwrite: "auto" });

// Or per-tween
gsap.to(".box", {
  x: 200,
  overwrite: "auto",  // only kills conflicting props on older tweens
  // overwrite: true   // kills ALL active tweens on this target
  // overwrite: false  // (default) let tweens fight → jitter
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden px-2">
                    <div className="ow-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                </div>

                {/* Mode toggle */}
                <div className="flex gap-1.5 flex-wrap">
                    {(["none", "auto", true] as const).map((m) => (
                        <button
                            key={String(m)}
                            onClick={() => setMode(m)}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${mode === m ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}
                        >
                            overwrite: {m === true ? "true" : `"${m}"`}
                        </button>
                    ))}
                </div>

                <p className="text-zinc-400 text-[11px] font-mono">
                    Hit <strong className="text-white">Spam</strong> to fire 3 conflicting tweens 300ms apart.
                    Watch for jitter vs clean motion.
                </p>

                <div className="flex gap-2">
                    <button onClick={spamTweens} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Spam tweens</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 5. PROGRESS / SEEK
// ─────────────────────────────────────────────
const ProgressDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const [prog, setProg] = useState(0);

    const { contextSafe } = useGSAP({ scope: containerRef });

    useGSAP(() => {
        tweenRef.current = gsap.to(".prog-box", {
            x: 220,
            rotation: 360,
            scale: 1.4,
            duration: 2,
            ease: "power2.inOut",
            paused: true,   // create paused — we scrub manually
        });
    }, { scope: containerRef });

    const scrub = (val: number) => {
        setProg(val);
        tweenRef.current?.progress(val);
    };

    const scrubTime = contextSafe((t: number) => {
        tweenRef.current?.time(t);
        setProg(tweenRef.current?.progress() ?? 0);
    });

    return (
        <DemoCard
            label="5. progress() & time() — scrubbing"
            theory={
                <>
                    A tween's playback position can be set directly without playing it —
                    this is called <strong className="text-zinc-200">scrubbing</strong>.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">tween.progress(0–1)</code> jumps to
                    a normalised position (0 = start, 0.5 = halfway, 1 = end).
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">tween.time(seconds)</code> jumps to
                    an absolute time in seconds.
                    <br /><br />
                    Create the tween with <code className="text-secondary bg-zinc-800 px-1 rounded">paused: true</code> so
                    it doesn't auto-play. Then drive it from a range input, scroll event, or drag
                    — this is the foundation of <strong className="text-zinc-200">ScrollTrigger scrub animations</strong>.
                </>
            }
            pros={[
                "paused: true + progress() is the manual equivalent of ScrollTrigger scrub",
                "progress() is normalised (0–1) — independent of duration changes",
                "Scrubbing is instant — no interpolation overhead, just a direct value set",
                "Works perfectly with useRef — no React state needed for the tween position",
            ]}
            cons={[
                "Must create the tween with paused: true — otherwise it plays before you scrub",
                "tween.time() takes seconds — recalculate if you change duration later",
                "progress(1) on a non-repeating tween fires onComplete — guard against this if needed",
            ]}
            code={`// Create paused tween
const tween = gsap.to(".box", {
  x: 220, rotation: 360, scale: 1.4,
  duration: 2,
  ease: "power2.inOut",
  paused: true,   // ← key: don't auto-play
});

// Scrub by normalised progress (0–1)
tween.progress(0.5);    // jump to 50%

// Scrub by absolute time (seconds)
tween.time(1.2);        // jump to 1.2s

// Combine with scroll
window.addEventListener("scroll", () => {
  const ratio = window.scrollY / document.body.scrollHeight;
  tween.progress(ratio);
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="relative bg-zinc-900 rounded-xl h-14 overflow-hidden px-2">
                    <div className="prog-box absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-secondary" />
                </div>

                {/* Scrub slider */}
                <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-[11px] font-mono w-32">progress: {(prog * 100).toFixed(0)}%</span>
                    <input
                        type="range" min={0} max={1} step={0.01}
                        value={prog}
                        onChange={(e) => scrub(parseFloat(e.target.value))}
                        className="flex-1 accent-secondary"
                    />
                </div>

                {/* Jump by time */}
                <div className="flex gap-2 flex-wrap">
                    <span className="text-zinc-400 text-[11px] font-mono self-center">seek to time:</span>
                    {[0, 0.5, 1, 1.5, 2].map((t) => (
                        <button key={t} onClick={() => scrubTime(t)}
                            className="px-2.5 py-1 rounded bg-zinc-700 text-zinc-300 text-[11px] font-mono hover:bg-zinc-600 transition-colors">
                            {t}s
                        </button>
                    ))}
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 6. SPECIAL VARS — paused, immediateRender, lazy
// ─────────────────────────────────────────────
const SpecialVarsDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const playPaused = contextSafe(() => {
        const t = gsap.to(".sv-box-paused", {
            x: 180, duration: 1.2, ease: "power2.out",
            paused: true,   // create without auto-playing
        });
        setTimeout(() => t.play(), 800); // play after 800ms manually
    });

    const playImmediate = contextSafe(() => {
        // immediateRender: false on a gsap.from — box appears at final position first,
        // then jumps to start and animates. Useful to avoid flicker.
        gsap.set(".sv-box-ir", { clearProps: "all" });
        gsap.from(".sv-box-ir", {
            x: -100, opacity: 0,
            duration: 1, ease: "power2.out",
            immediateRender: false,  // ← don't snap to 'from' values right away
        });
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf([".sv-box-paused", ".sv-box-ir"]);
        gsap.set([".sv-box-paused", ".sv-box-ir"], { clearProps: "all" });
    });

    return (
        <DemoCard
            label="6. special vars — paused, immediateRender"
            theory={
                <>
                    GSAP vars objects accept several <strong className="text-zinc-200">special non-animated properties</strong> that
                    control tween behaviour.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-2 text-[11px] font-mono">
                        <span>
                            <code className="text-secondary">paused: true</code> — create the tween without
                            starting it. Call <code className="text-secondary">.play()</code> later.
                            Essential for scrub animations and event-driven triggers.
                        </span>
                        <span>
                            <code className="text-secondary">immediateRender: false</code> — by default,
                            <code className="text-secondary"> gsap.from()</code> and <code className="text-secondary">gsap.fromTo()</code>
                            snap the element to the "from" values immediately (before the tween starts).
                            Setting this to <code className="text-secondary">false</code> delays that snap until the tween
                            actually begins playing — prevents invisible elements before they should animate in.
                        </span>
                        <span>
                            <code className="text-secondary">id: "myTween"</code> — name a tween so you can
                            retrieve it anywhere with <code className="text-secondary">gsap.getById("myTween")</code>.
                        </span>
                        <span>
                            <code className="text-secondary">lazy: false</code> — by default GSAP batches first-frame
                            renders for performance. Set to <code className="text-secondary">false</code> to render immediately.
                        </span>
                    </span>
                </>
            }
            pros={[
                "paused: true is the cleanest pattern for scroll-driven or hover-triggered animations",
                "immediateRender: false prevents 'flash of un-animated content' in gsap.from()",
                "id lets you reference tweens by name from anywhere — no need to pass refs around",
            ]}
            cons={[
                "immediateRender defaults to true for gsap.from — can surprise you with snap-to-start on load",
                "lazy batching is usually beneficial — only disable if you measure a specific rendering issue",
            ]}
            code={`// paused: create now, play later
const tween = gsap.to(".box", {
  x: 180, duration: 1.2,
  paused: true,
});
btn.addEventListener("click", () => tween.play());

// immediateRender: false — don't snap to 'from' values until tween plays
gsap.from(".box", {
  x: -100, opacity: 0,
  duration: 1,
  immediateRender: false,
});

// id — retrieve a tween by name anywhere
gsap.to(".box", { x: 200, id: "slideRight" });
const t = gsap.getById("slideRight");
t.reverse();`}
        >
            <div ref={containerRef} className="flex flex-col gap-5">
                {/* paused demo */}
                <div className="flex flex-col gap-2">
                    <p className="text-zinc-400 text-[11px] font-mono">
                        paused: true — plays 800ms after creation
                    </p>
                    <div className="relative bg-zinc-900 rounded-xl h-12 overflow-hidden px-2">
                        <div className="sv-box-paused absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-secondary" />
                    </div>
                </div>

                {/* immediateRender demo */}
                <div className="flex flex-col gap-2">
                    <p className="text-zinc-400 text-[11px] font-mono">
                        immediateRender: false — box stays in place until animation starts
                    </p>
                    <div className="relative bg-zinc-900 rounded-xl h-12 overflow-hidden px-2">
                        <div className="sv-box-ir absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-blue-500" />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={playPaused} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">
                        Play paused
                    </button>
                    <button onClick={playImmediate} className="px-3 py-1 rounded bg-blue-600 text-white text-sm font-semibold">
                        Play immediateRender:false
                    </button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">
                        Reset
                    </button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────
const LearningTween = () => (
    <Container>
        <div className="flex flex-col gap-3 mb-8">
            <h2 className="text-2xl font-bold text-white font-mono">Tween</h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                A <strong className="text-zinc-200">Tween</strong> is a single animation —
                the object returned by <code className="text-secondary bg-zinc-800 px-1 rounded text-xs">gsap.to()</code>,{" "}
                <code className="text-secondary bg-zinc-800 px-1 rounded text-xs">gsap.from()</code>, or{" "}
                <code className="text-secondary bg-zinc-800 px-1 rounded text-xs">gsap.fromTo()</code>.
                Storing it gives you full control: pause, resume, reverse, scrub, or kill it at any time.
                Callbacks fire at lifecycle events. Repeat and yoyo drive looping.
                Overwrite prevents conflicts when multiple tweens target the same property.
            </p>
        </div>

        <div className="flex flex-col gap-5">
            <TweenInstanceDemo />
            <CallbacksDemo />
            <RepeatYoyoDemo />
            <OverwriteDemo />
            <ProgressDemo />
            <SpecialVarsDemo />
        </div>
    </Container>
);

export default LearningTween;
