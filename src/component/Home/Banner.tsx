// "use client";

// // app/page.tsx  — example page demonstrating ScrollSmoother features
// //
// // data-speed="0.5"   → moves at half scroll speed (parallax slower)
// // data-speed="1.5"   → moves at 1.5x scroll speed (parallax faster)
// // data-speed="clamp(0.5)" → same as 0.5 but clamps so it never scrolls
// //                           off-screen at the start/end
// // data-lag="0.3"     → element "lags" behind scroll by 0.3 seconds
// //
// // ScrollTrigger.create() → pin, scrub, toggle classes, etc.

// import { useRef, useLayoutEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollSmoother } from "gsap/ScrollSmoother";
// import { useSmoother } from "../ui/animation/SmoothScroller";
// import Image from "next/image";

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// export default function Banner() {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const smoother = useSmoother(); // access the smoother instance from context

//     useLayoutEffect(() => {
//         const ctx = gsap.context(() => {

//             // ── Pin an element when it reaches the center ──────────────────
//             ScrollTrigger.create({
//                 trigger: "#pinned-box",
//                 pin: true,
//                 start: "center center",
//                 end: "+=400",
//             });

//             // ── Scrub a heading's opacity as you scroll ────────────────────
//             gsap.fromTo(
//                 "#fade-heading",
//                 { opacity: 0, y: 60 },
//                 {
//                     opacity: 1,
//                     y: 0,
//                     scrollTrigger: {
//                         trigger: "#fade-heading",
//                         start: "top 80%",
//                         end: "top 40%",
//                         scrub: 1,
//                     },
//                 }
//             );

//         }, containerRef);

//         return () => ctx.revert();
//     }, []);

//     // Jump to an element using the smoother instance
//     const scrollToShape = () => {
//         smoother?.scrollTo("#pinned-box", true, "center center");
//     };

//     return (
//         <main ref={containerRef} className="relative">

//             {/* ── Hero ───────────────────────────────────────────────────── */}
//             <section className="flex flex-col items-center justify-center h-screen text-white">
//                 <h1 className="text-6xl font-bold">ScrollSmoother</h1>
//                 <button
//                     onClick={scrollToShape}
//                     className="mt-6 px-6 py-2 bg-white text-black rounded-full"
//                 >
//                     Jump to pinned box
//                 </button>
//             </section>

//             {/* ── Parallax boxes ─────────────────────────────────────────── */}

//             {/* Slower than scroll speed */}
//             <div
//                 data-speed="clamp(0.5)"
//                 className="absolute left-1/4 top-100 w-24 h-24 bg-pink-400 rounded-xl flex items-center justify-center text-white font-bold"
//             >
//                 0.5×
//             </div>

//             {/* Slightly slower */}
//             <div
//                 data-speed="clamp(0.8)"
//                 className="absolute left-1/2 -translate-x-1/2 top-225 w-24 h-24 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold"
//             >
//                 0.8×
//             </div>

//             {/* Faster than scroll speed — flies upward */}
//             <Image
//                 data-speed="1.5"
//                 src="https://assets.codepen.io/16327/2D-keyframe-2.png"
//                 alt="parallax shape"
//                 className="absolute left-1/2 -translate-x-1/2 top-325 w-24 h-24"
//             />

//             {/* ── Lagging element ────────────────────────────────────────── */}
//             <div
//                 data-lag="0.4"
//                 className="absolute right-16 top-175 w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center text-white text-xs text-center"
//             >
//                 lag 0.4s
//             </div>

//             {/* ── Pinned box (ScrollTrigger pin) ─────────────────────────── */}
//             <section
//                 id="pinned-box"
//                 className="flex items-center justify-center h-screen"
//             >
//                 <div className="w-40 h-40 bg-yellow-400 rounded-2xl flex items-center justify-center text-black font-bold text-lg">
//                     Pinned!
//                 </div>
//             </section>

//             {/* ── Scrubbed fade heading ───────────────────────────────────── */}
//             <section className="flex items-center justify-center h-screen">
//                 <h2 id="fade-heading" className="text-5xl font-bold text-white opacity-0">
//                     Scrubbed Fade
//                 </h2>
//             </section>

//             {/* Spacer so we can scroll past the last section */}
//             <div className="h-screen" />
//         </main>
//     );
// }

