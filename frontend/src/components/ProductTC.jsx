import React, { useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "./designLayouts/Image";
import BadgeTC from "./BadgeTC";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/orebiSlice";
import { toast } from "react-toastify";
import { API_URL } from "../config";

const ProductTC = (props) => {
  const dispatch = useDispatch();
  const _id = props.productName;
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(_id);
  const [wishList, setWishList] = useState([]);
  const navigate = useNavigate();
  const productItem = props;

  const validCodes = ["15205", "7790126120210", "7790126137010"];


  const handleProductDetails = () => {

    navigate(`/articulo/${rootId}`, {
      state: {
        item: productItem,
      },
    });
  };

  const handleWishList = () => {
    toast.success("Product add to wish List");
    setWishList(wishList.push(props));
    console.log(wishList);
  };
  return (
    <div className="w-full relative group mx-auto max-w-xs transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
        {/* Imagen de producto con datos sobre ella */}
        <div onClick={handleProductDetails} className="cursor-pointer relative">
          <Image className="w-full h-72 object-cover" imgSrc={`${API_URL}${props.imagen.replace(/ /g, "%20")}`} />
          <div className="absolute top-4 left-4 z-10">
            {props.badge && <BadgeTC text="New" />}
          </div>
        </div>

        {/* Datos sobre la imagen */}
        <div className="absolute bottom-0 w-full bg-white bg-opacity-90 p-4 z-20">
          <h2 className="text-lg font-bold text-primeColor text-xl">{props.descripcion}</h2>
          <p className="text-xl font-bold text-[#4a4949]">
            $ {props.precio.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Controles de carrito y wishlist */}
        <div className="absolute top-4 right-4 z-30">
          <ul className="flex gap-4">
            <li
              // onClick={() =>
              //   dispatch(
              //     addToCart({
              //       _id: props._id,
              //       codigo: props.codigo,
              //       name: props.descripcion,
              //       quantity: 1,
              //       imagen: props.imagen,
              //       badge: props.badge,
              //       price: props.precio,
              //       colors: props.color,
              //       fragancia: "tu mami",
              //     })
              //   )
              // }
              onClick={() => {
                if (validCodes.includes(props.codigo)) {
                  // Redirigir al detalle si el código es uno de los especiales
                  navigate(`/articulo/${rootId}`, {
                    state: {
                      item: productItem,
                    },
                  });
                } else {
                  // Agregar al carrito normalmente
                  dispatch(
                    addToCart({
                      _id: props._id,
                      codigo: props.codigo,
                      name: props.descripcion,
                      quantity: 1,
                      imagen: props.imagen,
                      badge: props.badge,
                      price: props.precio,
                      colors: props.color,
                      fragancia: "",
                    })
                  );
                }
              }}
              className="w-[60px] h-[60px] bg-[#16a34a] text-[#fff] hover:text-[#facc15] cursor-pointer text-lg rounded-full flex justify-center items-center hover:bg-[#16a34a] duration-100 active:scale-90">
              <FaShoppingCart className="text-4xl" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductTC;
