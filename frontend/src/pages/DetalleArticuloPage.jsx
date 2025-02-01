import React, { useState, useEffect } from "react";
import BreadcrumbsTC from "../components/shop/BreadcrumbsTC";
import PaginationTC from "../components/shop/PaginationTC";
import ProductBannerTC from "../components/shop/ProductBannerTC";
import ShopSideNavTC from "../components/shop/ShopSideNavTC";
import DetalleArticuloTC from "../components/shop/DetalleArticuloTC";
import HeaderBottomTC from "../components/HeaderBottomTC";
import { useArticulos } from "../context/articulosContext";


const DetalleArticuloPage = () => {

  // const { articulos, GetArticulosPorCategoria } = useArticulos();
  // const { familias, GetFamilias } = useArticulos();


  return (
    <>
      <HeaderBottomTC />
      <div className="max-w-container mx-auto px-4">
        <DetalleArticuloTC />
      </div>
    </>
  );
};

export default DetalleArticuloPage;