"use client";
import { useEffect, useRef } from "react";

const Banner = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Pause video when scrolled off-screen — stops GPU decode overhead
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <main data-cursor="animated_circle" className="relative h-screen w-full flex flex-col justify-center px-4 md:px-12 overflow-hidden">
            <div className="absolute inset-0 z-0 select-none bg-[#06243F]">
                <div
                    className="w-full h-full"
                    style={{ opacity: 0.70 }}
                >
                    {/* q_auto:eco + w_1280 + fps_24 — ~70% smaller than q_auto:best at full res */}
                    <video
                        ref={videoRef}
                        preload="none"
                        autoPlay
                        loop
                        muted
                        playsInline
                        src="https://res.cloudinary.com/dxg3y4inb/video/upload/q_auto:eco,w_1280,fps_24,vc_auto/v1769964756/241009_JANV_REEL_EDIT_V6_Audio_No_Title_WebFront_woj7am.mp4"
                        poster="https://res.cloudinary.com/dxg3y4inb/video/upload/so_0,f_jpg,q_auto:eco,w_1280/v1769964756/241009_JANV_REEL_EDIT_V6_Audio_No_Title_WebFront_woj7am.jpg"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06243F]/80 to-transparent z-10"></div>
            </div>

            <div className="absolute inset-0 z-20 pointer-events-none select-none">
                <div
                    className="hidden md:flex absolute right-12 bottom-14 lg:bottom-20 2xl:bottom-28 flex-col items-end gap-6 lg:gap-10 2xl:gap-14 text-right"
                    style={{ opacity: 1 }}
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[#c7ea46] uppercase tracking-[0.2em] font-bold">
                            Network
                        </span>
                        <span className="text-4xl md:text-6xl font-black text-white leading-none">
                            250+
                        </span>
                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-medium">
                            Editors Worldwide
                        </span>
                    </div>

                    <div className="max-w-[280px] text-right">
                        <span className="text-[9px] text-[#c7ea46] uppercase tracking-[0.4em] font-black block mb-4">
                            Our Identity
                        </span>
                        <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium uppercase tracking-wider">
                            A premier global studio architecting the future of media. We
                            deliver high-fidelity visual storytelling at the speed of culture,
                            powered by a network of 250+ elite artists.
                        </p>
                    </div>
                </div>

                <div
                    className="absolute left-8 md:left-12 bottom-14 lg:bottom-20 2xl:bottom-28 z-20 pointer-events-none"
                    style={{ opacity: 1, transform: "none" }}
                >
                    <div style={{ transform: "translateX(-12.3125px)" }}>
                        <div className="overflow-hidden flex text-[8vw] md:text-[4.5rem] font-black uppercase text-white leading-[0.8] tracking-tighter">
                            {"WE ARCHITECT".split("").map((char, i) => (
                                <span key={i} className="inline-block relative">
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            ))}
                        </div>

                        <div className="overflow-hidden flex text-[8vw] md:text-[4.5rem] font-black uppercase text-[#c7ea46] leading-[0.8] tracking-tighter">
                            {"THE IMPOSSIBLE".split("").map((char, i) => (
                                <span key={i} className="inline-block relative">
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 overflow-hidden">
                        <p
                            className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em]"
                            style={{ transform: "none" }}
                        >
                            Precision Defined • Global Production
                        </p>
                    </div>
                </div>
            </div>

            <div
                className="absolute bottom-0 left-0 w-full z-30 overflow-hidden py-3 border-t border-white/5 bg-[#06243F]/40 backdrop-blur-md"
                style={{ opacity: 1 }}
            >
                <div
                    className="flex gap-12 whitespace-nowrap items-center"
                    style={{ transform: "translateX(-15.1183%)" }}
                >
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="flex items-center gap-12 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/50"
                        >
                            <span>250+ Editors</span>
                            <span className="w-1 h-1 bg-[#c7ea46] rounded-full"></span>
                            <span>24/7 Production</span>
                            <span className="w-1 h-1 bg-[#c7ea46] rounded-full"></span>
                            <span>Global Delivery</span>
                            <span className="w-1 h-1 bg-[#c7ea46] rounded-full"></span>
                            <span>Premium Quality</span>
                            <span className="w-1 h-1 bg-[#c7ea46] rounded-full"></span>
                        </span>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Banner;