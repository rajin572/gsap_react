"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AllImages } from "../../../public/assets/AllImages";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Cookies from "js-cookie";
import { LuLanguages } from "react-icons/lu";
import Container from "../ui/Container";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";

gsap.registerPlugin(useGSAP);

const Navbar = () => {
    const path = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [height, setHeight] = useState(0);
    const navbarRef = useRef<HTMLDivElement>(null);
    const navWrapperRef = useRef<HTMLDivElement>(null);

    const NavItems = [
        { id: "1", name: "Home", route: "/" },
        { id: "2", name: "How to Use", route: "#how-to-use" },
        { id: "3", name: "Pricing", route: "#pricing" },
    ];

    const isDashboard = path.includes("dashboard");

    // Hide/show navbar on scroll
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setScrolled(currentScrollY > 10);

            if (
                currentScrollY > lastScrollY &&
                currentScrollY > 150 &&
                !isDashboard &&
                !mobileMenuOpen
            ) {
                setHidden(true);
            } else {
                setHidden(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isDashboard, mobileMenuOpen]);

    // GSAP hide/show animation
    useGSAP(
        () => {
            gsap.to(navWrapperRef.current, {
                y: hidden ? "-120%" : "0%",
                duration: 0.3,
                ease: "power2.inOut",
            });
        },
        { scope: navWrapperRef, dependencies: [hidden] }
    );

    // Mobile menu height animation
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (mobileMenuOpen) {
            // measure after the element has been rendered
            timer = setTimeout(() => {
                setHeight(navbarRef.current?.scrollHeight ?? 0);
            }, 0);
        } else {
            // schedule the collapse instead of doing it synchronously
            timer = setTimeout(() => {
                setHeight(0);
            }, 0);
        }

        return () => clearTimeout(timer);
    }, [mobileMenuOpen]);

    const changeLanguage = (lng: string) => {
        Cookies.set("dealrLang", lng);
        window.location.reload();
    };

    const languageItems = [
        { key: "en", label: "English", onClick: () => changeLanguage("en") },
        { key: "de", label: "Deutsch", onClick: () => changeLanguage("de") },
    ];

    return (
        <div
            ref={navWrapperRef}
            className={`z-99999! bg-foreground py-2 text-background ${scrolled ? "z-99999! duration-300" : "duration-300"}`}
        >
            <Container>
                <header className="text-base flex justify-between items-center z-99999 ">

                    {/* Logo */}
                    <div>
                        <Link href="/" className="cursor-pointer flex justify-center items-end gap-1">
                            <Image
                                src={AllImages.logo}
                                alt="logo"
                                width={1000}
                                height={1000}
                                sizes="100vw"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Nav links */}
                    <nav>
                        {/* Desktop */}
                        <div className="hidden lg:block">
                            <ul className="flex justify-center items-center gap-8">
                                {NavItems.map((navItem, i) => (
                                    <li
                                        key={i}
                                        className={`cursor-pointer text-lg hover:text-[#185dde] transition-colors duration-300 ${path === navItem.route
                                            ? "text-[#185dde] font-bold underline underline-offset-4"
                                            : ""
                                            }`}
                                    >
                                        <Link href={navItem.route}>{navItem.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mobile */}
                        <div
                            style={{ height: `${height}px`, overflow: "hidden", transition: "height 0.3s ease" }}
                            ref={navbarRef}
                            className="block lg:hidden bg-[#FEFEFE] w-full absolute -top-2 left-0 shadow-md -z-9999"
                        >
                            <ul className="flex justify-end items-center gap-5 flex-col py-5 mt-16">
                                {NavItems.map((navItem, i) => (
                                    <li
                                        key={i}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`cursor-pointer hover:text-[#185dde] transition-colors duration-300 ${path === navItem.route
                                            ? "text-[#185dde] font-bold underline underline-offset-4"
                                            : ""
                                            }`}
                                    >
                                        <Link href={navItem.route}>{navItem.name}</Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        onClick={() => setMobileMenuOpen(false)}
                                        href="/become-a-dealer"
                                        className="px-4 py-1.5 rounded-full border-2 border-[#185dde] bg-[#185dde] text-white text-sm"
                                    >
                                        Become a Dealer
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Desktop right actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/become-a-dealer"
                            className="px-4 py-1.5 rounded-full border-2 border-[#185dde] bg-[#185dde] text-white text-sm hover:bg-[#1450c0] transition-colors duration-200"
                        >
                            Become a Dealer
                        </Link>

                        <Dropdown items={languageItems} trigger="click" placement="bottomRight">
                            <Button variant="outline" size="sm" className="border-gray-300 rounded-full p-1.5">
                                <LuLanguages className="text-xl text-[#185dde]" />
                            </Button>
                        </Dropdown>
                    </div>

                    {/* Mobile icons */}
                    <div className="lg:hidden select-none flex items-center gap-3">
                        <Dropdown items={languageItems} trigger="click" placement="bottomRight">
                            <Button variant="ghost" size="sm" className="p-1">
                                <LuLanguages className="text-xl text-[#185dde]" />
                            </Button>
                        </Dropdown>

                        <button
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#185dde" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#185dde" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>

                </header>
            </Container>
        </div>
    );
};

export default Navbar;