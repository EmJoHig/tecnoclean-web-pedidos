import React from "react";
import BrandTC from "./BrandTC";
import CategoryTC from "./CategoryTC";
import ColorTC from "./ColorTC";
import PriceTC from "./PriceTC";

const ShopSideNavTC = () => {
  return (
    <div className="w-full flex flex-col gap-6">

      {/* FILTROS BUSQUEDA */}
      <CategoryTC icons={false} />
      {/* <BrandTC /> */}
      {/* <ColorTC /> */}
      {/* <PriceTC /> */}
    </div>
  );
};

export default ShopSideNavTC;
