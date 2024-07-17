import React from "react";
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


const HomePage = () => {
    return (

        <div className="w-full mx-auto">
            <BannerTC />
            <BannerBottomTC />
            <div className="max-w-container mx-auto px-4">
                <SaleTC />
                {/* <NewArrivalsTC /> */}
                {/* <BestSellersTC /> */}
                <YearProductTC />
                {/* <SpecialOffertsTC /> */}
            </div>
        </div>

    );
};

export default HomePage;
