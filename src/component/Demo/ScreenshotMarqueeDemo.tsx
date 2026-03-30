"use client";
import ScreenshotMarquee from "../ui/animation/components/ScreenshotMarquee";

// ── Images ────────────────────────────────────────────────────────────────────

const webTemplates = [
    "/assets/images/web_templet1.png",
    "/assets/images/web_templet2.png",
    "/assets/images/web_templet3.png",
    "/assets/images/image1.png",
    "/assets/images/image2.png",
    "/assets/images/image3.png",
    "/assets/images/image4.png",
    "/assets/images/image5.png",
    "/assets/images/image6.png",
    "/assets/images/image7.png",
    "/assets/images/image8.png",
    "/assets/images/image9.png",
    "/assets/images/image10.png",
    "/assets/images/image11.png",
    "/assets/images/image12.png",
];

// ── Label ─────────────────────────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="text-white/40 text-xs mb-3 uppercase tracking-widest font-mono">
        {children}
    </p>
);

// ── Demo ──────────────────────────────────────────────────────────────────────

const ScreenshotMarqueeDemo = () => (
    <div className="bg-[#060608] space-y-0">

        {/* 1 — 3D hero wall · left tilt */}
        <section className="relative">
            <div className="absolute top-6 left-6 z-10">
                <Label>3D hero wall · left tilt · 5 columns</Label>
            </div>
            <ScreenshotMarquee
                items={webTemplates}
                columns={5}
                direction="up"
                is3D
                tiltDirection="left"
                baseVelocity={0.9}
                cardWidth={240}
                cardHeight={320}
                columnGap={14}
                columnSpeeds={[1, 0.65, 1.1, 0.75, 0.95]}
                className="h-screen w-full"
            />
        </section>

        {/* 2 — 3D hero wall · right tilt */}
        <section className="relative">
            <div className="absolute top-6 left-6 z-10">
                <Label>3D hero wall · right tilt · alternating directions</Label>
            </div>
            <ScreenshotMarquee
                items={webTemplates}
                columns={5}
                columnDirections={["up", "down", "up", "down", "up"]}
                is3D
                tiltDirection="right"
                baseVelocity={0.85}
                cardWidth={240}
                cardHeight={320}
                columnGap={14}
                columnSpeeds={[0.8, 1, 0.7, 1.1, 0.9]}
                className="h-screen w-full"
            />
        </section>

        {/* 3 — Flat 4 columns · alternating direction */}
        <section className="px-6 py-10">
            <Label>Flat · 4 columns · alternating up ↑ down ↓</Label>
            <ScreenshotMarquee
                items={webTemplates}
                columns={4}
                columnDirections={["up", "down", "up", "down"]}
                baseVelocity={1}
                cardWidth={260}
                cardHeight={300}
                columnGap={16}
                className="h-[600px] w-full"
                pauseOnHover
            />
        </section>

        {/* 4 — 3D · 3 columns · pause on hover */}
        <section className="relative px-6 py-10">
            <Label>3D · 3 columns · hover to pause</Label>
            <ScreenshotMarquee
                items={webTemplates}
                columns={3}
                direction="up"
                is3D
                tiltDirection="left"
                baseVelocity={1}
                cardWidth={300}
                cardHeight={340}
                columnGap={18}
                className="h-[560px] w-full"
                pauseOnHover
            />
        </section>

    </div>
);

export default ScreenshotMarqueeDemo;
