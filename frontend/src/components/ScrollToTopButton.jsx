import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import "../constants/stylesBotonUp.css";

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn fixed bottom-10 right-10 bg-primeColor text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all overflow-visible"
        >
          <FaArrowUp className="w-6 h-6 relative z-10" />
          <div className="bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
