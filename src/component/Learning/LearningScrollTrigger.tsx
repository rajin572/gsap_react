"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────
const ScrollBox = ({
    children,
    h = "h-72",
    ref: forwardRef,
}: {
    children: React.ReactNode;
    h?: string;
    ref?: React.RefObject<HTMLDivElement | null>;
}) => (
    <div
        ref={forwardRef}
        className={`${h} overflow-y-scroll bg-zinc-900 rounded-xl relative`}
        style={{ scrollbarWidth: "thin" }}
    >
        {children}
    </div>
);


// ─────────────────────────────────────────────
// 1. BASIC SCROLL TRIGGER — trigger + toggleActions
// ─────────────────────────────────────────────
const BasicSTDemo = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".st-basic-box", {
            x: -150,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".st-basic-box",
                scroller: scrollerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });
    }, { scope: scrollerRef });

    return (
        <DemoCard
            label="1. basic scrolltrigger — animate when element enters viewport"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">ScrollTrigger</code> links
                    a GSAP animation to the scroll position. Add a{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">scrollTrigger</code> object
                    inside any tween's vars.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1.5 text-[11px] font-mono">
                        <span><code className="text-secondary">trigger</code> — the element that triggers the animation</span>
                        <span><code className="text-secondary">start</code> — "triggerEdge scrollerEdge" — e.g. "top 80%"</span>
                        <span><code className="text-secondary">end</code> — when the trigger ends</span>
                        <span><code className="text-secondary">toggleActions</code> — "onEnter onLeave onEnterBack onLeaveBack"</span>
                        <span><code className="text-secondary">scroller</code> — custom scroll container (defaults to window)</span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">toggleActions</strong> accepts 4 values in order:{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">play</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">pause</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">resume</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">reset</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">restart</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">complete</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">reverse</code>, or{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">none</code>.
                </>
            }
            pros={[
                "Zero JS scroll math — GSAP calculates trigger positions automatically",
                "toggleActions lets you reverse on scroll-back without any listener code",
                "Works with any scrollable container via the scroller option",
            ]}
            cons={[
                "ScrollTrigger must be registered: gsap.registerPlugin(ScrollTrigger)",
                "Custom scrollers (overflow containers) need scroller option set explicitly",
                "Markers should be removed before production — they add DOM nodes",
            ]}
            code={`gsap.registerPlugin(ScrollTrigger);

gsap.from(".box", {
  x: -150,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".box",
    start: "top 80%",   // when top of .box hits 80% down the viewport
    end: "top 20%",     // when top of .box hits 20% down the viewport
    toggleActions: "play none none reverse",
    // onEnter    onLeave  onEnterBack  onLeaveBack
  },
});`}
        >
            <div>
                <p className="text-zinc-500 text-[11px] font-mono mb-2">Scroll down inside the box ↓</p>
                <div
                    ref={scrollerRef}
                    className="h-72 overflow-y-scroll bg-zinc-900 rounded-xl"
                    style={{ scrollbarWidth: "thin" }}
                >
                    <div className="h-48 flex items-center justify-center text-zinc-600 text-sm font-mono">
                        ↓ keep scrolling
                    </div>
                    <div className="st-basic-box mx-6 mb-10 p-5 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary shrink-0" />
                        <p className="text-zinc-300 text-sm">This box slides in when it enters the viewport.</p>
                    </div>
                    <div className="h-24" />
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 2. START / END — position syntax
// ─────────────────────────────────────────────
const StartEndDemo = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [config, setConfig] = useState<"top80" | "center50" | "bottom10">("top80");

    const configs = {
        top80:    { start: "top 80%",    end: "top 20%",    label: 'start: "top 80%"  end: "top 20%"' },
        center50: { start: "center 50%", end: "center 10%", label: 'start: "center 50%"  end: "center 10%"' },
        bottom10: { start: "bottom 90%", end: "bottom 30%", label: 'start: "bottom 90%"  end: "bottom 30%"' },
    };

    useGSAP(() => {
        ScrollTrigger.getAll().forEach((st) => {
            if (st.vars.id === "se-demo") st.kill();
        });
        gsap.set(".st-se-box", { clearProps: "all" });

        const c = configs[config];
        gsap.to(".st-se-box", {
            x: 160,
            backgroundColor: "#6ee7b7",
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
                id: "se-demo",
                trigger: ".st-se-box",
                scroller: scrollerRef.current,
                start: c.start,
                end: c.end,
                toggleActions: "play none none reverse",
                markers: { startColor: "#6ee7b7", endColor: "#f472b6", fontSize: "10px" },
            },
        });
        ScrollTrigger.refresh();
    }, { scope: scrollerRef, dependencies: [config] });

    return (
        <DemoCard
            label="2. start / end — trigger position syntax"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">start</code> and{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">end</code> use a
                    2-word string: <strong className="text-zinc-200">"triggerPoint scrollerPoint"</strong>.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1.5 text-[11px] font-mono">
                        <span><code className="text-secondary">triggerPoint</code>: top | center | bottom | X% | Xpx</span>
                        <span><code className="text-secondary">scrollerPoint</code>: top | center | bottom | X% | Xpx</span>
                        <span><code className="text-secondary">"top 80%"</code> — top of trigger at 80% from top of scroller</span>
                        <span><code className="text-secondary">"bottom top"</code> — bottom of trigger at top of scroller</span>
                        <span><code className="text-secondary">"center center"</code> — centers align</span>
                        <span><code className="text-secondary">"+=200"</code> — 200px past the default start point</span>
                    </span>
                    <br />
                    Enable <code className="text-secondary bg-zinc-800 px-1 rounded">markers: true</code> during
                    development to visualize exactly where start and end lines are.
                </>
            }
            pros={[
                "Human-readable positions — 'top 80%' is clearer than calculating pixel offsets",
                "Percentage values adapt to any screen size automatically",
                "markers: true is the fastest way to debug unexpected trigger timing",
            ]}
            cons={[
                "Two-word string syntax is easy to misremember — 'trigger scroller' order matters",
                "px values are fixed — they don't adapt to layout changes",
            ]}
            code={`// Format: "triggerEdge scrollerEdge"
scrollTrigger: {
  trigger: ".box",

  start: "top 80%",     // top of .box at 80% down the scroller
  end:   "top 20%",     // top of .box at 20% down the scroller

  // Other examples:
  // start: "center center"   — centers align
  // start: "bottom top"      — element bottom at top of viewport
  // start: "top+=100 80%"    — 100px past top of element

  markers: true,          // development only — remove in production
}`}
        >
            <div className="flex flex-col gap-3">
                <div className="flex gap-1.5 flex-wrap">
                    {(Object.keys(configs) as (keyof typeof configs)[]).map((k) => (
                        <button key={k} onClick={() => setConfig(k)}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${config === k ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}>
                            {configs[k].label}
                        </button>
                    ))}
                </div>
                <p className="text-zinc-500 text-[11px] font-mono">Scroll inside the box to see the trigger markers ↓</p>
                <div
                    ref={scrollerRef}
                    className="h-64 overflow-y-scroll bg-zinc-900 rounded-xl"
                    style={{ scrollbarWidth: "thin" }}
                >
                    <div className="h-40 flex items-center justify-center text-zinc-600 text-sm font-mono">↓ scroll</div>
                    <div className="st-se-box mx-6 mb-4 p-4 rounded-xl bg-zinc-800 border border-zinc-700 w-32 h-12" />
                    <div className="h-32" />
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 3. SCRUB — link animation to scroll position
// ─────────────────────────────────────────────
const ScrubDemo = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [scrub, setScrub] = useState<boolean | number>(true);

    useGSAP(() => {
        ScrollTrigger.getAll().forEach((st) => {
            if (st.vars.id === "scrub-demo") st.kill();
        });
        gsap.set(".st-scrub-box", { clearProps: "all" });

        gsap.to(".st-scrub-box", {
            x: 200,
            rotation: 360,
            backgroundColor: "#f472b6",
            duration: 1,
            ease: "none",
            scrollTrigger: {
                id: "scrub-demo",
                trigger: ".st-scrub-box",
                scroller: scrollerRef.current,
                start: "top 80%",
                end: "top 10%",
                scrub,
            },
        });
        ScrollTrigger.refresh();
    }, { scope: scrollerRef, dependencies: [scrub] });

    return (
        <DemoCard
            label="3. scrub — animation tied directly to scroll position"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">scrub: true</code> links
                    the tween's <strong className="text-zinc-200">progress directly to the scroll position</strong> —
                    the animation plays forward as you scroll down and backward as you scroll up.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1.5 text-[11px] font-mono">
                        <span><code className="text-secondary">scrub: true</code> — instant, 1:1 with scroll</span>
                        <span><code className="text-secondary">scrub: 1</code> — 1 second lag/smoothing (animation catches up 1s behind scroll)</span>
                        <span><code className="text-secondary">scrub: 0.5</code> — 0.5s lag — snappier feel</span>
                        <span><code className="text-secondary">scrub: 3</code> — 3s lag — very smooth, floaty</span>
                    </span>
                    <br />
                    With scrub, <strong className="text-zinc-200">ease is ignored</strong> —
                    use <code className="text-secondary bg-zinc-800 px-1 rounded">ease: "none"</code> for
                    a linear scrub, or a custom ease to accelerate/decelerate through the scroll range.
                </>
            }
            pros={[
                "Creates scroll-driven animations with zero manual scroll math",
                "scrub: N adds smoothing — the animation lags behind scroll for a premium feel",
                "Combine with a timeline to scrub a multi-step sequence",
            ]}
            cons={[
                "ease is effectively ignored with scrub: true — the scroll IS the ease",
                "Large scrub values (3+) mean the animation finishes long after scrolling stops",
                "Scrubbed animations must complete within start→end — plan end carefully",
            ]}
            code={`gsap.to(".box", {
  x: 300,
  rotation: 360,
  ease: "none",        // ease is overridden by scrub — use "none"
  scrollTrigger: {
    trigger: ".box",
    start: "top 80%",
    end: "top 10%",
    scrub: true,       // 1:1 with scroll
    // scrub: 1,       // 1s smoothing lag
    // scrub: 0.5,     // snappier
  },
});`}
        >
            <div className="flex flex-col gap-3">
                <div className="flex gap-1.5 flex-wrap">
                    {([true, 0.5, 1, 3] as const).map((v) => (
                        <button key={String(v)} onClick={() => setScrub(v)}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${scrub === v ? "bg-secondary text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white"}`}>
                            scrub: {String(v)}
                        </button>
                    ))}
                </div>
                <p className="text-zinc-500 text-[11px] font-mono">Scroll inside the box ↓</p>
                <div
                    ref={scrollerRef}
                    className="h-72 overflow-y-scroll bg-zinc-900 rounded-xl"
                    style={{ scrollbarWidth: "thin" }}
                >
                    <div className="h-32 flex items-center justify-center text-zinc-600 text-sm font-mono">↓ scroll slowly</div>
                    <div className="st-scrub-box mx-6 w-10 h-10 rounded-lg bg-secondary" />
                    <div className="h-48" />
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. PIN — freeze an element while scrolling past
// ─────────────────────────────────────────────
const PinDemo = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: ".st-pin-box",
            scroller: scrollerRef.current,
            start: "top top",
            end: "+=200",
            pin: true,
            pinSpacing: true,
            markers: { startColor: "#6ee7b7", endColor: "#f472b6", fontSize: "10px" },
        });
        ScrollTrigger.refresh();
    }, { scope: scrollerRef });

    return (
        <DemoCard
            label="4. pin — freeze an element in place while scrolling past it"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">pin: true</code> makes
                    the trigger element <strong className="text-zinc-200">stick in its current position</strong> while
                    the rest of the page scrolls, then releases it once{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">end</code> is reached.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1.5 text-[11px] font-mono">
                        <span><code className="text-secondary">pin: true</code> — pins the trigger element itself</span>
                        <span><code className="text-secondary">pin: ".other"</code> — pins a different element</span>
                        <span><code className="text-secondary">pinSpacing: true</code> — (default) adds space to push content below the pin</span>
                        <span><code className="text-secondary">pinSpacing: false</code> — no spacing, content overlaps the pinned element</span>
                        <span><code className="text-secondary">end: "+=300"</code> — pin for 300px of scroll travel</span>
                    </span>
                    <br />
                    Pin is the foundation of <strong className="text-zinc-200">scroll-based storytelling</strong> —
                    the element stays fixed while content or animations progress around it.
                </>
            }
            pros={[
                "pin: true needs zero CSS — ScrollTrigger handles position switching automatically",
                "Combine with scrub + timeline for scroll-through reveals and step animations",
                'end: "+=300" lets you define pin duration in scroll pixels, not time',
            ]}
            cons={[
                "Pinning inside an overflow container requires extra scrollerProxy configuration",
                "pinSpacing adds height — account for it in layout or set false if overlapping is intentional",
                "Nested pins are tricky — avoid pinning inside a pinned element",
            ]}
            code={`ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",  // pin starts when .hero top hits the top
  end: "+=400",      // stay pinned for 400px of scroll
  pin: true,
  pinSpacing: true,
});

// Or inline in a tween:
gsap.to(".hero-content", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=400",
    pin: true,
    scrub: true,
  },
});`}
        >
            <div>
                <p className="text-zinc-500 text-[11px] font-mono mb-2">Scroll inside the box — the card pins while you scroll ↓</p>
                <div
                    ref={scrollerRef}
                    className="h-80 overflow-y-scroll bg-zinc-900 rounded-xl"
                    style={{ scrollbarWidth: "thin" }}
                >
                    <div className="h-16 flex items-center justify-center text-zinc-600 text-sm font-mono">↓ scroll down</div>

                    <div className="st-pin-box mx-6 p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                        <p className="text-secondary font-mono text-sm font-bold">Pinned Card</p>
                        <p className="text-zinc-400 text-xs mt-1">This card stays fixed for 200px of scroll.</p>
                    </div>

                    <div className="h-16 flex items-center justify-center text-zinc-600 text-sm font-mono">content below pin</div>
                    <div className="mx-6 p-4 rounded-xl bg-zinc-800 text-zinc-500 text-sm">
                        This content scrolls normally past the pinned card.
                    </div>
                    <div className="h-24" />
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 5. TIMELINE + SCROLLTRIGGER — scrubbed sequence
// ─────────────────────────────────────────────
const TimelineSTDemo = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.set([".tst-title", ".tst-sub", ".tst-btn"], { clearProps: "all" });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".tst-content",
                scroller: scrollerRef.current,
                start: "top 70%",
                end: "bottom 20%",
                scrub: 1,
            },
        });

        tl.from(".tst-title", { y: 40, opacity: 0, duration: 1 })
          .from(".tst-sub",   { y: 30, opacity: 0, duration: 1 }, "<+=0.3")
          .from(".tst-btn",   { y: 20, opacity: 0, scale: 0.8, duration: 0.8 }, "<+=0.3");

        ScrollTrigger.refresh();
    }, { scope: scrollerRef });

    return (
        <DemoCard
            label="5. timeline + scrolltrigger — scrub a multi-step sequence"
            theory={
                <>
                    The most powerful pattern: attach a <code className="text-secondary bg-zinc-800 px-1 rounded">scrollTrigger</code> to
                    a <strong className="text-zinc-200">timeline</strong> instead of a single tween.
                    The entire sequence scrubs with scroll — each tween plays at its relative position in the timeline.
                    <br /><br />
                    Pass <code className="text-secondary bg-zinc-800 px-1 rounded">scrollTrigger</code> directly
                    into <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.timeline({"{ scrollTrigger: {...} }"})</code>.
                    Every tween added to the timeline inherits the same scroll driver.
                    <br /><br />
                    This is the foundation of <strong className="text-zinc-200">scroll-driven storytelling</strong>:
                    one scroll window, many coordinated animations.
                </>
            }
            pros={[
                "One scrollTrigger config drives an entire multi-step animated sequence",
                "Tweens stay in sync — scrubbing back reverses all of them in order",
                "Position parameter still works — stagger and overlap within the scroll window",
            ]}
            cons={[
                "All tweens must fit within the start→end scroll window — plan total duration",
                "scrub: true makes ease irrelevant — the scroll speed IS the ease",
                "Very long timelines compressed into a short scroll range feel rushed",
            ]}
            code={`const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top 70%",
    end: "bottom 20%",
    scrub: 1,           // 1s smoothing
  },
});

