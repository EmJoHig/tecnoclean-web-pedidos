import React from "react";
import { AiOutlineCopyright } from "react-icons/ai";

const FooterBottomTC = () => {
  return (
    <div className="w-full bg-[#e00725] group">
      <div className="max-w-container mx-auto border-t-[1px] pt-10 pb-20">
        <p className="text-white text-titleFont font-normal text-center flex md:items-center justify-center text-lightText duration-200 text-sm">
          <span className="text-md mr-[1px] mt-[2px] md:mt-0 text-center hidden md:inline-flex">
            <AiOutlineCopyright />
          </span>
          Copyright 2024 | Tienda Tecnoclean | All Rights Reserved |
          <a href="/" target="_blank" rel="noreferrer">
            <span className="ml-1 font-medium group-hover:text-primeColor">
              Hecho por Belthier
            </span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default FooterBottomTC;
