import React from "react";

const PromotionCard = ({ promo }) => {
  const { title, description, image, discount, cta } = promo;
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-44 object-cover"
        />
        {discount ? (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        ) : null}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1">{description}</p>
        <div className="mt-2">
          <button className="bg-primary-600 text-white py-2 px-3 rounded hover:bg-primary-700">
            {cta || "Ver promo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
