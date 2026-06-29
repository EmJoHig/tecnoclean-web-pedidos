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
import {
  FORCE_SINGLE_LITER_PRESENTATION,
  formatPrice,
  getProductBasePrice,
  normalizePresentations,
} from "../utils/presentations";

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
  const presentations = normalizePresentations(props);
  const lowestPresentation = presentations.reduce(
    (lowest, presentation) => (presentation.price < lowest.price ? presentation : lowest),
    presentations[0]
  );

  const handleProductDetails = () => {

    navigate(`/articulo/${encodeURIComponent(props.descripcion)}`, {
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

  const tieneDescuento = Number(lowestPresentation?.discountPercent || 0) > 0;
  const porcentajeDescuento = lowestPresentation?.discountPercent || 0;


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

        {/* Datos sobre precio*/}
        <div className="absolute bottom-0 w-full bg-white bg-opacity-90 p-4 z-20">
          <h2 className="text-lg font-bold text-primeColor text-xl">
            {props.descripcion}
          </h2>

          <div className="flex items-center justify-between mt-1">

            <div className="flex flex-col">

              {tieneDescuento && porcentajeDescuento > 0 && (
                <span className="text-sm font-semibold text-green-600">
                  -{porcentajeDescuento}% OFF
                </span>
              )}

              <p className="text-xl font-bold text-[#4a4949]">
                {FORCE_SINGLE_LITER_PRESENTATION
                  ? formatPrice(lowestPresentation?.price)
                  : `Desde ${formatPrice(lowestPresentation?.price)}`}
              </p>

              {lowestPresentation?.oldPrice != null && (
                <p className="text-sm line-through text-gray-400">
                  {formatPrice(lowestPresentation.oldPrice)}
                </p>
              )}

              {!FORCE_SINGLE_LITER_PRESENTATION && (
                <p className="mt-1 text-xs text-gray-600">
                  Presentaciones: {presentations.map((presentation) => presentation.label).join(" / ")}
                </p>
              )}

            </div>


          </div>
        </div>

        {/* <div className="absolute bottom-0 w-full bg-white bg-opacity-90 p-4 z-20">
          <h2 className="text-lg font-bold text-primeColor text-xl">{props.descripcion}</h2>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-[#4a4949]">
              $ {props.precio.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div> */}





        {/* Controles de carrito */}
        <div className="absolute top-4 right-4 z-30">
          <ul className="flex gap-4">
            <li
              onClick={() => {

                if (
                  (!FORCE_SINGLE_LITER_PRESENTATION && presentations.length > 1) ||
                  props.tienefragancia ||
                  props?.colores?.length > 0
                ) {
                  navigate(`/articulo/${encodeURIComponent(props.descripcion)}`, {
                    state: {
                      item: productItem,
                    },
                  });
                } else {
                  const presentation = presentations[0];
                  // Agregar al carrito normalmente
                  dispatch(
                    addToCart({
                      _id: `${props._id}-${presentation.id}`,
                      productId: props._id || props.id,
                      productName: props.descripcion || props.nombre,
                      variantId: presentation.id,
                      presentationLabel: presentation.label,
                      liters: presentation.liters,
                      codigo: props.codigo,
                      name: props.descripcion,
                      quantity: 1,
                      imagen: props.imagen,
                      badge: props.badge,
                      price: presentation.originalPrice,
                      priceBase: getProductBasePrice(props),
                      unitPrice: presentation.price,
                      oldUnitPrice: presentation.oldPrice,
                      discountPercent: presentation.discountPercent,
                      subtotal: presentation.price,
                      //colors: props.color,
                      fragancia: "",
                      fraccion: presentation.liters,
                      tieneFraccion: !FORCE_SINGLE_LITER_PRESENTATION,
                      familiaArticulo: props.familiaArticulo,
                      color: ""
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
