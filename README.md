"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const CircularBadge = () => {
const svgRef = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        gsap.to(svgRef.current, {
            rotation: 360,
            duration: 20,
            ease: "none",
            repeat: -1,
            transformOrigin: "center center",
        });
    });

    // Circle radius for text path
    const r = 62;
    // Circumference = 2π × r ≈ 389.6px
    const circumference = Math.round(2 * Math.PI * r);

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="relative" style={{ width: 160, height: 160 }}>

                {/* Rotating SVG ring */}
                <svg ref={svgRef} viewBox="0 0 160 160" width="160" height="160">
                    <defs>
                        {/* Full clockwise circle starting at 12 o'clock */}
                        <path
                            id="badge-ring"
                            d={`M80,${80 - r} a${r},${r} 0 1,1 0,${r * 2} a${r},${r} 0 1,1 0,-${r * 2}`}
                        />
                    </defs>

                    {/* Dark background */}
                    <circle cx="80" cy="80" r="78" fill="rgba(20,20,24,0.92)" />

                    {/* Subtle lime border */}
                    <circle cx="80" cy="80" r="77" fill="none" stroke="rgba(200,245,60,0.25)" strokeWidth="1" />

                    {/* Text — textLength forces exact fill of circumference, no overflow */}
                    <text fill="#c8f53c" fontSize="10" fontWeight="700" letterSpacing="20px" fontFamily="monospace">
                        <textPath href="#badge-ring" textLength={circumference} lengthAdjust="spacing">
                            GET EDITED NOW • START YOUR FREE TRIAL •
                        </textPath>
                    </text>
                    <circle cx="80" cy="80" r="50" fill="none" stroke="rgba(200,245,60,0.25)" strokeWidth="1" />

                </svg>

                {/* Glowing center dot — stays fixed while ring rotates */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="size-12 rounded-full flex items-center justify-center text-black font-bold text-lg"
                        style={{
                            backgroundColor: "#c8f53c",
                            // boxShadow: "0 0 20px 8px #c8f53c99, 0 0 60px 20px #c8f53c44",
                        }}
                    >
                        →
                    </div>
                </div>

            </div>
        </div>
    );

};

export default CircularBadge;
