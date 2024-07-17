import React, { useEffect, useState } from "react";
import HeadingTC from "../components/HeadingTC";
import ProductTC from "../components/ProductTC";
import { SplOfferData } from "../constants";
import { useParams } from "react-router-dom";

const SpecialOffertsTC = () => {
  const { category } = useParams();

  const [data, setData] = useState([]);
  useEffect(() => {
    setData(SplOfferData);
  }, [data]);

  const catData = data.filter((item) => item.cat === category);
  return (
    <div className="w-full pb-20">
      <HeadingTC heading="Special Offers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-3 gap-10">
        {catData.map((data) => (
          <ProductTC
            key={data._id}
            _id={data._id}
            img={data.img}
            productName={data.productName}
            price={data.price}
            color={data.color}
            badge={true}
            des={data.des}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialOffertsTC;
