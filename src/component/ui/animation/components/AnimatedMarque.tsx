"use client";
import gsap from "gsap";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

const wrap = (val: number, totalWidth: number) =>
    ((val % totalWidth) + totalWidth) % totalWidth - totalWidth;

type MarqueeProps = {
    items: (string | StaticImageData)[];
    /** 1 = left, -1 = right */
    direction?: 1 | -1;
    /** Pixels per second (scaled to 60fps) */
    baseVelocity?: number;
    /** Width of each item in px (default: 200) */
    itemWidth?: number;
    /** Gap between items in px (default: 0) */
    gap?: number;
    /** Opacity of the whole strip (0–1, default: 1) */
    opacity?: number;
    /** Allow click-drag to scrub the marquee */
    draggable?: boolean;
    /**
     * "auto"        — always playing (default)
     * "scroll"      — only moves while the user is scrolling; pauses otherwise
     * "hover-pause" — plays normally, pauses on hover
     */
    playMode?: "auto" | "scroll" | "hover-pause";
    /**
     * "marquee" — wrapping infinite strip (default)
     * "ribbon"  — items laid out once, no looping
     */
    variant?: "marquee" | "ribbon";
    /**
     * When true (default), scrolling up reverses the direction.
     * Set to false to keep the defined direction regardless of scroll.
     */
    scrollReverse?: boolean;
};

const ParallaxMarquee = ({
    items,
    direction = 1,
    baseVelocity = 2.5,
    itemWidth = 200,
    gap = 0,
    opacity = 1,
    draggable = false,
    playMode = "auto",
    variant = "marquee",
    scrollReverse = true,
}: MarqueeProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const xRef = useRef(0);

    const hoverPaused = useRef(false);
    const scrollActive = useRef(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollDir = useRef(direction);

    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartMotionX = useRef(0);
    const lastDragX = useRef(0);
    const dragVelocity = useRef(0);

    const lastTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    const itemStride = itemWidth + gap;
    const totalWidth = items.length * itemStride;
    const displayItems = variant === "ribbon" ? items : [...items, ...items, ...items];

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const isPlaying = () => {
            if (isDragging.current) return false;
            if (playMode === "hover-pause" && hoverPaused.current) return false;
            if (playMode === "scroll" && !scrollActive.current) return false;
            return true;
        };

        // ── Scroll listener ───────────────────────────────────────────
        const onWheel = (e: WheelEvent) => {
            scrollDir.current = (!scrollReverse || e.deltaY > 0)
                ? direction
                : (direction * -1) as 1 | -1;

            if (playMode === "scroll") {
                scrollActive.current = true;
                if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
                scrollTimerRef.current = setTimeout(() => {
                    scrollActive.current = false;
                }, 300);
            }
        };

        window.addEventListener("wheel", onWheel, { passive: true });

        // ── Animation loop ────────────────────────────────────────────
        const tick = (time: number) => {
            const delta = lastTimeRef.current ? time - lastTimeRef.current : 0;
            lastTimeRef.current = time;

            if (isPlaying()) {
                if (Math.abs(dragVelocity.current) > 0.5) {
                    xRef.current = wrap(xRef.current + dragVelocity.current, totalWidth);
                    dragVelocity.current *= 0.92;
                } else {
                    dragVelocity.current = 0;
                    const vel = scrollDir.current * baseVelocity * (delta / 1000) * 60;
                    if (variant === "ribbon") {
                        xRef.current = Math.min(0, Math.max(-(totalWidth - itemStride), xRef.current + vel));
                    } else {
                        xRef.current = wrap(xRef.current + vel, totalWidth);
                    }
                }
            }

            gsap.set(track, { x: xRef.current });
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("wheel", onWheel);
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        };
    }, [direction, baseVelocity, totalWidth, itemStride, playMode, variant, scrollReverse]);

    // ── Drag handlers ─────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        dragVelocity.current = e.clientX - lastDragX.current;
        lastDragX.current = e.clientX;
        xRef.current = wrap(dragStartMotionX.current + (e.clientX - dragStartX.current), totalWidth);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!draggable) return;
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartMotionX.current = xRef.current;
        lastDragX.current = e.clientX;
        dragVelocity.current = 0;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!draggable) return;
        isDragging.current = true;
        dragStartX.current = e.touches[0].clientX;
        dragStartMotionX.current = xRef.current;
        lastDragX.current = e.touches[0].clientX;
        dragVelocity.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return;
        dragVelocity.current = e.touches[0].clientX - lastDragX.current;
        lastDragX.current = e.touches[0].clientX;
        xRef.current = wrap(dragStartMotionX.current + (e.touches[0].clientX - dragStartX.current), totalWidth);
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
    };

    return (
        <div
            className="overflow-hidden relative select-none"
            style={{ opacity, cursor: draggable ? "grab" : "default" }}
            onMouseEnter={() => {
                if (playMode === "hover-pause") hoverPaused.current = true;
            }}
            onMouseLeave={() => {
                if (playMode === "hover-pause") hoverPaused.current = false;
                if (isDragging.current) handleMouseUp();
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                ref={trackRef}
                className="flex items-center"
                style={{
                    width: `${totalWidth * (variant === "ribbon" ? 1 : 3)}px`,
                    gap: `${gap}px`,
                }}
            >
                {displayItems.map((src, i) => (
                    <div
                        key={i}
                        className="shrink-0 pointer-events-none"
                        style={{ width: itemWidth, height: 150 }}
                    >
                        <Image
                            src={src}
                            alt="partner logo"
                            width={itemWidth}
                            height={150}
                            className="object-contain w-full h-full"
                            draggable={false}
                            fetchPriority="high"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParallaxMarquee;
