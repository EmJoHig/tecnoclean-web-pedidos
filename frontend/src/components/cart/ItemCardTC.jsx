import React from "react";
import { ImCross } from "react-icons/im";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
} from "../../redux/orebiSlice";
import { API_URL } from "../../config";

const ItemCardTC = ({ item }) => {

  const validCodes = [
    "15205",
    "7790126120210",
    "7790126137010"
  ];

  const shouldShowFragancia = validCodes.includes(item.codigo);

  const dispatch = useDispatch();
  return (
    <div className="w-full grid grid-cols-5 mb-4 mt-4 py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <FaTrash
          style={{ fontSize: "2.0rem" }}
          onClick={() => dispatch(deleteItem(item._id))}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        {/* <img className="w-32 h-32" src={item.imagen} alt="productImage" /> */}
        {item.imagen ? (
          <img
            className="w-[25%]"
            src={`${API_URL}${item.imagen.replace(/ /g, "%20")}`}
            alt="productImg"
          />
        ) : (
          <></>
        )}

        {/* <h1 className="font-titleFont font-semibold">{item.name}</h1> */}

        <div className="col-span-5 mdl:col-span-3 flex flex-col items-start text-sm text-gray-700 ml-4">
          <h1 className="font-titleFont font-semibold text-lg">{item.name}</h1>
          {/* Mostrar la fragancia solo si el código es válido */}
          {shouldShowFragancia && (
            <p className="font-semibold text-sm mt-1">Fragancia: {item.fragancia}</p>
          )}
        </div>


      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 items-center text-lg font-semibold">
          ${item.price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <span
            onClick={() => dispatch(drecreaseQuantity({ _id: item._id }))}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
          >
            -
          </span>
          <p>{item.quantity}</p>
          <span
            onClick={() => dispatch(increaseQuantity({ _id: item._id }))}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
          >
            +
          </span>
        </div>
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          {/* <p>${item.quantity * item.price}</p> */}
          <p> ${(item.quantity * item.price).toLocaleString("es-ES", {minimumFractionDigits: 2,maximumFractionDigits: 2})} </p>
        </div>
      </div>
    </div>
  );
};

export default ItemCardTC;
