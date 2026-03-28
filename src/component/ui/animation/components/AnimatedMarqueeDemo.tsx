"use client";
import ParallaxMarquee from "./AnimatedMarque";

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

const row3 = [
    "/assets/images/image15.png",
    "/assets/images/image16.png",
    "/assets/images/image17.png",
    "/assets/images/image18.png",
    "/assets/images/image19.png",
    "/assets/images/image20.png",
    "/assets/images/image1.png",
];

const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 px-6">
        {children}
    </p>
);

const AnimatedMarqueeDemo = () => {
    return (
        <div className="w-full py-10 space-y-8">

            {/* Auto-play — opposite directions */}
            <div className="space-y-4">
                <Label>Auto play — stacked rows</Label>
                <ParallaxMarquee items={row1} direction={1} baseVelocity={3} gap={16} />
                <ParallaxMarquee items={row2} direction={-1} baseVelocity={3} gap={16} />
            </div>

            {/* Scroll-driven with reverse */}
            <div>
                <Label>Scroll to play · reverses on scroll-up</Label>
                <ParallaxMarquee
                    items={row3}
                    direction={1}
                    baseVelocity={5}
                    gap={16}
                    playMode="scroll"
                    scrollReverse
                />
            </div>

            {/* Hover-pause + draggable */}
            <div>
                <Label>Hover to pause · draggable</Label>
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

            {/* Faded ribbon */}
            <div>
                <Label>Ribbon · scroll-driven · no loop</Label>
                <ParallaxMarquee
                    items={row2}
                    direction={1}
                    baseVelocity={3}
                    gap={16}
                    variant="ribbon"
                    playMode="scroll"
                    opacity={0.5}
                    itemWidth={180}
                />
            </div>

        </div>
    );
};

export default AnimatedMarqueeDemo;
