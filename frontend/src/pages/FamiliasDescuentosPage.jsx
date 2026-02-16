import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderBottomTC from "../components/HeaderBottomTC";
import BreadcrumbsTC from "../components/shop/BreadcrumbsTC";
import PaginationTC from "../components/shop/PaginationTC";
import ProductBannerTC from "../components/shop/ProductBannerTC";
import ShopSideNavTC from "../components/shop/ShopSideNavTC";
import { filterArticulos } from "../redux/orebiSlice";
import { useArticulos } from "../context/articulosContext";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import FamiliasDescuentosTable from "../components/familias/FamiliasDescuentosTable";

const FamiliasDescuentosPage = () => {

    const dispatch = useDispatch();

    const { familias, GetFamilias } = useArticulos();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        GetFamilias();
    }, []);

    return (
        <>
            <HeaderBottomTC />
            <div className="max-w-container mx-auto px-4">
                <h1 className="text-2xl font-bold my-6">
                    Descuentos por Familia
                </h1>

                <FamiliasDescuentosTable familias={familias} />
            </div>
        </>
    );
};

export default FamiliasDescuentosPage;
