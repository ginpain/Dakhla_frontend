"use client";
import styles from "./globals.css";
import { useState, useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from 'framer-motion';
import BgImage from '@/assets/wind.jpg';
import CalibrationIcon from '@/assets/1.svg';
import PredictionIcon from '@/assets/2.svg';
import PhotovoltaicIcon from '@/assets/3.svg';
import MeteorologicalIcon from '@/assets/4.svg';
import TimeSeriesIcon from '@/assets/5.svg';
import BackgroundImage from "@/assets/contact-image.jpg";
import Back1 from "@/assets/GP1.png";
import Back2 from "@/assets/GP2.png";
import { Navbar } from "@/components/navbar/Navbar";
export default function Home() {
    const images = [
        { src: Back2, alt: 'Background Image 1', opacity: 1 },
        { src: Back1, alt: 'Background Image 2', opacity: 1 },
        { src: BackgroundImage, alt: 'Background Image 3', opacity: 1 }
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('my-app/my-app/src/app/API/sendEmail.jsx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('Email sent successfully!');
            } else {
                setStatus('Failed to send email.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('An error occurred while sending the email.');
        }
    };

    useEffect(() => {
        const button = document.getElementById('discover-now-btn');
        const productSection = document.getElementById('product-section');

        const handleScroll = () => {
            productSection.scrollIntoView({ behavior: 'smooth' });
        };

        button.addEventListener('click', handleScroll);

        return () => {
            button.removeEventListener('click', handleScroll);
        };
    }, []);

    return (
        
        <div className="min-h-screen bg-[#ffffff] font-sans">
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>
            {/* Hero Section */}
            <section className="relative flex justify-center items-center" style={{ height: "calc(100vh - 4rem)" }}>
                <video
                    src="/hero-video.mp4"
                    autoPlay
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <motion.div 
                    className="relative z-10 text-center text-white"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">ÉVALUATION FIABLE DU POTENTIEL SOLAIRE ET ÉOLIEN À DAKHLA-OUED ED-DAHAB</h1>
                    <button 
                        id="discover-now-btn"
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
                        whileHover={{ scale: 1.1 }}>
                        DÉCOUVRIR MAINTENANT
                    </button>
                </motion.div>
            </section>
            
            {/* Products Section */}
            <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50" id="product-section">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="inline-block px-6 py-3 text-2xl font-bold text-gray-800 bg-white rounded-lg shadow-md border border-blue-200">
                            NOS PRODUITS
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "CARTOGRAPHIE SOLAIRE",
                                description: "Des cartes solaires interactives à haute résolution (rayonnement direct, diffus, globale...) permettant l'aide des décideurs et des chercheurs à identifier les zones à fort potentiel pour chaque endroit au Maroc et en Afrique.",
                                color: "blue",
                                icon: "☀️",
                                href: "/map"
                            },
                            {
                                title: "CARTOGRAPHIE ÉOLIENNE",
                                description: "Des cartes interactives de haute résolution des vents terrestres, avec différentes élévations, permettant l'aide des décideurs et des investisseurs à effectuer des calculs préliminaires pour chaque emplacement au Maroc et en Afrique.",
                                color: "green",
                                icon: "💨",
                                href: "/map"
                            },
                            {
                                title: "CADASTRE SOLAIRE",
                                description: "Un outil adapté aux installations photovoltaïques en toiture permettant de déterminer les meilleurs emplacements pour les panneaux solaires, et le dimensionnement préliminaire de vos installations solaires.",
                                color: "yellow",
                                icon: "🏠",
                                href: "http://cartographie.ma/"
                            }
                        ].map((product, index) => (
                            <motion.div 
                                key={index}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                                whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)' }}
                                style={{
                                    '--color': `var(--${product.color})`
                                }}
                            >
                                <div className="h-1 bg-[var(--color)]"></div>
                                <div className="p-6">
                                    <div className="text-3xl mb-3">{product.icon}</div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{product.title}</h3>
                                    <p className="text-gray-600 mb-6 h-36 text-sm">{product.description}</p>
                                    <Link href={product.href}>
                                        <button 
                                            className="w-full px-4 py-2 text-white rounded-md shadow-sm transition-all text-sm font-medium"
                                            style={{
                                                backgroundColor: 'var(--color)',
                                                ':hover': {
                                                    backgroundColor: 'color-mix(in srgb, var(--color) 80%, black)'
                                                }
                                            }}
                                        >
                                            DÉCOUVRIR MAINTENANT
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="relative flex justify-center items-center" style={{ height: "calc(100vh - 4rem)" }}>
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        className="absolute inset-0 z-0"
                        initial={{ opacity: image.opacity }}
                        animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            layout="fill"
                            objectFit="cover"
                            className={`opacity-${Math.round(image.opacity * 100)}`}
                        />
                    </motion.div>
                ))}
                <motion.div
                    className="relative z-10 text-center text-white p-8 bg-black bg-opacity-30 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="text-3xl font-bold mb-4">PRÉDIR LA RESSOURCE POUR MIEUX RÉUSSIR VOS PROJETS RENOUVELABLES</h2>
                    <p className="text-lg">
                        Les utilisateurs de Cartographie ont pu, grâce à nos outils, évaluer les potentialités de leurs emplacements respectifs pour mieux appréhender les risques, prédire les bénéfices et ainsi réussir de façon optimale leurs projets renouvelables.
                    </p>
                </motion.div>
            </section>

            {/* Services Section */}
            <section className="container mx-auto p-8 text-center bg-[#FFF9F4] relative">
                <Image 
                    src={BgImage} 
                    alt="Background Image" 
                    layout="fill" 
                    objectFit="cover" 
                    className="z-0"
                />
                <motion.h2 
                    className="relative z-10 text-3xl font-bold text-[#333] mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    NOS SERVICES
                </motion.h2>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.div 
                        className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Image src={CalibrationIcon} alt="Calibration Icon" width={50} height={50} className="mb-4" />
                        <h3 className="text-2xl font-bold mb-4 text-[#333]">Étalonnage solaire</h3>
                        <p className="text-[#666] mb-4">
                            Nous étalonnons avec précision les équipements solaires pour garantir des performances et une fiabilité optimales dans les projets d’énergie solaire.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Image src={PredictionIcon} alt="Prediction Icon" width={50} height={50} className="mb-4" />
                        <h3 className="text-2xl font-bold mb-4 text-[#333]">Prédiction solaire</h3>
                        <p className="text-[#666] mb-4">
                            Services avancés de prévision solaire pour vous aider à planifier et optimiser votre production et votre consommation d’énergie.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Image src={PhotovoltaicIcon} alt="Photovoltaic Icon" width={50} height={50} className="mb-4" />
                        <h3 className="text-2xl font-bold mb-4 text-[#333]">Étude Photovoltaïque</h3>
                        <p className="text-[#666] mb-4">
                            Des études photovoltaïques complètes pour évaluer la faisabilité et le potentiel des installations solaires sur votre site.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Image src={MeteorologicalIcon} alt="Meteorological Icon" width={50} height={50} className="mb-4" />
                        <h3 className="text-2xl font-bold mb-4 text-[#333]">Année météorologique typique</h3>
                        <p className="text-[#666] mb-4">
                            Fournir des données météorologiques typiques sur l'année pour soutenir la simulation énergétique et l'évaluation des performances des projets solaires.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Image src={TimeSeriesIcon} alt="Time Series Icon" width={50} height={50} className="mb-4" />
                        <h3 className="text-2xl font-bold mb-4 text-[#333]">Séries Temporelles</h3>
                        <p className="text-[#666] mb-4">
                            Proposer une analyse de données de séries chronologiques pour surveiller et prédire les tendances et les variations de la production d'énergie solaire.
                        </p>
                    </motion.div>
                </div>
            </section>
            
            {/* Contact Section */}
            <section id="contact" className="container mx-auto p-4 text-center relative">
                <div className="flex flex-col md:flex-row justify-between items-start p-8 rounded-lg" style={{ background: 'linear-gradient(to bottom, #2563eb 40%, white 30%)' }}>
                    <div className="md:w-1/2 text-left mb-8 md:mb-0 p-4 mt-4">
                        <h2 className="text-3xl font-bold mb-4 text-white">NOUS CONTACTER</h2>
                        <p className="mb-8 text-white">
                            BESOIN DE SOUTIEN ? NOUS SERONS TOUJOURS À L'ÉCOUTE DE NOS UTILISATEURS POUR VOUS SERVIR AU MIEUX
                        </p>
                        <div className="space-y-8 mt-40">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <i className="fas fa-phone-alt text-gray-700"></i>
                                    <p className="text-gray-700">+212 (0) 537 68 22 36</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <i className="fas fa-envelope text-gray-700"></i>
                                    <p className="text-gray-700">
                                        <a href="mailto:contact@greenenergypark.ma" className="text-gray-700 hover:underline">contact@greenenergypark.ma</a> / 
                                        <a href="mailto:contact@iresen.org" className="text-gray-700 hover:underline"> contact@iresen.org</a>
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <i className="fas fa-map-marker-alt text-gray-700"></i>
                                    <p className="text-gray-700">
                                        <a href="https://www.google.com/maps/search/?api=1&query=Green+Energy+Park+Route+Régionale+R206+Benguerir,+Maroc" target="_blank" className="text-gray-700 hover:underline">Green Energy Park Route Régionale R206 Benguerir, Maroc</a>
                                    </p>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="flex justify-center space-x-4">
                                <a href="https://web.facebook.com/greenenergyparkmaroc" className="text-gray-700">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://www.instagram.com/greenenergypark/" className="text-gray-700">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://x.com/GepMaroc" className="text-gray-700">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://www.linkedin.com/company/green-energy-park/" className="text-gray-700">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-2/5 bg-white p-10 rounded-lg shadow-lg mt-8 md:mt-0">
                        <h3 className="text-2xl font-bold mb-4 text-blue-600">Envoie-nous un message</h3>
                        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-lg"
                            />
                            <textarea
                                name="message"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="submit"
                                className="p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Soumettre
                            </button>
                        </form>
                        {status && <p className="mt-4 text-blue-600">{status}</p>}
                    </div>
                </div>
            </section>

            <hr></hr>
        </div>
    );
}
