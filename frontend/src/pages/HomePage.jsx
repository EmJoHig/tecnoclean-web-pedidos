import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BannerTC from "../components/BannerTC";
import BannerBottomTC from "../components/BannerBottomTC";
import BestSellersTC from "../components/BestSellersTC";
import NewArrivalsTC from "../components/NewArrivalsTC";
import SaleTC from "../components/SaleTC";
import SpecialOffertsTC from "../components/SpecialOffertsTC";
import YearProductTC from "../components/YearProductTC";

import FooterTC from "../components/FooterTC";
import FooterBottomTC from "../components/FooterBottomTC";
import HeaderTC from "../components/HeaderTC";
import HeaderBottomTC from "../components/HeaderBottomTC";
import SpecialCaseTC from "../components/SpecialCaseTC";
import { ToastContainer } from "react-toastify";
import DiscountsBanner from "../components/DiscountsBanner";
import { useArticulos } from "../context/articulosContext";
import { setCheckedCategorys } from "../redux/orebiSlice";


const HomePage = () => {
    const { familias, GetFamilias } = useArticulos();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const familiasConDescuento = familias?.filter(
        (fam) => fam.descuento?.activo === true && fam.descuento?.porcentaje > 0
    );

    useEffect(() => {
        // Cargar familias al montar la home para mantener consistencia visual
        if (GetFamilias) GetFamilias();
    }, []);

    const handleVerProductosDescuento = (familia) => {
        if (!familia) return;

        dispatch(setCheckedCategorys([familia]));
        navigate("/shop");
    };

    return (

        <div className="w-full mx-auto bg-[#e00725]">
            <div className="relative">
                <BannerTC />
                <br/>
                <br/>
                <br/>
                <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden md:block">
                    <div className="max-w-container mx-auto px-4 pointer-events-auto">
                        <DiscountsBanner
                            familias={familiasConDescuento}
                            variant="overlay"
                            onViewProducts={handleVerProductosDescuento}
                        />
                    </div>
                </div>
            </div>
            <br/>
            <div className="md:hidden">
                <div className="max-w-container mx-auto px-4 pt-8 pb-6">
                    <DiscountsBanner
                        familias={familiasConDescuento}
                        variant="default"
                        onViewProducts={handleVerProductosDescuento}
                    />
                </div>
            </div>
            {/* <BannerBottomTC /> */}
            <div className="max-w-container mx-auto px-4">
                {/* <SaleTC /> */}
                {/* <NewArrivalsTC /> */}
                {/* <BestSellersTC /> */}
                {/* <YearProductTC /> */}
                {/* <SpecialOffertsTC /> */}
            </div>
        </div>

    );
};

export default HomePage;
