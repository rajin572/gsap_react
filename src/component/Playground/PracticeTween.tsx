"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "../ui/Container";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const PracticeTween = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const containerRefTwo = useRef<HTMLDivElement | null>(null);
    const boxRefTwo = useRef<HTMLDivElement | null>(null);
    const timeLineRef = useRef<gsap.core.Timeline | null>(null);

    useGSAP(() => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        console.log(containerWidth)
        const boxWidth = boxRef.current?.offsetWidth ?? 0;
        tweenRef.current = gsap.to(boxRef.current, {
            x: (containerWidth - 20) - boxWidth,
            rotation: 360,
            duration: 2,
            ease: "power1.inOut",
            paused: true,
        });
    }, { scope: containerRef });


    const play = () => {
        tweenRef.current?.play();
    }

    const pause = () => {
        tweenRef.current?.pause();
    }

    const restart = () => {
        tweenRef.current?.restart();
    }

    const reset = () => {
        tweenRef.current?.seek(0).pause();
    }
    const reverse = () => {
        tweenRef.current?.reverse();
    }




    // ── Timeline demo ────────────────────────────────────────
    // const containerRefTl = useRef<HTMLDivElement | null>(null);
    // const boxRefTl       = useRef<HTMLDivElement | null>(null);
    // const tlRef          = useRef<gsap.core.Timeline | null>(null);

    // useGSAP(() => {
    //     const containerWidth = containerRefTl.current?.clientWidth ?? 0;
    //     const boxWidth       = boxRefTl.current?.offsetWidth ?? 0;
    //     const maxX           = (containerWidth - 20) - boxWidth;

    //     tlRef.current = gsap.timeline({ paused: true })
    //         .to(boxRefTl.current, { x: maxX,  duration: 1,   ease: "power2.out" })
    //         .to(boxRefTl.current, { rotation: 360, duration: 0.6, ease: "power1.inOut" }, "<")
    //         .to(boxRefTl.current, { y: -40,   duration: 0.4, ease: "power2.out" })
    //         .to(boxRefTl.current, { y: 0,     duration: 0.4, ease: "bounce.out" })
    //         .to(boxRefTl.current, { x: 0, rotation: 0, duration: 1, ease: "power2.inOut" });
    // }, { scope: containerRefTl });

    // const tlPlay    = () => tlRef.current?.play();
    // const tlPause   = () => tlRef.current?.pause();
    // const tlRestart = () => tlRef.current?.restart();
    // const tlReset   = () => tlRef.current?.seek(0).pause();
    // const tlReverse = () => tlRef.current?.reverse();

    useGSAP(() => {
        const containerWidth = containerRefTwo.current?.clientWidth ?? 0;
        const boxWidth = boxRefTwo.current?.offsetWidth ?? 0;

        timeLineRef.current = gsap.timeline({ paused: true })
            .to(boxRefTwo.current, { x: (containerWidth - 20) - boxWidth, duration: 1, ease: "power2.out" })
            .to(boxRefTwo.current, { rotation: 360, duration: 0.6, ease: "power1.inOut" }, "<")
            .to(boxRefTwo.current, { y: -40, duration: 0.4, ease: "power2.out" })
            .to(boxRefTwo.current, { y: 0, duration: 0.4, ease: "bounce.out" })
    }, { scope: containerRefTwo });

    const tlPlay = () => timeLineRef.current?.play();
    const tlPause = () => timeLineRef.current?.pause();
    const tlRestart = () => timeLineRef.current?.restart();
    const tlReset = () => timeLineRef.current?.seek(0).pause();
    const tlReverse = () => timeLineRef.current?.reverse();

    return (
        <div>
            <Container>
                <div className="bg-zinc-900 p-5 rounded-2xl">
                    <h1 className="text-3xl font-bold mb-5">Practice Tween</h1>
                    <p>
                        This is a practice page for tweening. You can use this page to practice your tweening skills and test out different animations.
                    </p>

                    <div ref={containerRef} className="bg-zinc-700 w-full p-2 rounded-lg mt-5">
                        <div ref={boxRef} className="bg-secondary size-10 rounded"></div>
                    </div>
                    <button onClick={play} className="bg-secondary text-black px-4 py-2 rounded mt-5">Play</button>
                    <button onClick={pause} className="bg-secondary text-black px-4 py-2 rounded mt-5 ml-2">Pause</button>
                    <button onClick={reverse} className="bg-secondary text-black px-4 py-2 rounded mt-5 ml-2">Reverse</button>
                    <button onClick={reset} className="bg-secondary text-black px-4 py-2 rounded mt-5 ml-2">Reset</button>
                    <button onClick={restart} className="bg-secondary text-black px-4 py-2 rounded mt-5 ml-2">Restart</button>

                    <div ref={containerRefTwo} className="bg-zinc-700 w-full p-2 rounded-lg mt-5">
                        <div ref={boxRefTwo} className="bg-secondary size-10 rounded"></div>
                    </div>

                    <button onClick={tlPlay} className="bg-secondary text-black px-4 py-2 rounded mt-5">Timeline Play</button>
                    <button onClick={tlPause} className="bg-secondary text-black px-4 py-2 rounded mt-5 ml-2">Timeline Pause</button>
                    <button onClick={tlReverse} className="bg-secondary text-black px-4 py-2 rounded mt-5 ml-2">Timeline Reverse</button>
                    <button onClick={tlReset} className="bg-secondary text-black px-4 py-2 rounded mt-5 ml-2">Timeline Reset</button>
                    <button onClick={tlRestart} className="bg-secondary text-black px-4 py-2 rounded mt-5 ml-2">Timeline Restart</button>
                </div>
            </Container>
        </div>
    );
};

export default PracticeTween;
