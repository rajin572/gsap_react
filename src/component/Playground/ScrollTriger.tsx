"use client";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const ScrollTriger = () => {

    const containerRef = React.useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const main = containerRef.current?.querySelector('.main') as HTMLDivElement;
        const boxs = containerRef.current?.querySelectorAll('.boxs') as NodeListOf<HTMLDivElement>;
        const box1 = containerRef.current?.querySelector('.box-1') as HTMLDivElement;
        const box2 = containerRef.current?.querySelector('.box-2') as HTMLDivElement;
        const box3 = containerRef.current?.querySelector('.box-3') as HTMLDivElement;

        const squre1 = containerRef.current?.querySelector('.squre-1') as HTMLDivElement;
        const squre2 = containerRef.current?.querySelector('.squre-2') as HTMLDivElement;

        gsap.to(boxs, {
            y: 100,
            duration: 1,
            stagger: {
                each: 0.8,
                from: 'center',
            },
            scrollTrigger: {
                trigger: main,
                markers: {
                    startColor: "white",
                    endColor: "red",
                    fontSize: "10px",
                    fontWeight: "bold",
                    indent: 0
                },
                start: "top 0%",
                end: "bottom 0%",
                scrub: true,
                pin: true,
                pinSpacing: false,
                // end: () => `+=${box2.offsetHeight}`,
                toggleActions: "play pause reverse reset",
            }
        })

        const tl = gsap.timeline({ repeat: -1 });
        tl.to(squre1, { x: 600, y: 0, duration: 1, ease: "power2.inOut" })
            .to(squre1, { x: 0, y: 500, duration: 1, ease: "power2.inOut" })
            .to(squre1, { y: 0, duration: 1, ease: "power2.inOut" });


    }, { scope: containerRef });

    return (
        <div ref={containerRef} className='bg-zinc-900 '>

            <div className="h-screen w-full mx-auto bg-sky-950 p-40">

                <div className='squre-1 bg-linear-to-tl from-emerald-700 to-emerald-600 w-20 h-20 '></div>

            </div>
            <div className="main h-screen w-full mx-auto bg-amber-900 flex justify-center">
                <div className='boxs box-1 bg-linear-to-tl from-red-800 to-red-600 w-20 h-20'></div>
                <div className='boxs box-2 bg-linear-to-tl from-blue-800 to-blue-600 w-20 h-20'></div>
                <div className='boxs box-3 bg-linear-to-tl from-green-800 to-green-600 w-20 h-20'></div>
                <div className='boxs box-4 bg-linear-to-tl from-yellow-800 to-yellow-600 w-20 h-20'></div>
                <div className='boxs box-5 bg-linear-to-tl from-white to-white/80 w-20 h-20'></div>
                <div className='boxs box-6 bg-linear-to-tl from-fuchsia-600 to-fuchsia-800 w-20 h-20'></div>
                <div className='boxs box-7 bg-linear-to-tl from-black to-black/80 w-20 h-20'></div>

            </div>
            <div className="h-screen w-full mx-auto">

            </div>

        </div>
    );
};

export default ScrollTriger;