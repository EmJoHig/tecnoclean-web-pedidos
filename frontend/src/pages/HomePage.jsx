import React from "react";
import BannerTC from "../components/BannerTC";
import PromotionCard from "../components/PromotionCard";

const HomePage = () => {
    const promotions = [
        {
            id: 1,
            title: "Pack Limpieza Profunda",
            description: "3 productos seleccionados para una limpieza profunda del hogar.",
            image: "https://source.unsplash.com/collection/190727/800x600",
            discount: 20,
            cta: "Comprar Pack",
        },
        {
            id: 2,
            title: "Descuento en Fragancias",
            description: "Lleva 2 y obtén 1 gratis en todas las fragancias seleccionadas.",
            image: "https://source.unsplash.com/collection/895539/800x600",
            discount: 30,
            cta: "Ver fragancias",
        },
        {
            id: 3,
            title: "Oferta Especial: Gel y Jabón",
            description: "Combo higiene con envío gratis por tiempo limitado.",
            image: "https://source.unsplash.com/collection/139386/800x600",
            discount: 15,
            cta: "Aprovechar",
        },
    ];

    return (
        <div className="w-full mx-auto">
            <BannerTC />

            <section className="bg-gray-50 py-10">
                <div className="max-w-container mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Promociones</h2>
                            <p className="text-gray-600 text-sm">Ofertas vigentes y paquetes recomendados.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promotions.map((p) => (
                            <PromotionCard key={p.id} promo={p} />
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-container mx-auto px-4">
                {/* se mantienen otras secciones pero ocultas aquí; se pueden activar si se desea */}
            </div>
        </div>
    );
};

export default HomePage;
