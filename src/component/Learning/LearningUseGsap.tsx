"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(useGSAP);



// ─────────────────────────────────────────────
// 1. SCOPE
// ─────────────────────────────────────────────
const ScopeDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from(".scope-box", {
                x: -80,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out",
            });
        },
        { scope: containerRef }
    );

    return (
        <DemoCard
            label="1. scope"
            theory={
                <>
                    In React, many components can render elements with the same class name
                    (e.g. <code className="text-secondary bg-zinc-800 px-1 rounded">.box</code>).
                    Without <code className="text-secondary bg-zinc-800 px-1 rounded">scope</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to(&quot;.box&quot;)</code> will
                    match <strong className="text-zinc-200">every</strong> matching element on the entire
                    page — including boxes inside completely unrelated components.
                    <br /><br />
                    Passing <code className="text-secondary bg-zinc-800 px-1 rounded">scope: ref</code> restricts
                    all <code className="text-secondary bg-zinc-800 px-1 rounded">querySelector</code> calls
                    inside the <code className="text-secondary bg-zinc-800 px-1 rounded">useGSAP</code> callback
                    to only match descendants of that ref node — keeping the animation truly local.
                </>
            }
            pros={[
                "Animations stay component-local with zero side effects",
                "Safe to reuse class names across the entire codebase",
                "No need for unique IDs or overly specific selectors",
            ]}
            cons={[
                "Must always attach the ref to a real, mounted DOM node",
                "Forgetting the ref silently makes animations target the whole page",
            ]}
            code={`const ScopeDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".scope-box", {
        x: -80,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef } // restricts querySelector to containerRef's subtree
  );

  return (
    <div ref={containerRef} className="flex gap-3">
      {["A", "B", "C"].map((l) => (
        <div
          key={l}
          className="scope-box w-12 h-12 rounded-lg bg-secondary
                     flex items-center justify-center font-bold text-black"
        >
          {l}
        </div>
      ))}
    </div>
  );
};`}
        >
            <div ref={containerRef} className="flex gap-3">
                {["A", "B", "C"].map((l) => (
                    <div
                        key={l}
                        className="scope-box w-12 h-12 rounded-lg bg-secondary flex items-center justify-center font-bold text-black"
                    >
                        {l}
                    </div>
                ))}
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 2. DEPENDENCIES
// ─────────────────────────────────────────────
const DependenciesDemo = () => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [color, setColor] = useState("#6ee7b7");
    const [size, setSize] = useState(48);

    useGSAP(
        () => {
            gsap.to(boxRef.current, {
                backgroundColor: color,
                width: size,
                height: size,
                duration: 0.6,
                ease: "expo.out",
            });
        },
        { dependencies: [color, size] }
    );

    return (
        <DemoCard
            label="2. dependencies"
            theory={
                <>
                    Animations often need to respond to state — a colour picker, a slider, a
                    toggle. Without <code className="text-secondary bg-zinc-800 px-1 rounded">dependencies</code>,
                    you&apos;d have to manually call{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code> inside
                    every event handler, scattering animation logic across the component.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">dependencies: [val]</code> re-runs
                    the <code className="text-secondary bg-zinc-800 px-1 rounded">useGSAP</code> callback —
                    after reverting the previous animation first — whenever any listed value changes.
                    Identical mental model to{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">useEffect</code>&apos;s dependency array.
                </>
            }
            pros={[
                "Single source of truth — animation logic lives in one place",
                "Auto-reverts the previous tween before re-running",
                "Works with any reactive value: useState, props, Zustand, context…",
            ]}
            cons={[
                "Every dep change re-creates the animation from scratch",
                "Not ideal for high-frequency updates like raw mouse position — use gsap.quickTo() instead",
            ]}
            code={`const DependenciesDemo = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#6ee7b7");
  const [size, setSize] = useState(48);

  useGSAP(
    () => {
      gsap.to(boxRef.current, {
        backgroundColor: color,
        width: size,
        height: size,
        duration: 0.6,
        ease: "expo.out",
      });
    },
    { dependencies: [color, size] } // re-runs whenever color or size changes
  );

  return (
    <div className="flex flex-col gap-3 items-start">
      <div
        ref={boxRef}
        className="rounded-xl"
        style={{ width: 48, height: 48, backgroundColor: color }}
      />
      <div className="flex gap-2 flex-wrap">
        {["#6ee7b7", "#f472b6", "#60a5fa", "#facc15"].map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="w-7 h-7 rounded-full border-2 border-white/20"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setSize((s) => Math.max(32, s - 16))}>
          − Size
        </button>
        <button onClick={() => setSize((s) => Math.min(120, s + 16))}>
          + Size
        </button>
      </div>
    </div>
  );
};`}
        >
            <div className="flex flex-col gap-3 items-start">
                <div
                    ref={boxRef}
                    className="rounded-xl"
                    style={{ width: 48, height: 48, backgroundColor: color }}
                />
                <div className="flex gap-2 flex-wrap">
                    {["#6ee7b7", "#f472b6", "#60a5fa", "#facc15"].map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className="w-7 h-7 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSize((s) => Math.max(32, s - 16))}
                        className="px-3 py-1 rounded bg-zinc-700 text-sm text-white"
                    >
                        − Size
                    </button>
                    <button
                        onClick={() => setSize((s) => Math.min(120, s + 16))}
                        className="px-3 py-1 rounded bg-zinc-700 text-sm text-white"
                    >
                        + Size
                    </button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 3. revertOnUpdate
// ─────────────────────────────────────────────
const RevertOnUpdateDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);

    useGSAP(
        () => {
            gsap.to(".revert-box", {
                x: offset,
                duration: 0.5,
                ease: "back.out(1.4)",
            });
        },
        {
            scope: containerRef,
            dependencies: [offset],
            revertOnUpdate: true,
        }
    );

    return (
        <DemoCard
            label="3. revertOnUpdate"
            theory={
                <>
                    When dependencies change, <code className="text-secondary bg-zinc-800 px-1 rounded">useGSAP</code> re-runs
                    the callback. But GSAP tweens start <strong className="text-zinc-200">from wherever the element currently is</strong>,
                    not from its original CSS state — so values compound incorrectly.
                    <br /><br />
                    <span className="text-red-400 font-mono text-[11px]">Without revertOnUpdate:</span>
                    <br />
                    Click x:80 → sits at x:80. Click x:80 again → GSAP sees current x:80, animates to x:160 ✗
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">revertOnUpdate: true</code> instantly
                    snaps the element back to its original CSS state <strong className="text-zinc-200">before</strong> each
                    re-run, so every animation starts from a clean, predictable baseline.
                </>
            }
            pros={[
                "Animations are idempotent — same input always produces the same result",
                "Essential when animating to absolute values (x, y, scale, opacity…)",
            ]}
            cons={[
                "The snap-back is instant — can look jarring if deps change very rapidly",
                "Unnecessary overhead for relative animations like rotation: '+=90'",
            ]}
            code={`const RevertOnUpdateDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useGSAP(
    () => {
      gsap.to(".revert-box", {
        x: offset,
        duration: 0.5,
        ease: "back.out(1.4)",
      });
    },
    {
      scope: containerRef,
      dependencies: [offset],
      revertOnUpdate: true, // snaps to CSS baseline before re-running
    }
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-3">
      <div className="revert-box w-14 h-14 rounded-xl bg-violet-500
                      flex items-center justify-center text-white font-bold">
        Box
      </div>
      <div className="flex gap-2 flex-wrap">
        {[-80, 0, 80, 160].map((v) => (
          <button
            key={v}
            onClick={() => setOffset(v)}
            className={\`px-3 py-1 rounded text-sm text-white
              \${offset === v ? "bg-violet-600" : "bg-zinc-700"}\`}
          >
            x: {v}
          </button>
        ))}
      </div>
    </div>
  );
};`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="revert-box w-14 h-14 rounded-xl bg-violet-500 flex items-center justify-center text-white font-bold">
                    Box
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[-80, 0, 80, 160].map((v) => (
                        <button
                            key={v}
                            onClick={() => setOffset(v)}
                            className={`px-3 py-1 rounded text-sm text-white transition-colors ${offset === v ? "bg-violet-600" : "bg-zinc-700"
                                }`}
                        >
                            x: {v}
                        </button>
                    ))}
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. CONTEXT
// ─────────────────────────────────────────────
const ContextDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { context } = useGSAP({ scope: containerRef });

    const runEntrance = () => {
        context.add(() => {
            gsap.from(".ctx-box", {
                y: 40,
                opacity: 0,
                stagger: 0.12,
                duration: 0.7,
                ease: "power3.out",
            });
        });
    };

    const runSpin = () => {
        context.add(() => {
            gsap.to(".ctx-box", {
                rotation: "+=360",
                duration: 0.8,
                stagger: 0.1,
                ease: "expo.inOut",
            });
        });
    };

    return (
        <DemoCard
            label="4. context"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">useGSAP</code>&apos;s callback
                    runs once on mount. But sometimes you need to fire animations imperatively — from
                    a button click, a timer, or a parent callback — long after mount.
                    <br /><br />
                    A plain <code className="text-secondary bg-zinc-800 px-1 rounded">gsap.to()</code> inside
                    an event handler is <strong className="text-zinc-200">invisible</strong> to GSAP&apos;s cleanup
                    system — it won&apos;t be reverted on unmount, causing animations to run on unmounted DOM nodes.
                    <br /><br />
                    <code className="text-secondary bg-zinc-800 px-1 rounded">context.add(fn)</code> registers
                    animations created inside <code className="text-secondary bg-zinc-800 px-1 rounded">fn</code> into
                    the same managed GSAP context, so they are automatically reverted on unmount.
                    <br /><br />
                    <span className="text-zinc-500 text-[11px]">
                        context.add() vs contextSafe() — context.add() is better for conditional / matchMedia logic.
                        contextSafe() is cleaner for plain event handlers.
                    </span>
                </>
            }
            pros={[
                "Imperative animations get the same cleanup guarantee as mount animations",
                "Supports named conditions for matchMedia-aware responsive animations",
                "Keeps all animation management inside one controlled GSAP context",
            ]}
            cons={[
                "More verbose than contextSafe() for simple click handlers",
                "context object is null until after the first render/mount",
            ]}
            code={`const ContextDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { context } = useGSAP({ scope: containerRef });

  // context.add() registers animations into the managed GSAP context
  // so they are auto-reverted on unmount
  const runEntrance = () => {
    context.add(() => {
      gsap.from(".ctx-box", {
        y: 40, opacity: 0,
        stagger: 0.12, duration: 0.7,
        ease: "power3.out",
      });
    });
  };

  const runSpin = () => {
    context.add(() => {
      gsap.to(".ctx-box", {
        rotation: "+=360",
        duration: 0.8, stagger: 0.1,
        ease: "expo.inOut",
      });
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-3">
      <div className="flex gap-3">
        {["▲", "■", "●"].map((s, i) => (
          <div
            key={i}
            className="ctx-box w-12 h-12 rounded-lg bg-orange-400
                       flex items-center justify-center text-black font-bold"
          >
            {s}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={runEntrance}>Entrance</button>
        <button onClick={runSpin}>Spin</button>
      </div>
    </div>
  );
};`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="flex gap-3">
                    {["▲", "■", "●"].map((s, i) => (
                        <div
                            key={i}
                            className="ctx-box w-12 h-12 rounded-lg bg-orange-400 flex items-center justify-center text-black font-bold"
                        >
                            {s}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={runEntrance}
                        className="px-3 py-1 rounded bg-zinc-700 text-sm text-white"
                    >
                        Entrance
                    </button>
                    <button
                        onClick={runSpin}
                        className="px-3 py-1 rounded bg-zinc-700 text-sm text-white"
                    >
                        Spin
                    </button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 5. contextSafe
// ─────────────────────────────────────────────
const ContextSafeDemo = () => {
    const container = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: container });

    const onClickGood = contextSafe(() => {
        gsap.timeline()
            .to(".good", { scale: 1.3, duration: 0.2, ease: "power2.out" })
            .to(".good", { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });

    const onHover = contextSafe(() => {
        gsap.to(".good", { rotation: 15, backgroundColor: "#f472b6", duration: 0.3 });
    });

    const onHoverOut = contextSafe(() => {
        gsap.to(".good", { rotation: 0, backgroundColor: "#34d399", duration: 0.3 });
    });

    return (
        <DemoCard
            label="5. contextSafe"
            theory={
                <>
                    Same root problem as <code className="text-secondary bg-zinc-800 px-1 rounded">context.add()</code> —
                    animations triggered from event handlers are untracked by GSAP.{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">contextSafe()</code> is the
                    cleaner solution built specifically for this pattern.
                    <br /><br />
                    Instead of wrapping the <strong className="text-zinc-200">call site</strong> with{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">context.add()</code>, you wrap
                    the handler <strong className="text-zinc-200">definition</strong> with{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">contextSafe()</code>.
                    The returned function is now fully tracked <em>and</em> scoped — exactly as shown in the video:
                    <br /><br />
                    <code className="block bg-zinc-800 text-secondary px-3 py-2 rounded-lg text-[11px] leading-5 whitespace-pre">{`const { contextSafe } = useGSAP({ scope: container });
const onClickGood = contextSafe(() => {
  gsap.to(".good", { rotation: 180 }); // scoped + tracked ✓
});`}</code>
                </>
            }
            pros={[
                "Cleanest, most ergonomic API for event-handler animations",
                "Inherits scope automatically — class selectors are component-local",
                "Works identically with onClick, addEventListener, and setTimeout",
                "Zero chance of running animations on an unmounted node",
            ]}
            cons={[
                "Must be called after useGSAP() — cannot be used at module level",
                "Less flexible than context.add() for matchMedia / conditional logic",
            ]}
            code={`const ContextSafeDemo = () => {
  const container = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: container });

  // contextSafe() wraps the handler — scoped + tracked automatically
  const onClickGood = contextSafe(() => {
    gsap.timeline()
      .to(".good", { scale: 1.3, duration: 0.2, ease: "power2.out" })
      .to(".good", { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  });

  const onHover = contextSafe(() => {
    gsap.to(".good", { rotation: 15, backgroundColor: "#f472b6", duration: 0.3 });
  });

  const onHoverOut = contextSafe(() => {
    gsap.to(".good", { rotation: 0, backgroundColor: "#34d399", duration: 0.3 });
  });

  return (
    <div ref={container}>
      <div
        className="good w-20 h-20 rounded-2xl bg-emerald-400
                   flex items-center justify-center text-black font-bold
                   cursor-pointer select-none"
        style={{ willChange: "transform" }}
        onClick={onClickGood}
        onMouseEnter={onHover}
        onMouseLeave={onHoverOut}
      >
        Click me
      </div>
      <p className="text-xs text-zinc-500 mt-2">
        Hover + click — all three handlers use contextSafe()
      </p>
    </div>
  );
};`}
        >
            <div ref={container}>
                <div
                    className="good w-20 h-20 rounded-2xl bg-emerald-400 flex items-center justify-center text-black font-bold cursor-pointer select-none"
                    style={{ willChange: "transform" }}
                    onClick={onClickGood}
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverOut}
                >
                    Click me
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                    Hover + click — all three handlers use contextSafe()
                </p>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// Root page
// ─────────────────────────────────────────────
const LearningUseGsap = () => {
    return (
        <div className="flex flex-col justify-center items-center ">
            <Container>
                <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-6">

                    {/* Page header */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl text-secondary font-bold font-mono">{"useGSAP()"}</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                            A purpose-built React hook that auto-reverts animations on unmount,
                            scopes selectors to a component subtree, and tracks imperative animations
                            from event handlers — solving every major pain point of using{" "}
                            <code className="text-zinc-400 bg-zinc-800 px-1 rounded">gsap</code> inside{" "}
                            <code className="text-zinc-400 bg-zinc-800 px-1 rounded">useEffect</code>.
                        </p>

                        {/* Why useGSAP callout */}
                        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4 mt-1 text-[12px] text-zinc-400 leading-relaxed max-w-2xl">
                            <p className="text-zinc-200 font-semibold mb-2 text-sm">Why not just useEffect?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-red-400 font-mono text-[10px] uppercase tracking-widest mb-1">useEffect problems</p>
                                    <ul className="flex flex-col gap-1">
                                        {[
                                            "Must manually call context.revert() on cleanup",
                                            "Easy to forget → memory leaks & ghost animations",
                                            "No built-in selector scoping to a component",
                                            "Event-handler animations are completely untracked",
                                        ].map((t, i) => (
                                            <li key={i} className="flex gap-1.5 text-red-300/70"><span>✗</span><span>{t}</span></li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-1">useGSAP solves it</p>
                                    <ul className="flex flex-col gap-1">
                                        {[
                                            "Auto-reverts all animations on unmount",
                                            "scope option locks selectors to a subtree",
                                            "dependencies re-run animations reactively",
                                            "context & contextSafe track imperative animations",
                                        ].map((t, i) => (
                                            <li key={i} className="flex gap-1.5 text-emerald-300/70"><span>✓</span><span>{t}</span></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Demo grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <ScopeDemo />
                        <DependenciesDemo />
                        <RevertOnUpdateDemo />
                        <ContextDemo />
                        <ContextSafeDemo />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default LearningUseGsap;