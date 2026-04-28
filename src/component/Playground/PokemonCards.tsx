"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import React from "react";

gsap.registerPlugin(useGSAP);

interface PokemonData {
    img: string;
    name: string;
    desc: string;
    type: { label: string; color: string }[];
    borderColor: string;
    question: string;
}

const pokemons: PokemonData[] = [
    {
        img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
        name: "Bulbasaur",
        desc: "Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun's rays, the seed grows progressively larger.",
        type: [{ label: "Grass", color: "#9dcb58" }, { label: "Poison", color: "#b881c8" }],
        borderColor: "#9dcb58",
        question: "Who's",
    },
    {
        img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
        name: "Charmander",
        desc: "The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when Charmander is enjoying itself.",
        type: [{ label: "Fire", color: "#fb7d34" }],
        borderColor: "#fb7d34",
        question: "That",
    },
    {
        img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
        name: "Squirtle",
        desc: "Squirtle's shell is not merely used for protection. The shell's rounded shape and the grooves on its surface help minimize resistance in water.",
        type: [{ label: "Water", color: "#4993c2" }],
        borderColor: "#4993c2",
        question: "Pokémon?",
    },
];

const PokemonCards = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const tlsRef = React.useRef<gsap.core.Timeline[]>([]);

    useGSAP(() => {
        // gsap.utils.toArray<HTMLElement>(".information", containerRef.current).forEach((el) => gsap.set(el, { yPercent: 100 }));

        gsap.utils.toArray<HTMLElement>(".pokemon-card", containerRef.current).forEach((card, i) => {
            const info = card.querySelector<HTMLElement>(".information");
            const cover = card.querySelector<HTMLElement>(".cover");

            gsap.set(info, { yPercent: 100 });

            tlsRef.current[i] = gsap.timeline({ paused: true })
                .to(info, { yPercent: 0 })
                .to(cover, { opacity: 0 }, 0);
        });
    }, { scope: containerRef });

    const handleMouseEnter = (i: number) => tlsRef.current[i]?.timeScale(1).play();
    const handleMouseLeave = (i: number) => tlsRef.current[i]?.timeScale(3).reverse();

    return (
        <div ref={containerRef} className="flex flex-wrap justify-center items-center gap-6 min-h-screen p-8">
            {pokemons.map((pokemon, index) => (
                <div key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)} className="pokemon-card flex flex-col items-center w-52">
                    {/* Silhouette */}
                    <div className="relative w-24 h-24">
                        <Image src={pokemon.img} alt={pokemon.name} fill className="object-contain" />
                        <div className="cover absolute inset-0">
                            <Image src={pokemon.img} alt="silhouette" fill className="object-contain brightness-100000" />
                        </div>
                    </div>

                    {/* Card */}
                    <div className="relative w-full rounded-xl overflow-hidden bg-white/20 shadow-lg text-center cursor-pointer h-75">
                        {/* Question text */}
                        <div className="flex items-center justify-center h-full">
                            <h1 className="font-bold text-4xl tracking-widest" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                                {pokemon.question}
                            </h1>
                        </div>

                        {/* Info panel */}
                        <div
                            className="information absolute inset-0 bg-zinc-800 flex flex-col items-center justify-center gap-3 p-4 z-10"
                            style={{ borderTop: `10px solid ${pokemon.borderColor}`, borderBottom: `10px solid ${pokemon.borderColor}` }}
                        >
                            <h2
                                className="text-lg font-bold w-full text-center pb-2"
                                style={{ borderBottom: `dashed 2px ${pokemon.borderColor}` }}
                            >
                                {pokemon.name}
                            </h2>
                            <p className="text-xs text-gray-700 px-2">{pokemon.desc}</p>
                            <div className="flex gap-2 flex-wrap justify-center">
                                {pokemon.type.map((t, i) => (
                                    <span
                                        key={i}
                                        className="text-xs text-white px-3 py-1 rounded-lg"
                                        style={{ backgroundColor: t.color }}
                                    >
                                        {t.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <p className="w-full text-center text-xl text-gray-400 mt-4">Hover over a card to find out!</p>
        </div>
    );
};

export default PokemonCards;
