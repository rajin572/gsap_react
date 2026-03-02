/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import ProjectGridScaleAnimation from './ProjectGridScaleAnimation';
import { useEffect, useRef } from 'react';

const ProjectsHomePage = () => {

    const lenisRef = useRef<any>(null);

    useEffect(() => {
        function update(time: any) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => gsap.ticker.remove(update);
    }, []);

    return (
        <>
            <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
            <div className="h-screen relative w-full flex items-center justify-center overflow-hidden">Intro</div>
            <ProjectGridScaleAnimation />
            <div className="h-screen relative w-full flex items-center justify-center overflow-hidden">Outro</div>
        </>
    );
};

export default ProjectsHomePage;