"use client";
import TestimonialMarquee, {
    Testimonial,
} from "../ui/animation/components/TestimonialMarquee";

// ── Sample data ───────────────────────────────────────────────────────────────

const testimonials: Testimonial[] = [
    {
        name: "Alex Rivera",
        handle: "@alex",
        quote: "I've never seen anything like this before. It's amazing. I love it.",
        gradient: "linear-gradient(135deg,#a8edea,#fed6e3)",
    },
    {
        name: "Jordan Kim",
        handle: "@jordan",
        quote: "I'm at a loss for words. This is amazing. I love it.",
        gradient: "linear-gradient(135deg,#84fab0,#8fd3f4)",
    },
    {
        name: "Sam Chen",
        handle: "@sam",
        quote: "I don't know what to say. I'm speechless. This is amazing.",
        gradient: "linear-gradient(135deg,#667eea,#764ba2)",
    },
    {
        name: "Taylor Brooks",
        handle: "@taylor",
        quote: "Absolutely blown away. The attention to detail is incredible.",
        gradient: "linear-gradient(135deg,#f6d365,#fda085)",
    },
    {
        name: "Morgan Lee",
        handle: "@morgan",
        quote: "This changed the way I think about web animation entirely.",
        gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)",
    },
    {
        name: "Casey Wang",
        handle: "@casey",
        quote: "Smooth, fast, and beautiful. Exactly what I was looking for.",
        gradient: "linear-gradient(135deg,#43e97b,#38f9d7)",
    },
    {
        name: "Riley Patel",
        handle: "@riley",
        quote: "The scroll interaction feels so natural. Genuinely impressive work.",
        gradient: "linear-gradient(135deg,#fa709a,#fee140)",
    },
    {
        name: "Drew Martinez",
        handle: "@drew",
        quote: "I showed this to my whole team. Everyone was immediately hooked.",
        gradient: "linear-gradient(135deg,#fccb90,#d57eeb)",
    },
    {
        name: "Quinn Nguyen",
        handle: "@quinn",
        quote: "Silky animations with zero jank. This is how it should always be.",
        gradient: "linear-gradient(135deg,#a8edea,#feda75)",
    },
    {
        name: "Avery Okafor",
        handle: "@avery",
        quote: "The 3D perspective mode is absolutely stunning in full screen.",
        gradient: "linear-gradient(135deg,#30cfd0,#330867)",
    },
    {
        name: "Jamie Torres",
        handle: "@jamie",
        quote: "Pure CSS with GSAP RAF — no heavy libraries. Respect.",
        gradient: "linear-gradient(135deg,#f093fb,#f5576c)",
    },
    {
        name: "Blake Harris",
        handle: "@blake",
        quote: "Drag-to-scrub with inertia feels incredibly physical and satisfying.",
        gradient: "linear-gradient(135deg,#4facfe,#00f2fe)",
    },
];

// ── Label helper ──────────────────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="text-white/40 text-xs mb-3 uppercase tracking-widest font-mono">
        {children}
    </p>
);

// ── Demo ──────────────────────────────────────────────────────────────────────

const TestimonialMarqueeDemo = () => (
    <div className="bg-[#0d0d0d] px-6 py-10 space-y-14">

        {/* 1 — Default vertical scroll */}
        <section>
            <Label>3 columns · auto scroll up · hover to pause</Label>
            <TestimonialMarquee
                items={testimonials}
                columns={3}
                direction="up"
                baseVelocity={1}
                cardWidth={260}
                cardHeight={175}
                className="h-screen w-dvw"
                pauseOnHover
            />
        </section>

        {/* 2 — 3D perspective mode */}
        <section>
            <Label>3D perspective · 4 columns · full width</Label>
            <TestimonialMarquee
                items={testimonials}
                columns={4}
                direction="up"
                baseVelocity={0.8}
                is3D
                cardWidth={240}
                cardHeight={175}
                columnGap={14}
                className="h-screen w-full"
            />
        </section>

        {/* 3 — per-column directions with columnDirections */}
        <section>
            <Label>4 columns · alternating up ↑ down ↓ per column</Label>
            <TestimonialMarquee
                items={testimonials}
                columns={4}
                columnDirections={["up", "down", "up", "down"]}
                baseVelocity={1.2}
                cardWidth={260}
                cardHeight={175}
                className="h-120 w-full"
                pauseOnHover
            />
        </section>

        {/* 4 — 3 columns mixed directions */}
        <section>
            <Label>3 columns · mixed directions · 3D</Label>
            <TestimonialMarquee
                items={testimonials}
                columns={3}
                columnDirections={["down", "up", "down"]}
                baseVelocity={0.9}
                is3D
                cardWidth={260}
                cardHeight={175}
                className="h-96 w-full mx-auto"
                columnGap={14}
            />
        </section>

        {/* 5 — 5 columns, custom per-column speeds */}
        <section>
            <Label>5 columns · custom speeds · hover to pause</Label>
            <TestimonialMarquee
                items={testimonials}
                columns={5}
                direction="up"
                baseVelocity={1}
                columnSpeeds={[0.6, 1, 0.8, 1.2, 0.7]}
                cardWidth={220}
                cardHeight={170}
                className="h-115 w-full"
                columnGap={12}
                pauseOnHover
            />
        </section>

    </div>
);

export default TestimonialMarqueeDemo;
