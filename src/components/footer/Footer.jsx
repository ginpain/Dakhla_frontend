"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                    <Link href="/" legacyBehavior>
                        <a className="flex justify-center md:justify-start items-center">
                            <Image src={logo} alt="Logo" width={80} height={30} />
                        </a>
                    </Link>
                    <p className="text-sm mt-4 max-w-xs">
                        Cartographie est un outil fiable d'aide à la décision qui fournit les services logiciels les plus précis en matière de planification, d'analyse et de prévision des ressources solaires au Maroc et en Afrique.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row text-center md:text-left">
                    <div className="mb-6 md:mb-0 md:mr-8">
                        <h2 className="font-semibold text-lg mb-2">NOUS CONTACTER</h2>
                        <p className="flex items-center justify-center md:justify-start">
                            <i className="fas fa-phone mr-2"></i> +212 (0) 537 68 22 36
                        </p>
                        <p className="flex items-center justify-center md:justify-start">
                            <i href="mailto:contact@greenenergypark.ma" className="fas fa-envelope mr-2"></i> contact@greenenergypark.ma
                        </p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg mb-2">LIENS</h2>
                        <a href="http://www.greenenergypark.ma" className="block text-white hover:text-gray-400">www.greenenergypark.ma</a>
                        <a href="http://www.iresen.org" className="block text-white hover:text-gray-400">www.iresen.org</a>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-4 text-center">
            <div className="flex justify-center space-x-4">
                    <a href="https://web.facebook.com/greenenergyparkmaroc" className="text-white">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.instagram.com/greenenergypark/" className="text-white">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://x.com/GepMaroc" className="text-white">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/green-energy-park/" className="text-white">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    </div>
                <p className="text-sm text-gray-400">© 2024 Green Energy Park. All rights reserved. Created with Love by SIGGT Interns</p>
            </div>
        </footer>
    );
}
