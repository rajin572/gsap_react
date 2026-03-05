"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Container from "../ui/Container";
import DemoCard from "../shared/DemoCard";

gsap.registerPlugin(useGSAP);


// ─────────────────────────────────────────────
// 1. 2D Transform Properties
// ─────────────────────────────────────────────
const Transform2DDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, vars: gsap.TweenVars) => {
        gsap.killTweensOf(".t2d");
        gsap.set(".t2d", { clearProps: "all" });
        gsap.to(".t2d", { duration: 0.7, ease: "power2.out", ...vars });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".t2d");
        gsap.set(".t2d", { clearProps: "all" });
        setActive("—");
    });

    const btns: Array<[string, gsap.TweenVars]> = [
        ["x: 100", { x: 100 }],
        ["y: -40", { y: -40 }],
        ["x:80 y:30", { x: 80, y: 30 }],
        ["rotation: 180", { rotation: 180 }],
        ["rotation: 360", { rotation: 360, ease: "power1.inOut" }],
        ["scale: 1.8", { scale: 1.8, ease: "elastic.out(1,0.5)" }],
        ["scaleX: 2.5", { scaleX: 2.5 }],
        ["scaleY: 2.5", { scaleY: 2.5 }],
        ["skewX: 30", { skewX: 30 }],
        ["skewY: 30", { skewY: 30 }],
        ["xPercent: 50", { xPercent: 50 }],
        ["yPercent: 40", { yPercent: 40 }],
        ["origin: left", { rotation: 90, transformOrigin: "left center" }],
        ["origin: top-left", { rotation: 45, scale: 1.4, transformOrigin: "0% 0%" }],
    ];

    return (
        <DemoCard
            label="1. 2D Transform Properties"
            theory={
                <>
                    GSAP uses <strong className="text-zinc-200">shorthand transform properties</strong> that map to CSS <code className="text-secondary bg-zinc-800 px-1 rounded">transform</code>.
                    They are GPU-accelerated and never trigger layout reflow — always prefer these over <code className="text-secondary bg-zinc-800 px-1 rounded">top/left</code>.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">x</code> — translateX in px</span>
                        <span><code className="text-secondary">y</code> — translateY in px</span>
                        <span><code className="text-secondary">xPercent</code> — translateX in % of own width</span>
                        <span><code className="text-secondary">yPercent</code> — translateY in % of own height</span>
                        <span><code className="text-secondary">rotation</code> / <code className="text-secondary">rotate</code> — degrees CW</span>
                        <span><code className="text-secondary">rotationZ</code> / <code className="text-secondary">rotateZ</code> — alias</span>
                        <span><code className="text-secondary">scale</code> — uniform scale</span>
                        <span><code className="text-secondary">scaleX</code> — horizontal scale only</span>
                        <span><code className="text-secondary">scaleY</code> — vertical scale only</span>
                        <span><code className="text-secondary">skewX</code> — horizontal skew (deg)</span>
                        <span><code className="text-secondary">skewY</code> — vertical skew (deg)</span>
                        <span><code className="text-secondary">transformOrigin</code> — pivot point string</span>
                    </span>
                </>
            }
            pros={[
                "GPU-accelerated — no layout reflow, composited on their own layer",
                "x/y use px; xPercent/yPercent use % of the element's own dimensions",
                "GSAP internally composes all shorthand transforms — no conflicts between them",
                "rotation uses degrees (not radians like raw CSS)",
                "transformOrigin accepts any CSS string: '50% 50%', 'left center', '0px 0px'",
            ]}
            cons={[
                "GSAP stores transforms as inline styles — mixing with Tailwind translate classes causes conflicts",
                "Use clearProps: 'transform' or clearProps: 'all' to remove after animation",
                "xPercent shifts by % of the element's own size, NOT the parent's size",
            ]}
            code={`gsap.to(".box", { x: 100 });               // translateX 100px
gsap.to(".box", { y: -40 });               // translateY -40px
gsap.to(".box", { xPercent: -50 });        // translateX -50% own width (centering trick)
gsap.to(".box", { yPercent: -50 });        // translateY -50% own height
gsap.to(".box", { rotation: 360 });        // full spin (degrees)
gsap.to(".box", { rotate: 360 });          // alias of rotation
gsap.to(".box", { rotationZ: 360 });       // same as rotation
gsap.to(".box", { scale: 1.5 });           // uniform scale
gsap.to(".box", { scaleX: 2, scaleY: 0.5 }); // squash & stretch
gsap.to(".box", { skewX: 20 });            // horizontal skew 20°
gsap.to(".box", { skewY: 20 });            // vertical skew 20°
gsap.to(".box", {
  rotation: 90,
  transformOrigin: "left center",          // rotate around left edge
});
gsap.to(".box", {
  rotation: 180,
  transformOrigin: "100% 100%",            // rotate around bottom-right corner
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-28 flex items-center justify-center overflow-hidden">
                    <div className="t2d w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-black font-mono text-[10px] font-bold">BOX</div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, vars]) => (
                        <button key={label} onClick={() => animate(label, vars)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 2. 3D Transform Properties
// ─────────────────────────────────────────────
const Transform3DDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, vars: gsap.TweenVars) => {
        gsap.killTweensOf(".t3d");
        gsap.set(".t3d", { clearProps: "all" });
        gsap.to(".t3d", { duration: 0.9, ease: "power2.inOut", transformPerspective: 600, ...vars });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".t3d");
        gsap.set(".t3d", { clearProps: "all" });
        setActive("—");
    });

    const btns: Array<[string, gsap.TweenVars]> = [
        ["rotationX: 60", { rotationX: 60 }],
        ["rotationX: 180", { rotationX: 180 }],
        ["rotationY: 60", { rotationY: 60 }],
        ["rotationY: 180", { rotationY: 180 }],
        ["z: 120", { z: 120 }],
        ["z: -120", { z: -120 }],
        ["perspective: 200", { rotationY: 60, transformPerspective: 200 }],
        ["perspective: 1200", { rotationY: 60, transformPerspective: 1200 }],
        ["all 3D", { rotationX: 30, rotationY: 45, z: 40 }],
        ["origin: top", { rotationX: 90, transformOrigin: "50% 0%" }],
    ];

    return (
        <DemoCard
            label="2. 3D Transform Properties"
            theory={
                <>
                    GSAP exposes 3D shorthand transforms that map to CSS 3D transforms.
                    <code className="text-secondary bg-zinc-800 px-1 rounded">transformPerspective</code> applies perspective
                    directly to the animated element (as opposed to setting <code className="text-secondary bg-zinc-800 px-1 rounded">perspective</code> on a parent).
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">rotationX</code> / <code className="text-secondary">rotateX</code> — 3D flip on X axis</span>
                        <span><code className="text-secondary">rotationY</code> / <code className="text-secondary">rotateY</code> — 3D flip on Y axis</span>
                        <span><code className="text-secondary">z</code> — translateZ in px (toward/away)</span>
                        <span><code className="text-secondary">transformPerspective</code> — per-element perspective (px)</span>
                        <span><code className="text-secondary">transformOrigin</code> — pivot, accepts &quot;50% 50% 0&quot; with Z</span>
                        <span><code className="text-secondary">force3D</code> — force GPU layer (&quot;auto&quot;/true/false)</span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">Tip:</strong> For a group of 3D children sharing one vanishing point, set CSS <code className="text-secondary bg-zinc-800 px-1 rounded">perspective</code> on the parent instead.
                </>
            }
            pros={[
                "Full 3D control per element without needing a perspective parent",
                "rotationX/Y/Z can all be combined freely",
                "force3D: true locks the element onto its own GPU layer permanently",
                "transformPerspective controls how extreme the 3D distortion appears",
            ]}
            cons={[
                "transformPerspective is per-element — elements won't share a vanishing point (use CSS perspective on parent for that)",
                "Deep z values may clip at the CSS near-plane — combine with perspective carefully",
            ]}
            code={`gsap.to(".card", { rotationX: 60, transformPerspective: 600 });  // flip forward
gsap.to(".card", { rotationY: 180, transformPerspective: 600 }); // flip like a page
gsap.to(".card", { z: 150, transformPerspective: 600 });         // zoom toward viewer
gsap.to(".card", { z: -150, transformPerspective: 600 });        // push away

// Per-element perspective (bigger number = less dramatic 3D)
gsap.to(".card", { rotationY: 60, transformPerspective: 200 });  // extreme
gsap.to(".card", { rotationY: 60, transformPerspective: 1200 }); // subtle

// Combine all 3D axes
gsap.to(".card", {
  rotationX: 30,
  rotationY: 45,
  z: 40,
  transformPerspective: 600,
  transformOrigin: "50% 50% 0",
  duration: 1,
});

// For a group sharing one vanishing point — set on parent with CSS:
// .parent { perspective: 600px; }
// then animate child: gsap.to(".child", { rotationY: 45 });`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-28 flex items-center justify-center" style={{ perspective: "800px" }}>
                    <div className="t3d w-20 h-14 rounded-xl bg-linear-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-mono text-[10px] font-bold shadow-lg">3D CARD</div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, vars]) => (
                        <button key={label} onClick={() => animate(label, vars)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 3. Sizing & Layout CSS
// ─────────────────────────────────────────────
const SizingLayoutDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, vars: gsap.TweenVars) => {
        gsap.killTweensOf(".siz");
        gsap.set(".siz", { clearProps: "all" });
        gsap.to(".siz", { duration: 0.6, ease: "power2.out", ...vars });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".siz");
        gsap.set(".siz", { clearProps: "all" });
        setActive("—");
    });

    const btns: Array<[string, gsap.TweenVars]> = [
        ["width: 180", { width: 180 }],
        ["height: 90", { height: 90 }],
        ["width+height", { width: 160, height: 80 }],
        ["borderRadius: 50%", { borderRadius: "50%" }],
        ["borderRadius: 0", { borderRadius: 0 }],
        ["padding: 24", { padding: 24 }],
        ["margin: 20", { margin: 20 }],
        ["maxWidth: 100", { maxWidth: 100 }],
        ["minWidth: 200", { minWidth: 200 }],
        ["fontSize+padding", { fontSize: 24, padding: "12px 20px" }],
    ];

    return (
        <DemoCard
            label="3. Sizing & Layout CSS Properties"
            theory={
                <>
                    GSAP can animate <strong className="text-zinc-200">any numeric CSS property</strong> — including layout-affecting ones.
                    These cause layout reflow on every frame, so use sparingly. Prefer <code className="text-secondary bg-zinc-800 px-1 rounded">scale</code> over <code className="text-secondary bg-zinc-800 px-1 rounded">width/height</code> when possible.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">width</code> — px or &quot;50%&quot;</span>
                        <span><code className="text-secondary">height</code> — px or &quot;50%&quot;</span>
                        <span><code className="text-secondary">minWidth</code> / <code className="text-secondary">maxWidth</code></span>
                        <span><code className="text-secondary">minHeight</code> / <code className="text-secondary">maxHeight</code></span>
                        <span><code className="text-secondary">padding</code> — all sides or shorthand</span>
                        <span><code className="text-secondary">paddingTop/Right/Bottom/Left</code></span>
                        <span><code className="text-secondary">margin</code> — all sides or shorthand</span>
                        <span><code className="text-secondary">marginTop/Right/Bottom/Left</code></span>
                        <span><code className="text-secondary">borderRadius</code> — px or %</span>
                        <span><code className="text-secondary">borderTopLeftRadius</code> etc.</span>
                        <span><code className="text-secondary">borderWidth</code></span>
                        <span><code className="text-secondary">outlineWidth</code></span>
                        <span><code className="text-secondary">top / left / right / bottom</code></span>
                        <span><code className="text-secondary">zIndex</code></span>
                    </span>
                </>
            }
            pros={[
                "Any numeric CSS property is animatable — GSAP handles px, % and unit-less values",
                "GSAP auto-detects the unit if you pass a number (e.g. width: 200 → 200px)",
                "Useful for layout-based reveals where scale would look wrong",
            ]}
            cons={[
                "width/height/padding/margin cause layout reflow every frame — performance cost",
                "Avoid for high-frequency or large-element animations; use scale/transform instead",
                "top/left require position: absolute/relative/fixed on the element",
            ]}
            code={`gsap.to(".box", { width: 200 });           // 200px
gsap.to(".box", { width: "50%" });         // 50% of parent
gsap.to(".box", { height: 120 });
gsap.to(".box", { minWidth: 80 });
gsap.to(".box", { maxWidth: 300 });
gsap.to(".box", { padding: 24 });
gsap.to(".box", { paddingLeft: 40 });
gsap.to(".box", { margin: 16 });
gsap.to(".box", { marginTop: 32 });
gsap.to(".box", { borderRadius: "50%" });  // circle
gsap.to(".box", { borderRadius: 0 });      // square
gsap.to(".box", { borderWidth: 4 });       // requires border-style set in CSS
gsap.to(".box", { outlineWidth: 4 });

// Positioning (requires non-static position)
gsap.to(".box", { top: 40, left: 80 });
gsap.to(".box", { zIndex: 99 });           // integer — autoRound: true by default`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-28 flex items-center justify-center overflow-hidden">
                    <div className="siz w-16 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-mono text-[9px] font-bold">SIZING</div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, vars]) => (
                        <button key={label} onClick={() => animate(label, vars)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 4. Colors & Visual CSS
// ─────────────────────────────────────────────
const ColorsVisualDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, vars: gsap.TweenVars) => {
        gsap.killTweensOf([".col-box", ".col-txt"]);
        gsap.set([".col-box", ".col-txt"], { clearProps: "all" });
        gsap.to(".col-box", { duration: 0.6, ...vars });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf([".col-box", ".col-txt"]);
        gsap.set([".col-box", ".col-txt"], { clearProps: "all" });
        setActive("—");
    });

    const btns: Array<[string, gsap.TweenVars]> = [
        ["opacity: 0.2", { opacity: 0.2 }],
        ["opacity: 1", { opacity: 1 }],
        ["bg: #ef4444", { backgroundColor: "#ef4444" }],
        ["bg: hsl(280,80%,60%)", { backgroundColor: "hsl(280,80%,60%)" }],
        ["bg: rgba", { backgroundColor: "rgba(16,185,129,0.5)" }],
        ["borderColor: #f59e0b", { borderColor: "#f59e0b" }],
        ["boxShadow glow", { boxShadow: "0 0 32px 8px rgba(99,102,241,0.8)" }],
        ["boxShadow none", { boxShadow: "0 0 0px 0px rgba(0,0,0,0)" }],
        ["boxShadow drop", { boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }],
        ["textShadow", { textShadow: "0 0 20px rgba(255,150,50,1)" }],
        ["bg + opacity", { backgroundColor: "#8b5cf6", opacity: 0.6 }],
    ];

    return (
        <DemoCard
            label="4. Colors, Opacity & Shadow"
            theory={
                <>
                    GSAP interpolates <strong className="text-zinc-200">all color formats</strong> — hex, rgb, rgba, hsl, hsla, named colors.
                    Both start and end values must use the same color model, <em>or</em> GSAP will convert automatically.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">opacity</code> — 0 to 1</span>
                        <span><code className="text-secondary">visibility</code> — &quot;hidden&quot; / &quot;visible&quot;</span>
                        <span><code className="text-secondary">backgroundColor</code></span>
                        <span><code className="text-secondary">color</code> — text color</span>
                        <span><code className="text-secondary">borderColor</code></span>
                        <span><code className="text-secondary">borderTopColor</code> etc.</span>
                        <span><code className="text-secondary">outlineColor</code></span>
                        <span><code className="text-secondary">caretColor</code></span>
                        <span><code className="text-secondary">boxShadow</code></span>
                        <span><code className="text-secondary">textShadow</code></span>
                        <span><code className="text-secondary">background</code> — shorthand</span>
                        <span><code className="text-secondary">backgroundPositionX/Y</code></span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">Color formats accepted:</strong> <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;#ff0000&quot;</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;rgb(255,0,0)&quot;</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;rgba(255,0,0,0.5)&quot;</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;hsl(0,100%,50%)&quot;</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;red&quot;</code>
                </>
            }
            pros={[
                "GSAP auto-converts between color formats during interpolation",
                "boxShadow and textShadow are fully animatable including multi-shadow strings",
                "opacity animation does NOT affect child elements (unlike visibility)",
                "backgroundPositionX/Y useful for parallax background scrolling",
            ]}
            cons={[
                "Animating color triggers paint — GPU-composited layers won't help here",
                "boxShadow string must have same structure at start and end (same number of shadows)",
                "Named colors like 'red' get converted internally to rgb — minor performance note",
            ]}
            code={`// Opacity
gsap.to(".box", { opacity: 0 });
gsap.to(".box", { opacity: 1 });

// Colors — all formats work
gsap.to(".box", { backgroundColor: "#ef4444" });
gsap.to(".box", { backgroundColor: "hsl(280, 80%, 60%)" });
gsap.to(".box", { backgroundColor: "rgba(16, 185, 129, 0.5)" });
gsap.to(".box", { color: "white" });
gsap.to(".box", { borderColor: "#f59e0b" });
gsap.to(".box", { outlineColor: "rgba(99,102,241,1)" });

// Shadows
gsap.to(".box", { boxShadow: "0 0 32px 8px rgba(99,102,241,0.8)" }); // glow
gsap.to(".box", { boxShadow: "0 20px 60px rgba(0,0,0,0.7)" });       // drop
gsap.to(".text", { textShadow: "0 0 20px rgba(255,150,50,1)" });

// Background position (parallax trick)
gsap.to(".bg", { backgroundPositionY: "100%" });`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-24 flex items-center justify-center">
                    <div className="col-box w-24 h-14 rounded-xl bg-sky-500 border-2 border-transparent flex items-center justify-center">
                        <span className="col-txt text-white font-mono text-[10px] font-bold">COLOR</span>
                    </div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, vars]) => (
                        <button key={label} onClick={() => animate(label, vars)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 5. CSS Filter Property
// ─────────────────────────────────────────────
const CSSFilterDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, filter: string) => {
        gsap.killTweensOf(".flt");
        gsap.set(".flt", { clearProps: "filter" });
        gsap.to(".flt", { duration: 0.7, ease: "power2.out", filter });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".flt");
        gsap.set(".flt", { clearProps: "filter" });
        setActive("—");
    });

    const btns: Array<[string, string]> = [
        ["blur(8px)", "blur(8px)"],
        ["blur(0px)", "blur(0px)"],
        ["brightness(2)", "brightness(2)"],
        ["brightness(0.3)", "brightness(0.3)"],
        ["contrast(3)", "contrast(3)"],
        ["contrast(0.2)", "contrast(0.2)"],
        ["saturate(3)", "saturate(3)"],
        ["saturate(0)", "saturate(0)"],
        ["hue-rotate(180deg)", "hue-rotate(180deg)"],
        ["hue-rotate(270deg)", "hue-rotate(270deg)"],
        ["grayscale(1)", "grayscale(1)"],
        ["invert(1)", "invert(1)"],
        ["sepia(1)", "sepia(1)"],
        ["drop-shadow", "drop-shadow(0 10px 20px rgba(99,102,241,1))"],
        ["combined", "blur(2px) brightness(1.5) hue-rotate(90deg) saturate(2)"],
    ];

    return (
        <DemoCard
            label="5. CSS Filter Property"
            theory={
                <>
                    GSAP animates the CSS <code className="text-secondary bg-zinc-800 px-1 rounded">filter</code> property as a string.
                    As long as the start and end values use the <strong className="text-zinc-200">same filter functions in the same order</strong>,
                    GSAP will interpolate the numeric values between them.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">blur(px)</code> — gaussian blur</span>
                        <span><code className="text-secondary">brightness(n)</code> — 0=black, 1=normal, 2=double</span>
                        <span><code className="text-secondary">contrast(n)</code> — 0=grey, 1=normal, 2=high</span>
                        <span><code className="text-secondary">saturate(n)</code> — 0=grey, 1=normal, 3=vivid</span>
                        <span><code className="text-secondary">hue-rotate(deg)</code> — shift all hues</span>
                        <span><code className="text-secondary">grayscale(0-1)</code> — desaturate</span>
                        <span><code className="text-secondary">invert(0-1)</code> — invert colors</span>
                        <span><code className="text-secondary">sepia(0-1)</code> — warm sepia tone</span>
                        <span><code className="text-secondary">opacity(0-1)</code> — filter opacity</span>
                        <span><code className="text-secondary">drop-shadow(...)</code> — shadow follows shape</span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">backdropFilter</strong> uses the same function names but applies to what is behind the element.
                </>
            }
            pros={[
                "Multiple filter functions can be combined in one string",
                "Filters are GPU-accelerated (composited layer) — smoother than you'd expect",
                "drop-shadow follows alpha channel (works with PNGs/SVGs), unlike box-shadow",
                "hue-rotate is perfect for color-cycling animations",
            ]}
            cons={[
                "Start and end filter strings must have matching function names in the same order",
                "filter: none → filter: blur(8px) won't interpolate — use filter: blur(0px) as start",
                "Heavy blur values are expensive on large elements",
            ]}
            code={`// Single filter
gsap.to(".box", { filter: "blur(10px)" });
gsap.to(".box", { filter: "brightness(2)" });
gsap.to(".box", { filter: "contrast(3)" });
gsap.to(".box", { filter: "saturate(0)" });        // grayscale via saturation
gsap.to(".box", { filter: "hue-rotate(180deg)" });
gsap.to(".box", { filter: "grayscale(1)" });
gsap.to(".box", { filter: "invert(1)" });
gsap.to(".box", { filter: "sepia(1)" });
gsap.to(".box", { filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" });

// Combined filters (same order in from and to!)
gsap.fromTo(".box",
  { filter: "blur(0px) brightness(1) saturate(1)" },
  { filter: "blur(4px) brightness(1.5) saturate(2)", duration: 1 }
);

// Blur-in entrance
gsap.from(".hero", { filter: "blur(20px)", opacity: 0, duration: 1.2 });

// backdropFilter (frosted glass)
gsap.to(".glass", { backdropFilter: "blur(20px) brightness(1.1)" });`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-24 flex items-center justify-center overflow-hidden">
                    <div className="flt w-24 h-14 rounded-xl bg-linear-to-br from-pink-500 via-orange-400 to-yellow-400 flex items-center justify-center text-white font-mono text-[10px] font-bold">FILTER</div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, filter]) => (
                        <button key={label} onClick={() => animate(label, filter)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 6. clipPath Reveal
// ─────────────────────────────────────────────
const ClipPathDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, from: string, to: string) => {
        gsap.killTweensOf(".clip");
        gsap.fromTo(".clip", { clipPath: from }, { clipPath: to, duration: 0.8, ease: "power2.out" });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".clip");
        gsap.set(".clip", { clipPath: "inset(0 0 0 0)" });
        setActive("—");
    });

    const btns: Array<[string, string, string]> = [
        ["wipe-left", "inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        ["wipe-right", "inset(0 0 0 100%)", "inset(0 0 0 0%)"],
        ["wipe-up", "inset(100% 0 0 0)", "inset(0% 0 0 0)"],
        ["wipe-down", "inset(0 0 100% 0)", "inset(0 0 0% 0)"],
        ["hide-left", "inset(0 0% 0 0)", "inset(0 100% 0 0)"],
        ["circle-in", "circle(0% at 50% 50%)", "circle(100% at 50% 50%)"],
        ["circle-out", "circle(100% at 50% 50%)", "circle(0% at 50% 50%)"],
        ["circle-corner", "circle(0% at 0% 0%)", "circle(150% at 0% 0%)"],
        ["polygon-open", "polygon(50% 50%,50% 50%,50% 50%,50% 50%)", "polygon(0% 0%,100% 0%,100% 100%,0% 100%)"],
        ["ellipse-in", "ellipse(0% 0% at 50% 50%)", "ellipse(80% 60% at 50% 50%)"],
    ];

    return (
        <DemoCard
            label="6. clipPath Reveal Animations"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">clipPath</code> is one of the most powerful
                    animation properties for <strong className="text-zinc-200">reveal effects</strong>. GSAP interpolates
                    between matching clip-path shapes as long as both values use the same function with the same number of points.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">inset(top right bottom left)</code></span>
                        <span><code className="text-secondary">circle(r at cx cy)</code></span>
                        <span><code className="text-secondary">ellipse(rx ry at cx cy)</code></span>
                        <span><code className="text-secondary">polygon(x1 y1, x2 y2, ...)</code></span>
                        <span><code className="text-secondary">path(&quot;M...&quot;)</code> — SVG path string</span>
                        <span><code className="text-secondary">inset(... round r)</code> — rounded corners</span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">Rule:</strong> Start and end must use the same clip-path function. You cannot tween from <code className="text-secondary bg-zinc-800 px-1 rounded">inset()</code> to <code className="text-secondary bg-zinc-800 px-1 rounded">circle()</code>.
                </>
            }
            pros={[
                "Zero reflow — clipPath is GPU-composited, animations stay smooth",
                "inset() wipes are the cleanest reveal/hide technique",
                "polygon() enables custom shape reveals and morphs",
                "Works great with ScrollTrigger for scroll-linked reveals",
            ]}
            cons={[
                "Start and end must use the same clip-path function (inset→inset, circle→circle)",
                "polygon() morphing requires same number of points at start and end",
                "path() morphing needs identical command count — use MorphSVG plugin for complex shapes",
            ]}
            code={`// Wipe reveals
gsap.from(".el", { clipPath: "inset(0 100% 0 0)" });   // wipe from left
gsap.from(".el", { clipPath: "inset(0 0 0 100%)" });   // wipe from right
gsap.from(".el", { clipPath: "inset(100% 0 0 0)" });   // wipe from top
gsap.from(".el", { clipPath: "inset(0 0 100% 0)" });   // wipe from bottom

// Hide element
gsap.to(".el", { clipPath: "inset(0 100% 0 0)" });     // wipe out to right

// Rounded inset
gsap.from(".el", { clipPath: "inset(0 100% 0 0 round 12px)" });

// Circle reveal
gsap.from(".el", { clipPath: "circle(0% at 50% 50%)" });  // from center
gsap.from(".el", { clipPath: "circle(0% at 0% 0%)" });    // from corner

// Ellipse
gsap.from(".el", { clipPath: "ellipse(0% 0% at 50% 50%)" });

// Polygon morph (same point count required)
gsap.fromTo(".el",
  { clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" },
  { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
);`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-24 flex items-center justify-center">
                    <div className="clip w-36 h-14 rounded-xl bg-linear-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-mono text-[10px] font-bold">CLIP PATH</div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, from, to]) => (
                        <button key={label} onClick={() => animate(label, from, to)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 7. Typography CSS
// ─────────────────────────────────────────────
const TypographyDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, vars: gsap.TweenVars) => {
        gsap.killTweensOf(".typo");
        gsap.set(".typo", { clearProps: "all" });
        gsap.to(".typo", { duration: 0.6, ease: "power2.out", ...vars });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".typo");
        gsap.set(".typo", { clearProps: "all" });
        setActive("—");
    });

    const btns: Array<[string, gsap.TweenVars]> = [
        ["fontSize: 32", { fontSize: 32 }],
        ["fontSize: 10", { fontSize: 10 }],
        ["lineHeight: 2", { lineHeight: 2 }],
        ["letterSpacing: 10", { letterSpacing: 10 }],
        ["letterSpacing: -2", { letterSpacing: -2 }],
        ["wordSpacing: 20", { wordSpacing: 20 }],
        ["fontWeight: 900", { fontWeight: 900 }],
        ["fontWeight: 100", { fontWeight: 100 }],
        ["color: #f59e0b", { color: "#f59e0b" }],
        ["all combined", { fontSize: 22, letterSpacing: 6, color: "#8b5cf6", lineHeight: 1.8 }],
    ];

    return (
        <DemoCard
            label="7. Typography CSS Properties"
            theory={
                <>
                    GSAP animates all numeric typography properties directly. These trigger paint (not layout) so they are safer than
                    width/height but still not as performant as transforms.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">fontSize</code> — px, em, rem</span>
                        <span><code className="text-secondary">lineHeight</code> — unitless or px</span>
                        <span><code className="text-secondary">letterSpacing</code> — px (tracking)</span>
                        <span><code className="text-secondary">wordSpacing</code> — px</span>
                        <span><code className="text-secondary">fontWeight</code> — 100–900</span>
                        <span><code className="text-secondary">color</code> — text color</span>
                        <span><code className="text-secondary">textIndent</code> — px</span>
                        <span><code className="text-secondary">textShadow</code> — shadow string</span>
                        <span><code className="text-secondary">WebkitTextStroke</code> — stroke on text</span>
                        <span><code className="text-secondary">WebkitTextStrokeWidth</code></span>
                    </span>
                </>
            }
            pros={[
                "letterSpacing animation is great for dramatic headline reveals",
                "SplitText plugin (GSAP Club) animates chars/words/lines individually",
                "Combine with opacity/y for high-impact text entrance animations",
            ]}
            cons={[
                "fontSize animation causes reflow — avoid on frequently animated elements",
                "fontWeight interpolation depends on available font weights in the loaded typeface",
                "SplitText required for per-character animations",
            ]}
            code={`gsap.to(".text", { fontSize: 48 });
gsap.to(".text", { lineHeight: 2 });
gsap.to(".text", { letterSpacing: 12 });   // tracking out
gsap.to(".text", { wordSpacing: 20 });
gsap.to(".text", { fontWeight: 900 });     // requires variable font or loaded weights
gsap.to(".text", { color: "#f59e0b" });
gsap.to(".text", { textShadow: "0 0 20px rgba(255,100,50,1)" });
gsap.to(".text", { textIndent: 40 });

// Classic reveal: expand tracking then contract
gsap.fromTo(".heading",
  { letterSpacing: 40, opacity: 0 },
  { letterSpacing: 0, opacity: 1, duration: 1, ease: "power3.out" }
);

// SplitText (Club plugin) — per-char animation
// const split = new SplitText(".heading", { type: "chars" });
// gsap.from(split.chars, { y: 40, opacity: 0, stagger: 0.03 });`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-24 flex items-center justify-center px-4">
                    <p className="typo text-secondary font-mono font-bold text-base text-center leading-tight">GSAP Typography</p>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, vars]) => (
                        <button key={label} onClick={() => animate(label, vars)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 8. SVG Properties
// ─────────────────────────────────────────────
const SVGPropertiesDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, vars: gsap.TweenVars) => {
        gsap.killTweensOf([".svg-circle", ".svg-rect"]);
        gsap.set([".svg-circle", ".svg-rect"], { clearProps: "all" });
        gsap.to(".svg-circle", { duration: 0.7, ease: "power2.out", ...vars });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf([".svg-circle", ".svg-rect"]);
        gsap.set([".svg-circle", ".svg-rect"], { clearProps: "all" });
        setActive("—");
    });

    const btns: Array<[string, gsap.TweenVars]> = [
        ["fill: #ef4444", { fill: "#ef4444" }],
        ["fill: #8b5cf6", { fill: "#8b5cf6" }],
        ["fill: rgba", { fill: "rgba(16,185,129,0.5)" }],
        ["stroke: #f59e0b", { stroke: "#f59e0b" }],
        ["strokeWidth: 6", { strokeWidth: 6 }],
        ["strokeWidth: 0", { strokeWidth: 0 }],
        ["fillOpacity: 0.2", { fillOpacity: 0.2 }],
        ["strokeOpacity: 0.3", { strokeOpacity: 0.3, strokeWidth: 3 }],
        ["fill + stroke", { fill: "#1e293b", stroke: "#22d3ee", strokeWidth: 3 }],
        ["opacity: 0.3", { opacity: 0.3 }],
    ];

    return (
        <DemoCard
            label="8. SVG Fill, Stroke & Opacity"
            theory={
                <>
                    SVG presentation attributes are first-class animatable properties in GSAP.
                    <strong className="text-zinc-200"> All color formats apply</strong> the same as CSS colors.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">fill</code> — shape fill color</span>
                        <span><code className="text-secondary">stroke</code> — stroke color</span>
                        <span><code className="text-secondary">strokeWidth</code> — stroke thickness</span>
                        <span><code className="text-secondary">fillOpacity</code> — 0 to 1</span>
                        <span><code className="text-secondary">strokeOpacity</code> — 0 to 1</span>
                        <span><code className="text-secondary">strokeDasharray</code> — dash pattern</span>
                        <span><code className="text-secondary">strokeDashoffset</code> — path draw trick</span>
                        <span><code className="text-secondary">strokeLinecap</code> — &quot;round&quot;/&quot;butt&quot;/&quot;square&quot;</span>
                        <span><code className="text-secondary">strokeLinejoin</code> — join style</span>
                        <span><code className="text-secondary">strokeMiterlimit</code></span>
                        <span><code className="text-secondary">opacity</code> — whole element opacity</span>
                        <span><code className="text-secondary">visibility</code></span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">Note:</strong> Use <code className="text-secondary bg-zinc-800 px-1 rounded">attr:{`{}`}</code> to animate SVG geometry attributes
                    like <code className="text-secondary bg-zinc-800 px-1 rounded">cx</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">cy</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">r</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">width</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">height</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">x</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">y</code>.
                </>
            }
            pros={[
                "fill/stroke accept the same color formats as CSS (hex, rgb, hsl, named)",
                "fillOpacity and strokeOpacity animate independently of the element's opacity",
                "strokeDashoffset + strokeDasharray enables the classic 'draw path' effect",
            ]}
            cons={[
                "SVG geometry attributes (cx, cy, r) must go inside attr:{} — not at the top level",
                "fill/stroke defined as CSS (not presentation attributes) override GSAP animation",
            ]}
            code={`// Fill & stroke colors
gsap.to("circle", { fill: "#ef4444" });
gsap.to("circle", { fill: "rgba(16, 185, 129, 0.5)" });
gsap.to("path", { stroke: "#f59e0b" });
gsap.to("path", { strokeWidth: 4 });

// Separate opacity channels
gsap.to("rect", { fillOpacity: 0.3 });
gsap.to("rect", { strokeOpacity: 0.5 });
gsap.to("rect", { opacity: 0 });           // whole element

// Draw-on effect
// Set in CSS: stroke-dasharray: <pathLength>; stroke-dashoffset: <pathLength>
gsap.to("path", { strokeDashoffset: 0 });  // draws from 0% to 100%

// Stroke appearance
gsap.to("path", { strokeLinecap: "round" });
gsap.to("path", { strokeLinejoin: "round" });`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-24 flex items-center justify-center">
                    <svg width="140" height="70" viewBox="0 0 140 70">
                        <circle className="svg-circle" cx="70" cy="35" r="28" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="2" />
                    </svg>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, vars]) => (
                        <button key={label} onClick={() => animate(label, vars)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 9. SVG attr:{} & Path Draw
// ─────────────────────────────────────────────
const SVGAttrDrawDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const pathLenRef = useRef(0);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    useEffect(() => {
        if (pathRef.current) {
            const len = pathRef.current.getTotalLength();
            pathLenRef.current = len;
            gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        }
    }, []);

    const playDraw = () => {
        const len = pathLenRef.current;
        gsap.fromTo(".draw-path",
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }
        );
        setActive("strokeDashoffset draw");
    };

    const playErase = () => {
        gsap.to(".draw-path", { strokeDashoffset: pathLenRef.current, duration: 1, ease: "power2.in" });
        setActive("strokeDashoffset erase");
    };

    const playAttr = contextSafe(() => {
        gsap.killTweensOf(".attr-circle");
        gsap.set(".attr-circle", { attr: { cx: 30, cy: 35, r: 10 } });
        gsap.to(".attr-circle", {
            attr: { cx: 110, cy: 20, r: 22 },
            duration: 0.8,
            ease: "back.out(1.7)",
        });
        setActive("attr: { cx, cy, r }");
    });

    const playAttrRect = contextSafe(() => {
        gsap.killTweensOf(".attr-rect");
        gsap.set(".attr-rect", { attr: { x: 10, y: 45, width: 20, height: 20 } });
        gsap.to(".attr-rect", {
            attr: { x: 80, y: 5, width: 50, height: 55 },
            duration: 0.8,
            ease: "elastic.out(1,0.5)",
        });
        setActive("attr: { x, y, width, height }");
    });

    const reset = () => {
        const len = pathLenRef.current;
        gsap.killTweensOf([".draw-path", ".attr-circle", ".attr-rect"]);
        gsap.set(".draw-path", { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(".attr-circle", { attr: { cx: 30, cy: 35, r: 10 } });
        gsap.set(".attr-rect", { attr: { x: 10, y: 45, width: 20, height: 20 } });
        setActive("—");
    };

    return (
        <DemoCard
            label="9. SVG attr:{} & Path Drawing"
            theory={
                <>
                    <code className="text-secondary bg-zinc-800 px-1 rounded">attr:{`{}`}</code> lets GSAP animate
                    any <strong className="text-zinc-200">SVG geometry attribute</strong> directly as an XML attribute —
                    including <code className="text-secondary bg-zinc-800 px-1 rounded">cx</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">cy</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">r</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">x</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">y</code>,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">width</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">height</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">points</code>, <code className="text-secondary bg-zinc-800 px-1 rounded">viewBox</code>.
                    <br /><br />
                    The <strong className="text-zinc-200">path drawing trick</strong> uses <code className="text-secondary bg-zinc-800 px-1 rounded">strokeDasharray</code> set to
                    the path&apos;s total length, then animates <code className="text-secondary bg-zinc-800 px-1 rounded">strokeDashoffset</code> from that length to 0.
                    GSAP&apos;s <strong className="text-zinc-200">DrawSVG plugin</strong> (Club) automates this.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">attr.cx</code> / <code className="text-secondary">attr.cy</code> — circle center</span>
                        <span><code className="text-secondary">attr.r</code> — circle radius</span>
                        <span><code className="text-secondary">attr.x</code> / <code className="text-secondary">attr.y</code> — rect position</span>
                        <span><code className="text-secondary">attr.width</code> / <code className="text-secondary">attr.height</code></span>
                        <span><code className="text-secondary">attr.points</code> — polygon points</span>
                        <span><code className="text-secondary">attr.viewBox</code> — SVG viewBox</span>
                        <span><code className="text-secondary">attr.d</code> — path data (MorphSVG plugin)</span>
                        <span><code className="text-secondary">attr.offset</code> — textPath offset</span>
                    </span>
                </>
            }
            pros={[
                "attr:{} can animate any SVG attribute — geometry, filter params, mask offsets",
                "Path drawing is smooth and GPU-accelerated",
                "DrawSVG plugin (Club) handles getTotalLength() automatically",
                "attr.viewBox animation = smooth SVG pan/zoom effect",
            ]}
            cons={[
                "Geometry attributes (cx, cy, r) must go inside attr:{} — NOT at the top level",
                "strokeDashoffset technique requires knowing path length (getTotalLength())",
                "Path morphing (d attribute) requires MorphSVG plugin for complex paths",
            ]}
            code={`// ── attr:{} for geometry ───────────────────────────────
gsap.to("circle", { attr: { cx: 100, cy: 50, r: 30 } });
gsap.to("rect",   { attr: { x: 50, y: 20, width: 100, height: 60 } });
gsap.to("line",   { attr: { x2: 200, y2: 100 } });
gsap.to("polygon",{ attr: { points: "0,0 100,0 50,80" } });
gsap.to("svg",    { attr: { viewBox: "50 50 200 200" } }); // pan/zoom

// ── Path drawing (strokeDashoffset trick) ────────────────
const path = document.querySelector("path");
const len  = path.getTotalLength();
gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" });

// Erase (reverse draw)
gsap.to(path, { strokeDashoffset: len, duration: 1, ease: "power2.in" });

// ── DrawSVG plugin (Club GSAP) ───────────────────────────
// gsap.registerPlugin(DrawSVGPlugin);
// gsap.from("path", { drawSVG: 0 });           // draw from 0% to 100%
// gsap.to("path",   { drawSVG: "50% 80%" });   // reveal a segment`}
        >
            <div ref={containerRef} className="flex flex-col gap-4">
                <div className="bg-zinc-900 rounded-xl p-3 flex flex-col gap-3">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Path Draw (strokeDashoffset)</p>
                    <svg width="100%" height="50" viewBox="0 0 200 50">
                        <path
                            ref={pathRef}
                            className="draw-path"
                            d="M10,25 C40,5 80,45 120,25 C160,5 180,40 190,25"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">SVG attr:{"{}"} — circle & rect</p>
                    <svg width="100%" height="65" viewBox="0 0 140 65">
                        <circle className="attr-circle" cx="30" cy="35" r="10" fill="#38bdf8" />
                        <rect className="attr-rect" x="10" y="45" width="20" height="20" fill="#f472b6" rx="3" />
                    </svg>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    <button onClick={playDraw} className="px-2 py-1 rounded text-[11px] font-mono bg-emerald-900/50 border border-emerald-700/40 text-emerald-300 hover:bg-emerald-800/60 transition-colors">Draw path</button>
                    <button onClick={playErase} className="px-2 py-1 rounded text-[11px] font-mono bg-red-900/50 border border-red-700/40 text-red-300 hover:bg-red-800/60 transition-colors">Erase path</button>
                    <button onClick={playAttr} className="px-2 py-1 rounded text-[11px] font-mono bg-sky-900/50 border border-sky-700/40 text-sky-300 hover:bg-sky-800/60 transition-colors">Animate circle attr</button>
                    <button onClick={playAttrRect} className="px-2 py-1 rounded text-[11px] font-mono bg-pink-900/50 border border-pink-700/40 text-pink-300 hover:bg-pink-800/60 transition-colors">Animate rect attr</button>
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 10. CSS Custom Variables
// ─────────────────────────────────────────────
const CSSVariablesDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const animate = contextSafe((label: string, vars: Record<string, string | number>) => {
        gsap.killTweensOf(".cssv");
        gsap.to(".cssv", { duration: 0.8, ease: "power2.out", ...vars });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".cssv");
        gsap.set(".cssv", {
            "--hue": 210,
            "--size": 64,
            "--radius": 12,
            "--opacity": 1,
            "--blur": 0,
        });
        setActive("—");
    });

    const btns: Array<[string, Record<string, string | number>]> = [
        ["--hue: 0 (red)", { "--hue": 0 }],
        ["--hue: 120 (green)", { "--hue": 120 }],
        ["--hue: 280 (purple)", { "--hue": 280 }],
        ["--size: 120", { "--size": 120 }],
        ["--size: 32", { "--size": 32 }],
        ["--radius: 50% (circle)", { "--radius": "50%" }],
        ["--radius: 0", { "--radius": 0 }],
        ["--opacity: 0.2", { "--opacity": 0.2 }],
        ["--blur: 12px", { "--blur": "12px" }],
        ["all vars", { "--hue": 330, "--size": 96, "--radius": "50%", "--blur": "4px" }],
    ];

    return (
        <DemoCard
            label="10. CSS Custom Properties (Variables)"
            theory={
                <>
                    GSAP can animate any <strong className="text-zinc-200">CSS custom property</strong> by using its <code className="text-secondary bg-zinc-800 px-1 rounded">--name</code> as the key.
                    The variable must be set on the element (or an ancestor) before animating — GSAP reads the current value as the start.
                    <br /><br />
                    This is extremely powerful: changing <strong className="text-zinc-200">one variable</strong> can cascade to multiple
                    elements and properties that <code className="text-secondary bg-zinc-800 px-1 rounded">var(--name)</code> references.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">&quot;--hue&quot;: 180</code> — numeric variable (no unit in value)</span>
                        <span><code className="text-secondary">&quot;--size&quot;: 100</code> — numeric, referenced in CSS as <code className="text-zinc-400">calc(var(--size) * 1px)</code></span>
                        <span><code className="text-secondary">&quot;--color&quot;: &quot;#ff0000&quot;</code> — color variable</span>
                        <span><code className="text-secondary">&quot;--blur&quot;: &quot;20px&quot;</code> — string with unit</span>
                        <span><code className="text-secondary">&quot;--radius&quot;: &quot;50%&quot;</code> — percentage string</span>
                    </span>
                </>
            }
            pros={[
                "One variable drives multiple CSS declarations — great for theming animations",
                "Works with calc(), color-mix(), and any CSS function consuming the variable",
                "Cascades to child elements automatically",
                "Combine with @property (Houdini) for smoother interpolation on complex types",
            ]}
            cons={[
                "The variable must already exist on the element — GSAP cannot animate an undefined variable",
                "GSAP reads the computed value as a string — numeric-only vars (no unit) are simplest to tween",
                "Older browsers without full CSS variable support won't animate",
            ]}
            code={`// CSS (define the variables and use them)
// .box {
//   --hue: 210;
//   --size: 64;
//   --radius: 12px;
//   background: hsl(var(--hue), 80%, 60%);
//   width: calc(var(--size) * 1px);
//   height: calc(var(--size) * 1px);
//   border-radius: var(--radius);
// }

// GSAP — animate the variables
gsap.to(".box", { "--hue": 350, duration: 1 });          // color shift
gsap.to(".box", { "--size": 120, duration: 0.6 });        // size change
gsap.to(".box", { "--radius": "50%", duration: 0.4 });    // → circle

// Animate a theme variable on :root to affect the entire page
gsap.to(":root" as unknown as Element, { "--brand-color": "#ef4444", duration: 1 });

// fromTo with CSS variable
gsap.fromTo(".box",
  { "--hue": 0 },
  { "--hue": 360, duration: 3, repeat: -1, ease: "none" }  // hue spin`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-28 flex items-center justify-center overflow-hidden">
                    <div
                        className="cssv flex items-center justify-center text-white font-mono text-[10px] font-bold"
                        style={{
                            ["--hue" as string]: "210",
                            ["--size" as string]: "64",
                            ["--radius" as string]: "12px",
                            ["--opacity" as string]: "1",
                            ["--blur" as string]: "0px",
                            background: "hsl(var(--hue, 210), 80%, 55%)",
                            width: "calc(var(--size, 64) * 1px)",
                            height: "calc(var(--size, 64) * 1px)",
                            borderRadius: "var(--radius, 12px)",
                            opacity: "var(--opacity, 1)" as unknown as number,
                            filter: "blur(var(--blur, 0px))",
                        }}
                    >
                        CSS VAR
                    </div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600 text-center">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, vars]) => (
                        <button key={label} onClick={() => animate(label, vars)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 11. JS Object Animation (counter)
// ─────────────────────────────────────────────
const JSObjectDemo = () => {
    const [count, setCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const objRef = useRef({ value: 0, progress: 0 });
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const runCount = () => {
        tweenRef.current?.kill();
        objRef.current.value = 0;
        setCount(0);
        tweenRef.current = gsap.to(objRef.current, {
            value: 9847,
            duration: 2.5,
            ease: "power2.out",
            onUpdate: () => setCount(Math.round(objRef.current.value)),
        });
    };

    const runProgress = () => {
        tweenRef.current?.kill();
        objRef.current.progress = 0;
        setProgress(0);
        tweenRef.current = gsap.to(objRef.current, {
            progress: 100,
            duration: 2,
            ease: "power1.inOut",
            onUpdate: () => setProgress(Math.round(objRef.current.progress)),
        });
    };

    const reset = () => {
        tweenRef.current?.kill();
        objRef.current.value = 0;
        objRef.current.progress = 0;
        setCount(0);
        setProgress(0);
    };

    return (
        <DemoCard
            label="11. JS Object & Non-DOM Animation"
            theory={
                <>
                    GSAP can animate <strong className="text-zinc-200">any plain JavaScript object</strong> with numeric properties — no DOM element needed.
                    This is how you animate counters, scroll values, canvas data, WebGL uniforms, Three.js properties, or any reactive data.
                    <br /><br />
                    <span className="grid grid-cols-1 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">{"const obj = { value: 0 };"}</code></span>
                        <span><code className="text-secondary">{"gsap.to(obj, { value: 1000, onUpdate })"}</code></span>
                    </span>
                    <br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">scrollTop</code> — scroll position</span>
                        <span><code className="text-secondary">scrollLeft</code></span>
                        <span><code className="text-secondary">innerHTML</code> — via TextPlugin</span>
                        <span><code className="text-secondary">value</code> — input element value</span>
                        <span><code className="text-secondary">any numeric prop</code> — on any object</span>
                        <span><code className="text-secondary">Three.js mesh.position.x</code> etc.</span>
                    </span>
                </>
            }
            pros={[
                "Animate any data — Three.js, canvas, audio params, state values",
                "onUpdate callback fires every frame to sync the animated value to your UI",
                "gsap.to(obj, { x: 100 }) works even if obj is not a DOM element",
                "Combine with React state to create smooth number counters",
            ]}
            cons={[
                "React state updates inside onUpdate fire every RAF frame — use wisely",
                "For high-frequency updates, write to a ref and batch-update state at end",
                "Non-DOM tweens aren't scoped to useGSAP — manage cleanup with tweenRef.kill()",
            ]}
            code={`// Plain object counter
const obj = { value: 0 };
gsap.to(obj, {
  value: 9847,
  duration: 2.5,
  ease: "power2.out",
  onUpdate: () => {
    document.querySelector(".counter").textContent =
      Math.round(obj.value).toLocaleString();
  },
});

// Three.js example
gsap.to(mesh.position, { x: 5, y: 2, duration: 1 });
gsap.to(mesh.rotation, { y: Math.PI * 2, duration: 2 });
gsap.to(material, { opacity: 0, duration: 0.5 });

// Scroll to position
gsap.to(window, { scrollTo: { y: "#section" }, duration: 1 });

// Audio param
// gsap.to(gainNode.gain, { value: 0, duration: 0.5 }); // fade out audio

// Input value
// gsap.to("input", { value: 100, duration: 1 });`}
        >
            <div className="flex flex-col gap-4">
                <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-3">
                    <div className="text-center">
                        <span className="text-secondary font-mono text-5xl font-bold tabular-nums">{count.toLocaleString()}</span>
                        <p className="text-zinc-600 text-[10px] font-mono mt-1">animating obj.value</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full transition-none" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-zinc-600 text-[10px] font-mono">animating obj.progress</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={runCount} className="px-3 py-1 rounded bg-secondary text-black text-sm font-semibold">Count up</button>
                    <button onClick={runProgress} className="px-3 py-1 rounded bg-violet-600 text-white text-sm">Progress bar</button>
                    <button onClick={reset} className="px-3 py-1 rounded bg-zinc-700 text-white text-sm">Reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 12. Special Tween Config Keys
// ─────────────────────────────────────────────
const SpecialConfigDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const playPaused = () => {
        gsap.set(".cfg-box", { clearProps: "all", x: 0 });
        tweenRef.current = gsap.to(".cfg-box", {
            x: 160,
            duration: 1.5,
            ease: "power2.inOut",
            paused: true,
        });
        setActive("paused: true (tween created but not playing)");
    };

    const playTween = () => {
        tweenRef.current?.play();
        setActive("tween.play() called");
    };

    const playOverwrite = contextSafe(() => {
        gsap.set(".cfg-box", { clearProps: "all", x: 0 });
        gsap.to(".cfg-box", { x: 100, duration: 2 });
        setTimeout(() => {
            gsap.to(".cfg-box", { x: 200, duration: 1, overwrite: "auto" });
            setActive("overwrite: 'auto' — new tween killed conflicting x");
        }, 500);
    });

    const playKeyframes = contextSafe(() => {
        gsap.killTweensOf(".cfg-box");
        gsap.set(".cfg-box", { clearProps: "all" });
        gsap.to(".cfg-box", {
            keyframes: [
                { x: 60, y: -30, scale: 1.2, duration: 0.4 },
                { x: 120, y: 0, scale: 1, duration: 0.4 },
                { x: 60, y: 30, rotation: 180, duration: 0.4 },
                { x: 0, y: 0, rotation: 360, scale: 1, duration: 0.4 },
            ],
            ease: "power1.inOut",
        });
        setActive("keyframes array");
    });

    const playDelay = contextSafe(() => {
        gsap.killTweensOf(".cfg-box");
        gsap.set(".cfg-box", { clearProps: "all", x: 0 });
        gsap.to(".cfg-box", { x: 160, duration: 0.6, delay: 0.8, ease: "back.out(1.7)" });
        setActive("delay: 0.8s");
    });

    const reset = () => {
        tweenRef.current?.kill();
        gsap.killTweensOf(".cfg-box");
        gsap.set(".cfg-box", { clearProps: "all" });
        setActive("—");
    };

    return (
        <DemoCard
            label="12. Special Tween Config Keys"
            theory={
                <>
                    These keys go inside the <strong className="text-zinc-200">vars object</strong> alongside animatable properties
                    but are never animated themselves — they control tween behavior.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">duration</code> — seconds (default 0.5)</span>
                        <span><code className="text-secondary">delay</code> — start delay in seconds</span>
                        <span><code className="text-secondary">ease</code> — easing function</span>
                        <span><code className="text-secondary">paused</code> — don&apos;t auto-play</span>
                        <span><code className="text-secondary">reversed</code> — start in reverse</span>
                        <span><code className="text-secondary">immediateRender</code> — render frame 0 instantly</span>
                        <span><code className="text-secondary">lazy</code> — batch first-frame renders</span>
                        <span><code className="text-secondary">autoRound</code> — round pixel values</span>
                        <span><code className="text-secondary">overwrite</code> — handle conflicts</span>
                        <span><code className="text-secondary">id</code> — gsap.getById(id)</span>
                        <span><code className="text-secondary">data</code> — attach arbitrary data</span>
                        <span><code className="text-secondary">inherit</code> — inherit from context</span>
                        <span><code className="text-secondary">callbackScope</code> — &apos;this&apos; for callbacks</span>
                        <span><code className="text-secondary">keyframes</code> — multi-step animation</span>
                        <span><code className="text-secondary">runBackwards</code> — internal reverse flag</span>
                        <span><code className="text-secondary">stagger</code> — offset multiple targets</span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">overwrite values:</strong>{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">false</code> (default) — no overwrite,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">true</code> — kill all tweens on target,{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">&quot;auto&quot;</code> — kill only conflicting properties.
                </>
            }
            pros={[
                "paused: true lets you build a tween library and play on demand",
                "overwrite: 'auto' is smarter than true — only kills conflicting properties",
                "keyframes[] replaces building timelines for simple multi-step sequences",
                "id + gsap.getById() enables accessing tweens from anywhere in your app",
                "immediateRender: false prevents from() from snapping to start state on creation",
            ]}
            cons={[
                "overwrite defaults to false — overlapping tweens on same property will fight",
                "immediateRender defaults to true for from() — set false if pre-animating multiple items in a timeline",
                "autoRound: true (default) rounds to integers — set false for sub-pixel accuracy",
            ]}
            code={`// duration & delay
gsap.to(".el", { x: 200, duration: 1.5, delay: 0.5 });

// paused — create without playing
const tween = gsap.to(".el", { x: 200, duration: 1, paused: true });
button.onclick = () => tween.play();     // play on demand
button.onclick = () => tween.reverse();  // or reverse

// overwrite
gsap.to(".el", { x: 100, duration: 2 });
// half a second later, new tween kills only the x property conflict:
gsap.to(".el", { x: 200, duration: 1, overwrite: "auto" });

// keyframes — multi-step without a timeline
gsap.to(".el", {
  keyframes: [
    { x: 60, y: -30, duration: 0.4 },
    { x: 120, y: 0,  duration: 0.4 },
    { x: 0,  y: 0, rotation: 360, duration: 0.6 },
  ],
});

// id & data
const tween = gsap.to(".el", { x: 200, id: "myAnim", data: { type: "entrance" } });
gsap.getById("myAnim").pause();

// immediateRender
gsap.from(".el", { x: -200, immediateRender: false }); // don't snap to x:-200 yet

// autoRound (default: true for px values)
gsap.to(".el", { x: 100.7, autoRound: false }); // allow sub-pixel x

// callbackScope
gsap.to(".el", { x: 100, callbackScope: myObj, onComplete: myObj.handleDone });`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-16 flex items-center px-4 overflow-hidden">
                    <div className="cfg-box w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center text-white font-mono text-[9px] font-bold shrink-0">BOX</div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    <button onClick={playPaused} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">1. Create paused</button>
                    <button onClick={playTween} className="px-2 py-1 rounded text-[11px] font-mono bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 hover:bg-emerald-800/60 transition-colors">2. .play()</button>
                    <button onClick={playOverwrite} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">overwrite: &apos;auto&apos;</button>
                    <button onClick={playKeyframes} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">keyframes[]</button>
                    <button onClick={playDelay} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">delay: 0.8</button>
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 13. Repeat & Yoyo
// ─────────────────────────────────────────────
const RepeatYoyoDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [active, setActive] = useState("—");

    const play = contextSafe((label: string, vars: gsap.TweenVars) => {
        gsap.killTweensOf(".rep-box");
        gsap.set(".rep-box", { clearProps: "all" });
        gsap.to(".rep-box", { x: 140, duration: 0.6, ease: "power2.inOut", ...vars });
        setActive(label);
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".rep-box");
        gsap.set(".rep-box", { clearProps: "all" });
        setActive("—");
    });

    const btns: Array<[string, gsap.TweenVars]> = [
        ["repeat: 2", { repeat: 2 }],
        ["repeat: -1 (infinite)", { repeat: -1 }],
        ["repeat + yoyo", { repeat: -1, yoyo: true }],
        ["repeatDelay: 0.5", { repeat: 3, repeatDelay: 0.5 }],
        ["yoyoEase: power4.in", { repeat: -1, yoyo: true, yoyoEase: "power4.in" }],
        ["yoyoEase: elastic", { repeat: -1, yoyo: true, yoyoEase: "elastic.out(1,0.4)" }],
        ["repeat + stagger", { repeat: -1, yoyo: true, stagger: 0.1 }],
    ];

    return (
        <DemoCard
            label="13. Repeat, RepeatDelay & Yoyo"
            theory={
                <>
                    These keys control how a tween loops and reverses.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">repeat: n</code> — repeat n times after initial play</span>
                        <span><code className="text-secondary">repeat: -1</code> — loop forever</span>
                        <span><code className="text-secondary">repeatDelay: s</code> — pause between repeats</span>
                        <span><code className="text-secondary">yoyo: true</code> — reverse on odd repeats</span>
                        <span><code className="text-secondary">yoyoEase</code> — separate ease for reverse direction</span>
                        <span><code className="text-secondary">repeatRefresh: true</code> — re-evaluate dynamic values each repeat</span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">repeat: 1</strong> means play twice total (once + 1 repeat).{" "}
                    <strong className="text-zinc-200">repeat: -1</strong> is infinite.{" "}
                    <code className="text-secondary bg-zinc-800 px-1 rounded">yoyo: true</code> without <code className="text-secondary bg-zinc-800 px-1 rounded">repeat</code> has no effect.
                </>
            }
            pros={[
                "repeat: -1 with yoyo: true is the simplest infinite ping-pong loop",
                "yoyoEase lets forward and backward have different easing (e.g. fast out, slow in)",
                "repeatRefresh: true re-evaluates function-based values on each repeat cycle",
                "repeatDelay creates natural rhythm in looping animations",
            ]}
            cons={[
                "repeat: 1 plays TWICE total (not once) — repeat counts repeats, not total plays",
                "yoyo requires repeat to have any effect",
                "Infinite loops (repeat: -1) must be killed manually — use gsap.killTweensOf() or context cleanup",
            ]}
            code={`// repeat: n — total plays = n + 1
gsap.to(".el", { x: 200, repeat: 2 });          // plays 3× total
gsap.to(".el", { x: 200, repeat: -1 });          // infinite loop

// yoyo — reverses on odd repeat cycles
gsap.to(".el", { x: 200, repeat: -1, yoyo: true }); // ping-pong forever

// repeatDelay — pause between each repeat
gsap.to(".el", { x: 200, repeat: 3, repeatDelay: 0.5 });

// yoyoEase — different ease going backwards
gsap.to(".el", {
  x: 200,
  repeat: -1,
  yoyo: true,
  ease: "power2.out",
  yoyoEase: "power4.in",   // snaps back hard
});

// repeatRefresh — re-evaluate random/function values each cycle
gsap.to(".el", {
  x: () => gsap.utils.random(50, 200),
  repeat: -1,
  yoyo: true,
  repeatRefresh: true,     // new random x each time
});`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-16 flex items-center px-4 overflow-hidden">
                    <div className="rep-box w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white font-mono text-[9px] font-bold shrink-0">REP</div>
                </div>
                <p className="text-[10px] font-mono text-zinc-600">active: <span className="text-secondary">{active}</span></p>
                <div className="flex flex-wrap gap-1.5">
                    {btns.map(([label, vars]) => (
                        <button key={label} onClick={() => play(label, vars)}
                            className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">
                            {label}
                        </button>
                    ))}
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// 14. Callbacks
// ─────────────────────────────────────────────
const CallbacksDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLog((prev) => [`[${new Date().toLocaleTimeString("en", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}] ${msg}`, ...prev].slice(0, 8));
    };

    const playBasic = contextSafe(() => {
        gsap.killTweensOf(".cb-box");
        gsap.set(".cb-box", { clearProps: "all", x: 0 });
        setLog([]);
        gsap.to(".cb-box", {
            x: 180,
            duration: 1.5,
            ease: "power2.inOut",
            onStart: () => addLog("onStart — tween begins"),
            onUpdate: () => { /* fires every frame — too noisy to log */ },
            onComplete: () => addLog("onComplete — animation finished"),
        });
        setTimeout(() => addLog("onUpdate fires every RAF frame (not shown)"), 100);
    });

    const playRepeatCallbacks = contextSafe(() => {
        gsap.killTweensOf(".cb-box");
        gsap.set(".cb-box", { clearProps: "all", x: 0 });
        setLog([]);
        gsap.to(".cb-box", {
            x: 180,
            duration: 0.6,
            ease: "power2.inOut",
            repeat: 3,
            yoyo: true,
            onStart: () => addLog("onStart"),
            onRepeat: () => addLog("onRepeat — cycle restarted"),
            onReverseComplete: () => addLog("onReverseComplete — reversed to start"),
            onComplete: () => addLog("onComplete — all repeats done"),
        });
    });

    const playWithParams = contextSafe(() => {
        gsap.killTweensOf(".cb-box");
        gsap.set(".cb-box", { clearProps: "all", x: 0 });
        setLog([]);
        const tween = gsap.to(".cb-box", {
            x: 180,
            duration: 1,
            onStart: (label: string) => addLog(`onStartParams: "${label}"`),
            onStartParams: ["entrance-anim"],
            onComplete: (count: number) => addLog(`onCompleteParams: count=${count}`),
            onCompleteParams: [42],
        });
        addLog("tween created — id: " + (tween.vars.id ?? "(no id)"));
    });

    const reset = contextSafe(() => {
        gsap.killTweensOf(".cb-box");
        gsap.set(".cb-box", { clearProps: "all" });
        setLog([]);
    });

    return (
        <DemoCard
            label="14. Tween Callbacks"
            theory={
                <>
                    Callbacks fire at specific points in a tween&apos;s lifecycle. They are placed in the <strong className="text-zinc-200">vars object</strong> alongside animatable properties.
                    <br /><br />
                    <span className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-mono">
                        <span><code className="text-secondary">onStart</code> — tween begins playing</span>
                        <span><code className="text-secondary">onStartParams</code> — args for onStart</span>
                        <span><code className="text-secondary">onUpdate</code> — fires every RAF frame</span>
                        <span><code className="text-secondary">onUpdateParams</code></span>
                        <span><code className="text-secondary">onComplete</code> — tween fully done</span>
                        <span><code className="text-secondary">onCompleteParams</code></span>
                        <span><code className="text-secondary">onRepeat</code> — each repeat cycle</span>
                        <span><code className="text-secondary">onRepeatParams</code></span>
                        <span><code className="text-secondary">onReverseComplete</code> — reached t=0 while reversed</span>
                        <span><code className="text-secondary">onReverseCompleteParams</code></span>
                        <span><code className="text-secondary">onInterrupt</code> — tween killed mid-play</span>
                        <span><code className="text-secondary">callbackScope</code> — &apos;this&apos; for all callbacks</span>
                    </span>
                    <br />
                    <strong className="text-zinc-200">onUpdate</strong> fires on every animation frame. Avoid heavy work inside it.
                    Use it for syncing React state, canvas draws, or Three.js renders.
                </>
            }
            pros={[
                "onComplete is the correct place to trigger follow-up actions (never setTimeout)",
                "onUpdate syncs non-DOM rendering (canvas, Three.js, WebGL) to GSAP's RAF",
                "onRepeat fires each cycle — use to change direction, randomize values, etc.",
                "onReverseComplete fires when a reversed tween reaches its start — perfect for cleanup",
                "onInterrupt (GSAP 3.12+) fires when a tween is killed or overwritten",
            ]}
            cons={[
                "onUpdate runs every RAF frame — avoid setState or heavy DOM queries inside it",
                "Callbacks defined inline create new function references on each render — use contextSafe or stable refs",
                "onStart doesn't fire if the tween starts with delay and is killed before the delay ends",
            ]}
            code={`gsap.to(".el", {
  x: 200,
  duration: 1.5,

  // Lifecycle callbacks
  onStart:           () => console.log("started"),
  onUpdate:          () => renderCanvas(),           // sync canvas/WebGL
  onComplete:        () => showNextSection(),
  onRepeat:          () => console.log("repeat"),
  onReverseComplete: () => cleanup(),
  onInterrupt:       () => console.log("killed"),   // GSAP 3.12+

  // Pass arguments to callbacks
  onCompleteParams:  [myData, 42],
  onStartParams:     ["entrance"],

  // 'this' scope inside all callbacks
  callbackScope:     myObject,
});

// Reference the tween inside onUpdate
const tween = gsap.to(".el", {
  x: 200,
  onUpdate() {
    // 'this' is the tween when callbackScope is not set
    console.log("progress:", this.progress());
  },
});

// Sequencing with onComplete
gsap.to(".heading",  { opacity: 1, onComplete: () =>
  gsap.to(".body",   { opacity: 1, onComplete: () =>
    gsap.to(".cta",  { opacity: 1 })
  })
});
// Better: use a timeline instead ^^`}
        >
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="bg-zinc-900 rounded-xl h-14 flex items-center px-4 overflow-hidden">
                    <div className="cb-box w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-mono text-[9px] font-bold shrink-0">CB</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-700/40 rounded-xl p-3 min-h-20 font-mono text-[11px] flex flex-col gap-0.5">
                    {log.length === 0 ? (
                        <span className="text-zinc-600">— run an animation to see callbacks fire —</span>
                    ) : (
                        log.map((entry, i) => (
                            <span key={i} className={i === 0 ? "text-secondary" : "text-zinc-500"}>{entry}</span>
                        ))
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    <button onClick={playBasic} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">onStart + onComplete</button>
                    <button onClick={playRepeatCallbacks} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">onRepeat + onReverseComplete</button>
                    <button onClick={playWithParams} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors">onStartParams + onCompleteParams</button>
                    <button onClick={reset} className="px-2 py-1 rounded text-[11px] font-mono bg-zinc-800 text-zinc-500 hover:text-white transition-colors">↺ reset</button>
                </div>
            </div>
        </DemoCard>
    );
};


// ─────────────────────────────────────────────
// Root page
// ─────────────────────────────────────────────
const LearningAnimatableProperties = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Container>
                <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl text-secondary font-bold font-mono">Animatable Properties</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
                            Complete reference of <strong className="text-zinc-300">every property category</strong> GSAP can animate —
                            transforms, CSS, SVG, custom variables, plain objects, and all special config keys.
                        </p>
                        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4 mt-1 max-w-3xl">
                            <p className="text-zinc-200 font-semibold mb-2 text-sm">Quick Reference</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-[11px] font-mono text-zinc-400">
                                <span>2D Transforms — x, y, rotation, scale, skew</span>
                                <span>3D Transforms — rotationX/Y, z, perspective</span>
                                <span>Sizing — width, height, borderRadius, padding</span>
                                <span>Colors — backgroundColor, color, boxShadow</span>
                                <span>Filter — blur, brightness, hue-rotate, grayscale</span>
                                <span>clipPath — inset, circle, ellipse, polygon</span>
                                <span>Typography — fontSize, letterSpacing, lineHeight</span>
                                <span>SVG — fill, stroke, strokeDashoffset, attr:{"{}"}</span>
                                <span>CSS Variables — --custom-property</span>
                                <span>JS Objects — any numeric property</span>
                                <span>Config Keys — paused, repeat, yoyo, overwrite</span>
                                <span>Callbacks — onStart, onUpdate, onComplete…</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <Transform2DDemo />
                        <Transform3DDemo />
                        <SizingLayoutDemo />
                        <ColorsVisualDemo />
                        <CSSFilterDemo />
                        <ClipPathDemo />
                        <TypographyDemo />
                        <SVGPropertiesDemo />
                        <SVGAttrDrawDemo />
                        <CSSVariablesDemo />
                        <JSObjectDemo />
                        <SpecialConfigDemo />
                        <RepeatYoyoDemo />
                        <CallbacksDemo />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default LearningAnimatableProperties;
