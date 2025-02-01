import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import {
  bannerImgOne,
  bannerImgTwo,
  bannerImgThree,
} from "../assets/images";
import Image from "../components/designLayouts/Image";
import fondoweb from "../assets/images/fondoweb.jpeg";
import fondoweb2 from "../assets/images/fondoweb2.jpeg";
import logomobiletc from "../assets/images/logomobiletc.png";
import fondoweb3 from "../assets/images/fondoweb3.jpg";
import "./Banner.css";

const Banner = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${fondoweb2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        src={fondoweb3}
        alt="Tecnoclean Logo"
        style={{
          maxWidth: "100%",
          height: "auto",
          maxHeight: "200px",
          borderRadius: "10px",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
          marginBottom: "20px",
        }}
      />
      <Link to="/shop" className="bubble-button">
        TIENDA
        <span className="bubble"></span>
        <span className="bubble"></span>
        <span className="bubble"></span>
        <span className="bubble"></span>
        <span className="bubble"></span>
      </Link>
    </div>
  );
};

export default Banner;
