"use client";
import ParallaxMarquee from "../ui/animation/components/AnimatedMarque";

// ── Image rows ────────────────────────────────────────────────────────────────
const row1 = [
    "/assets/images/image1.png",
    "/assets/images/image2.png",
    "/assets/images/image3.png",
    "/assets/images/image4.png",
    "/assets/images/image5.png",
    "/assets/images/image6.png",
    "/assets/images/image7.png",
];

const row2 = [
    "/assets/images/image8.png",
    "/assets/images/image9.png",
    "/assets/images/image10.png",
    "/assets/images/image11.png",
    "/assets/images/image12.png",
    "/assets/images/image13.png",
    "/assets/images/image14.png",
];

// ── Text rows ─────────────────────────────────────────────────────────────────
const textRow1 = [
    { text: "GSAP", mod: "" as const },
    { text: "✦", mod: "sep" as const },
    { text: "CREATIVE", mod: "--accent" as const },
    { text: "✦", mod: "sep" as const },
    { text: "FRONTEND", mod: "--outline" as const },
    { text: "✦", mod: "sep" as const },
    { text: "SCROLL", mod: "" as const },
    { text: "✦", mod: "sep" as const },
    { text: "VELOCITY", mod: "--accent" as const },
    { text: "✦", mod: "sep" as const },
    { text: "ANIMATION", mod: "--outline" as const },
    { text: "✦", mod: "sep" as const },
];

const textRow2 = [
    { text: "MOTION", mod: "" as const },
    { text: "✦", mod: "sep" as const },
    { text: "WEB", mod: "--outline" as const },
    { text: "✦", mod: "sep" as const },
    { text: "STUDIO", mod: "--accent" as const },
    { text: "✦", mod: "sep" as const },
    { text: "TICKER", mod: "" as const },
    { text: "✦", mod: "sep" as const },
    { text: "MARQUEE", mod: "--accent" as const },
    { text: "✦", mod: "sep" as const },
    { text: "INFINITE", mod: "--outline" as const },
    { text: "✦", mod: "sep" as const },
];

const textRow3 = [
    { text: "TRIGGER", mod: "" as const },
    { text: "✦", mod: "sep" as const },
    { text: "STAGGER", mod: "" as const },
    { text: "✦", mod: "sep" as const },
    { text: "TIMELINE", mod: "--accent" as const },
    { text: "✦", mod: "sep" as const },
    { text: "LOOP", mod: "--outline" as const },
    { text: "✦", mod: "sep" as const },
    { text: "EASING", mod: "" as const },
    { text: "✦", mod: "sep" as const },
    { text: "TWEEN", mod: "--accent" as const },
    { text: "✦", mod: "sep" as const },
];

const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 px-6">
        {children}
    </p>
);

const AnimatedMarqueeDemo = () => {
    return (
        <div className="w-full py-10 space-y-10">

            {/* Image — auto-play stacked */}
            <div className="space-y-4">
                <Label>Image · auto play · stacked rows</Label>
                <ParallaxMarquee items={row1} direction={1} baseVelocity={3} gap={16} />
                <ParallaxMarquee items={row2} direction={-1} baseVelocity={3} gap={16} />
            </div>

            {/* Text — stacked 3 rows, scroll boost */}
            <div data-cursor="textview" className="space-y-2">
                <Label>Text · stacked 3 rows · scroll boost</Label>
                <ParallaxMarquee items={textRow1} direction={1} baseVelocity={2} itemWidth={210} textSize="text-4xl" scrollBoost />
                <ParallaxMarquee items={textRow2} direction={-1} baseVelocity={2} itemWidth={210} textSize="text-4xl" scrollBoost />
                <ParallaxMarquee items={textRow3} direction={1} baseVelocity={2} itemWidth={210} textSize="text-4xl" scrollBoost />
                <ParallaxMarquee items={textRow2} direction={-1} baseVelocity={2} itemWidth={210} textSize="text-4xl" scrollBoost />
            </div>

            {/* Image — scroll-driven */}
            <div>
                <Label>Image · scroll to play · reverses on scroll-up</Label>
                <ParallaxMarquee items={row1} direction={1} baseVelocity={5} gap={16} playMode="scroll" scrollReverse />
            </div>

            {/* Text — scroll to play */}
            <div>
                <Label>Text · scroll to play</Label>
                <ParallaxMarquee
                    items={textRow1}
                    direction={1}
                    baseVelocity={4}
                    itemWidth={210}
                    textSize="text-5xl"
                    playMode="scroll"
                />
            </div>

            {/* Image — hover-pause + draggable */}
            <div>
                <Label>Image · hover to pause · draggable</Label>
                <ParallaxMarquee
                    items={row1}
                    direction={-1}
                    baseVelocity={2.5}
                    gap={16}
                    playMode="hover-pause"
                    draggable
                    itemWidth={240}
                />
            </div>

            {/* Text — hover pause */}
            <div>
                <Label>Text · hover to pause</Label>
                <ParallaxMarquee
                    items={textRow2}
                    direction={-1}
                    baseVelocity={2.5}
                    itemWidth={210}
                    textSize="text-4xl"
                    playMode="hover-pause"
                />
            </div>

            {/* Text — large, single row, outline only */}
            <div>
                <Label>Text · outline style · large</Label>
                <ParallaxMarquee
                    items={textRow3.map(item => ({ ...item, mod: item.mod === "sep" ? "sep" as const : "--outline" as const }))}
                    direction={1}
                    baseVelocity={2}
                    itemWidth={210}
                    textSize="text-6xl"
                    scrollBoost
                    draggable={true}
                    scrollBoostMultiplierDown={5}
                />
            </div>

        </div>
    );
};

export default AnimatedMarqueeDemo;