// Each tween plays at its position in the scroll window
tl.from(".title",    { y: 40, opacity: 0, duration: 1 })
  .from(".subtitle", { y: 30, opacity: 0, duration: 1 }, "<+=0.3")
  .from(".button",   { scale: 0.8, opacity: 0, duration: 0.8 }, "<+=0.3");`}
        >
            <div>
                <p className="text-zinc-500 text-[11px] font-mono mb-2">Scroll slowly through the box ↓</p>
                <div
                    ref={scrollerRef}
                    className="h-80 overflow-y-scroll bg-zinc-900 rounded-xl"
                    style={{ scrollbarWidth: "thin" }}
                >
                    <div className="h-32 flex items-center justify-center text-zinc-600 text-sm font-mono">↓ scroll down</div>

                    <div className="tst-content mx-6 mb-6 p-6 rounded-2xl bg-zinc-800 flex flex-col gap-3">
                        <h3 className="tst-title text-xl font-bold text-white">Scroll-Driven Reveal</h3>
                        <p className="tst-sub text-zinc-400 text-sm">Each element animates at its own position in the timeline as you scroll through.</p>
                        <div className="tst-btn self-start px-4 py-2 rounded-lg bg-secondary text-black text-sm font-semibold">
                            Get Started
                        </div>
                    </div>

                    <div className="h-40" />
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 6. CALLBACKS — onEnter / onLeave / etc.
// ─────────────────────────────────────────────
const CallbacksSTDemo = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [log, setLog] = useState<string[]>(["— scroll to trigger callbacks —"]);

    const push = (msg: string) =>
        setLog((prev) => [`${new Date().toLocaleTimeString("en", { hour12: false })}  ${msg}`, ...prev].slice(0, 6));

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: ".st-cb-box",
            scroller: scrollerRef.current,
            start: "top 75%",
            end: "bottom 25%",
            onEnter:      () => push("onEnter — scrolled past start (forward)"),
            onLeave:      () => push("onLeave — scrolled past end (forward)"),
            onEnterBack:  () => push("onEnterBack — scrolled back into range"),
            onLeaveBack:  () => push("onLeaveBack — scrolled back before start"),
            markers: { startColor: "#6ee7b7", endColor: "#f472b6", fontSize: "10px" },
        });
        ScrollTrigger.refresh();
    }, { scope: scrollerRef });

    return (
        <DemoCard
            label="6. callbacks — fire code at scroll events"
            theory={
                <>
                    ScrollTrigger fires callbacks when the scroll position crosses the{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">start</code> or{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">end</code> boundary
                    in either direction.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1.5 text-[11px] font-mono">
                        <span><code className="text-secondary">onEnter</code> — crosses start going downward</span>
                        <span><code className="text-secondary">onLeave</code> — crosses end going downward</span>
                        <span><code className="text-secondary">onEnterBack</code> — crosses end going upward (re-enters from below)</span>
                        <span><code className="text-secondary">onLeaveBack</code> — crosses start going upward (exits from above)</span>
                        <span><code className="text-secondary">onUpdate(self)</code> — fires every scroll tick while active, self.progress = 0–1</span>
                        <span><code className="text-secondary">onToggle(self)</code> — fires when active state changes, self.isActive = bool</span>
                        <span><code className="text-secondary">onRefresh</code> — fires when ScrollTrigger recalculates positions</span>
                    </span>
                </>
            }
            pros={[
                "4 directional callbacks cover every enter/leave scenario without any scroll math",
                "onUpdate(self) gives self.progress (0–1) — drive any custom logic from scroll",
                "onToggle is the cleanest way to add/remove a CSS class on scroll",
            ]}
            cons={[
                "Callbacks fire on every matching scroll tick — keep them cheap",
                "onEnter fires again if you use toggleActions: 'restart' — guard against duplicates",
            ]}
            code={`ScrollTrigger.create({
  trigger: ".section",
  start: "top 75%",
  end: "bottom 25%",

  onEnter:     () => console.log("entered"),
  onLeave:     () => console.log("left bottom"),
  onEnterBack: () => console.log("entered from below"),
  onLeaveBack: () => console.log("left from top"),

  onUpdate: (self) => {
    console.log("progress:", self.progress.toFixed(2));
  },

  onToggle: (self) => {
    console.log("active:", self.isActive);
  },
});`}
        >
            <div className="flex flex-col gap-3">
                <p className="text-zinc-500 text-[11px] font-mono">Scroll down and back up to fire all 4 callbacks ↓</p>
                <div
                    ref={scrollerRef}
                    className="h-64 overflow-y-scroll bg-zinc-900 rounded-xl"
                    style={{ scrollbarWidth: "thin" }}
                >
                    <div className="h-32 flex items-center justify-center text-zinc-600 text-sm font-mono">↓ scroll</div>
                    <div className="st-cb-box mx-6 p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm">
                        Trigger zone — scroll me into view and back out
                    </div>
                    <div className="h-48" />
                </div>

                {/* Log */}
                <div className="bg-zinc-950 rounded-xl p-3 font-mono text-[11px] flex flex-col gap-1 max-h-32 overflow-y-auto">
                    {log.map((l, i) => (
                        <span key={i} className={i === 0 ? "text-secondary" : "text-zinc-500"}>{l}</span>
                    ))}
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────
const LearningScrollTrigger = () => (
    <Container>
        <div className="flex flex-col gap-3 mb-8">
            <h2 className="text-2xl font-bold text-white font-mono">ScrollTrigger</h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                <strong className="text-zinc-200">ScrollTrigger</strong> links GSAP animations to the scroll position.
                Control <strong className="text-zinc-200">when</strong> animations fire with <code className="text-secondary bg-zinc-800 px-0.5 rounded text-xs">start</code> / <code className="text-secondary bg-zinc-800 px-0.5 rounded text-xs">end</code>,
                tie them directly to scroll with <code className="text-secondary bg-zinc-800 px-0.5 rounded text-xs">scrub</code>,
                freeze elements in place with <code className="text-secondary bg-zinc-800 px-0.5 rounded text-xs">pin</code>,
                and react to scroll direction with <code className="text-secondary bg-zinc-800 px-0.5 rounded text-xs">onEnter</code> / <code className="text-secondary bg-zinc-800 px-0.5 rounded text-xs">onLeave</code> callbacks.
                Combine with a Timeline for full scroll-driven storytelling.
            </p>
        </div>
        <div className="flex flex-col gap-5">
            <BasicSTDemo />
            <StartEndDemo />
            <ScrubDemo />
            <PinDemo />
            <TimelineSTDemo />
            <CallbacksSTDemo />
        </div>
    </Container>
);

export default LearningScrollTrigger;
