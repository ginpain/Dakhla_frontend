import {Navbar} from "@/components/navbar/Navbar"
export default function AboutPage() {
    return (
        <section class="py-24 relative bg-gradient-to-b from-blue-300 via-yellow-300 to-yellow-600">
            <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
        <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
            <div class="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
            <div>
                        <h6 className="text-gray-400 text-base">À PROPOS</h6>
                        <h2 className="text-indigo-700 text-4xl font-bold">Nos Initiatives Énergétiques</h2>
                        <p className="text-gray-500 text-base">
                            Dans le contexte actuel de l’intérêt marqué pour l’utilisation des ressources énergétiques renouvelables, le territoire Marocain et Africain constituent un gisement très important encore sous-exploité par manque d’information.
                        </p>
                        <p className="text-gray-500 text-base">
                            En effet, les surfaces exploitables offrent un potentiel remarquable pour la valorisation des énergies renouvelables.
                        </p>
                        <p className="text-gray-500 text-base">
                            L’IRESEN à travers sa plateforme technologique Green Energy Park, ont développé CARTOGRAPHIE qui a été mis à disposition pour le royaume du Maroc et pour l’Afrique sous format d’application web. Il permet d’évaluer de façon systématique le potentiel solaire, éolien et cadastrale de l’ensemble des territoires.
                        </p>
                        <p className="text-gray-500 text-base">
                            CARTOGRAPHIE se base sur les données météorologiques et satellitaires. Ainsi, tout utilisateur aura une meilleure vision en termes de soutien pour l’identification des zones à fort potentiel pour chaque endroit au Maroc et en Afrique au profit des décideurs, investisseurs, et chercheurs.
                        </p>
                        <p className="text-gray-500 text-base">
                            L'objectif principal de CARTOGRAPHIE est de fournir un accès rapide et aisé aux données sur les ressources renouvelables et le potentiel d'énergie photovoltaïque et éolien à l'échelle Marocaine et Africaine, en un clic de souris.
                        </p>
                        <p className="text-gray-500 text-base">
                            CARTOGRAPHIE est un outil d’aide à la décision destiné aux administrations publiques, aux entreprises et aux particuliers, redéfinissant la valeur d’une parcelle de terrain par rapport au potentiel solaire qu’elle peut fournir. C’est également un outil de communication pour les Collectivités, avec des rendus attractifs et pédagogiques.
                        </p>
                    </div>
                <div class="w-full lg:justify-start justify-center items-start flex">
                    <div class="sm:w-[564px] w-full sm:h-[646px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                        <img class="sm:mt-5 sm:ml-5 w-full h-full" src="https://media.istockphoto.com/id/1356540431/photo/wind-turbines-and-solar-panels-closeup-on-sky-background.jpg?s=612x612&w=0&k=20&c=Sz7LdYfgbcgEcdvRFPz_j-rEybzf9hzc-TsQ_iU_TXQ=" alt="about Us image" />
                    </div>
                </div>
            </div>
        </div>
    </section>
                                            
    );
}