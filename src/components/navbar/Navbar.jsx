"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import logo from "@/assets/logo.png";

export const Navbar = ({ activateLayerFromNavbar }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="py-4 relative bg-gradient-to-b from-blue-50 via-yellow-50 to-green-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" legacyBehavior>
                    <a className="flex items-center">
                        <Image src={logo} alt="Logo" width={100} height={100} className="h-auto" />
                    </a>
                </Link>
                <div className="md:hidden">
                    <button
                        className="text-gray-700 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 hover:bg-gray-100">Accueil</a>
                    </Link>
                    <div className="relative group">
                        <button className="block px-4 py-2 hover:bg-gray-100">Cartes</button>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 hidden group-hover:block">
                            <Link href="/map" legacyBehavior>
                                <a className="block px-4 py-2 hover:bg-gray-100" onClick={() => activateLayerFromNavbar('GHI_DOA')}>Solaire</a>
                            </Link>
                            <Link href="/map" legacyBehavior>
                                <a className="block px-4 py-2 hover:bg-gray-100" onClick={() => activateLayerFromNavbar('WS10m_DOA')}>Éolienne</a>
                            </Link>
                            <Link href="http://cartographie.ma/" legacyBehavior>
                                <a className="block px-4 py-2 hover:bg-gray-100">Cadastre Solaire</a>
                            </Link>
                        </div>
                    </div>
                    <Link href="/about" legacyBehavior>
                        <a className="block px-4 py-2 hover:bg-gray-100">À propos</a>
                    </Link>
                    <Link href="/chatbot" legacyBehavior>
                        <a className="block px-4 py-2 hover:bg-gray-100">chatbot</a>
                    </Link>
                    <Link href="/#contact" legacyBehavior>
                        <a className="block px-4 py-2 hover:bg-gray-100">Contact</a>
                    </Link>
                    <Link href="/FAQ" legacyBehavior>
                        <a className="block px-4 py-2 hover:bg-gray-100">FAQ</a>
                    </Link>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 w-64 bg-white h-full shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 md:hidden z-50`}>
                <div className="flex justify-end p-4">
                    <button
                        className="text-gray-700 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col items-start p-4 space-y-4">
                    <Link href="/" legacyBehavior>
                        <a className="nav-link py-2 px-4 block w-full" onClick={closeMenu}>Accueil</a>
                    </Link>
                    <div className="w-full">
                        <button className="nav-link py-2 px-4 block w-full text-left" onClick={() => setIsMenuOpen(false)}>Cartes</button>
                        <div className="pl-4 mt-2 space-y-2">
                            <Link href="/map" legacyBehavior>
                                <a className="block py-2 hover:bg-gray-100" onClick={() => { activateLayerFromNavbar('GHI_DOA'); closeMenu(); }}>Solaire</a>
                            </Link>
                            <Link href="/map" legacyBehavior>
                                <a className="block py-2 hover:bg-gray-100" onClick={() => { activateLayerFromNavbar('WS10m_DOA'); closeMenu(); }}>Éolienne</a>
                            </Link>
                            <Link href="http://cartographie.ma/" legacyBehavior>
                                <a className="block py-2 hover:bg-gray-100" onClick={closeMenu}>Cadastre Solaire</a>
                            </Link>
                        </div>
                    </div>
                    <Link href="/about" legacyBehavior>
                        <a className="nav-link py-2 px-4 block w-full" onClick={closeMenu}>À propos</a>
                    </Link>
                    <Link href="/chatbot" legacyBehavior>
                        <a className="nav-link py-2 px-4 block w-full" onClick={closeMenu}>chatbot</a>
                    </Link>
                    <Link href="/#contact" legacyBehavior>
                        <a className="nav-link py-2 px-4 block w-full" onClick={closeMenu}>Contact</a>
                    </Link>
                    <Link href="/FAQ" legacyBehavior>
                        <a className="nav-link py-2 px-4 block w-full" onClick={closeMenu}>FAQ</a>
                    </Link>
                </div>
            </div>
        </nav>
    );
};