import React, { useState, useEffect } from "react";
import BreadcrumbsTC from "../components/shop/BreadcrumbsTC";
import PaginationTC from "../components/shop/PaginationTC";
import ProductBannerTC from "../components/shop/ProductBannerTC";
import ShopSideNavTC from "../components/shop/ShopSideNavTC";

import { useArticulos } from "../context/articulosContext";


const ShopPage = () => {

  const { articulos, GetArticulosPorCategoria } = useArticulos();
  const { familias, GetFamilias } = useArticulos();

  useEffect(() => {
    GetArticulosPorCategoria();    
  }, []);


  const [itemsPerPage, setItemsPerPage] = useState(48);
  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <BreadcrumbsTC title="Products" />
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNavTC />
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBannerTC itemsPerPageFromBanner={itemsPerPageFromBanner} />
          <PaginationTC itemsPerPage={itemsPerPage} articuloslista={articulos} />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
