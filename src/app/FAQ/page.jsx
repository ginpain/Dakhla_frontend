"use client";
import {Navbar} from "@/components/navbar/Navbar"
import { useState } from 'react';
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <button
        className="flex justify-between w-full text-left text-purple-600 font-medium focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
};

const ContactPage = () => {
  const faqs = [
    {
      question: "QUELLE EST LA DIFFÉRENCE ENTRE DNI, DIF ET GHI ?",
      answer: "Le terme irradiance solaire représente la puissance du soleil qui atteint une surface par unité de surface. L'irradiance directe est la partie de l'irradiance solaire qui atteint directement une surface ; l'irradiance diffuse est la partie qui est diffusée par l'atmosphère ; l'irradiance globale est la somme des composantes diffuse et directe atteignant la même surface.\nD'autre part, le terme irradiation solaire représente la somme d'énergie par unité de surface reçue du soleil sur une période spécifique. Dans la CARTOGRAPHIE, nous fournissons trois magnitudes liées à l'irradiation solaire :\nGHI, globale horizontale irradiation\nDNI, directe normale irradiation\nDHI, diffuse horizontale irradiation\nGHI et DIF se réfèrent à une surface horizontale au sol, tandis que DNI se réfère à une surface perpendiculaire au Soleil. Des valeurs plus élevées du rapport DIF / GHI représentent une occurrence plus élevée de nuages, une pollution atmosphérique plus élevée ou une teneur en vapeur d'eau plus élevée."
    },
    {
      question: "QUEL TYPE DE MODULES EST UTILISÉ DANS LA SIMULATION ÉNERGÉTIQUE (PV PT) ?",
      answer: "La simulation effectuée dans la CARTOGRAPHIE considère des modules génériques en silicium cristallin (c-Si). La réponse de ce module générique est basée sur un test effectué sur un certain nombre de modules de différents fabricants ; La technologie c-Si est actuellement la technologie la plus courante sur le marché du solaire photovoltaïque."
    },
    {
      question: "COMMENT ET À QUI LES DONNÉES SIG SONT-ELLES UTILES ?",
      answer: "Les SIG (Systèmes d'Information Géographique) permettent de capturer et d'analyser des données spatiales et géographiques. Il est recommandé d'utiliser les données SIG pour la visualisation, le traitement ultérieur et la géo-analyse dans tous les logiciels SIG traditionnels dotés de capacités de traitement de données raster (par exemple, QGIS open source, produits commerciaux ESRI ArcGIS et autres) ou d'implémentation numérique (par exemple, avec Python, R , ou d'autres bibliothèques orientées tableau).\nLes données SIG sont utiles non seulement pour les experts et les professionnels des sciences SIG, mais aussi pour les analystes et les passionnés travaillant avec des données spatiales, les chercheurs et les étudiants. Cependant, une certaine compréhension de base du SIG et du traitement des données raster est recommandée."
    },
    {
      question: "QU'EST-CE QUE LE CADASTRE SOLAIRE MAROC ?",
      answer: "Le Cadastre Solaire est un outil open source, basé sur une carte interactive en ligne, donnant le potentiel solaire des toitures des bâtiments ainsi que l'investissement estimé nécessaire."
    },
    {
      question: "COMMENT FONCTIONNE LE CADASTRE SOLAIRE ?",
      answer: "L'outil utilise des données photogrammétriques pour créer un modèle tridimensionnel de l'ensemble de la topologie urbaine. Ce modèle est ensuite analysé pour l'accès solaire en tenant compte de la forme du toit, de son orientation, et de son élévation."
    },
    {
      question: "LE CADASTRE SOLAIRE CONSIDÈRE-T-IL L’OMBRAGE ?",
      answer: "Oui. Le Cadastre Solaire prend en compte l'ombrage de tous les bâtiments, des structures environnantes et des reliefs proches et lointains."
    },
    {
      question: "LE CADASTRE SOLAIRE REMPLACE-T-IL UNE ÉVALUATION SUR SITE ?",
      answer: "Le Cadastre Solaire est un outil d'évaluation à distance. Cependant, il ne remplace pas une évaluation sur place effectuée par un professionnel certifié."
    },
    {
      question: "QUELS SONT LES PRINCIPAUX FACTEURS QUI PEUVENT ENTRAÎNER DES ÉCARTS DE PRÉDICTION OU DES DONNÉES MANQUANTES ?",
      answer: "Les résultats du système solaire peuvent être indisponibles ou inexacts en raison de problèmes tels que l'obsolescence partielle de l'échantillon, un excès de végétation ou des obstructions non modélisées, des bases de données incomplètes ou corrompues, des couches SIG incomplètes ou corrompues, et des obstructions partielles indétectables basées sur la résolution de l'enquête, entre autres."
    },
  ];

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 bg-white shadow-md rounded-md flex flex-col md:flex-row items-start">
      <div className="w-full md:w-1/2 p-4">
        <img src="https://iresen.org/wp-content/themes/labostica/images/recherche/cen-3.png" alt="FAQ Image" className="rounded-lg shadow-lg space-x-100" />
        <br/>
        <img src="https://iresen.org/wp-content/themes/labostica/images/recherche/cen-4.png" alt="FAQ Image" className="rounded-lg shadow-lg space-x-40" />
      </div>
      
      <div className="w-full md:w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900"></h1>
        <div className="text-sm text-purple-600 mb-4">faqs</div>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default ContactPage;
