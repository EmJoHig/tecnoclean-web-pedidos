import React from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteItem, drecreaseQuantity, increaseQuantity } from "../../redux/orebiSlice";
import { API_URL } from "../../config";
import { FORCE_SINGLE_LITER_PRESENTATION, formatLiters, formatPrice } from "../../utils/presentations";

const ItemCardTC = ({ item, precios }) => {
  const dispatch = useDispatch();
  const { precioUnit, precioUnitOriginal, subtotal, descuento, porcentajeDescuento, total } = precios;

  const presentationLabel = item.presentationLabel || (item.fraccion ? `${item.fraccion} L` : "1 L");
  const totalLiters = Number(item.liters || item.fraccion || 1) * Number(item.quantity || 0);

  return (
    <div className="w-full grid grid-cols-5 mb-4 mt-4 py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <FaTrash
          style={{ fontSize: "2.0rem" }}
          onClick={() => dispatch(deleteItem(item._id))}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer flex-shrink-0"
        />

        {item.imagen ? (
          <img
            className="w-[25%] min-w-20 object-contain"
            src={`${API_URL}${item.imagen.replace(/ /g, "%20")}`}
            alt="productImg"
          />
        ) : null}

        <div className="col-span-5 mdl:col-span-3 flex flex-col items-start text-sm text-gray-700 ml-4">
          <h1 className="font-titleFont font-semibold text-lg">{item.name}</h1>

          {!FORCE_SINGLE_LITER_PRESENTATION && presentationLabel && (
            <p className="font-semibold text-sm mt-1">
              Presentación: <span className="font-normal">{presentationLabel}</span>
            </p>
          )}

          <p className="font-semibold text-sm mt-1">
            Cantidad: <span className="font-normal">{item.quantity} unidades</span>
          </p>

          {!FORCE_SINGLE_LITER_PRESENTATION && totalLiters > 0 && (
            <p className="font-semibold text-sm mt-1">
              Total litros: <span className="font-normal">{formatLiters(totalLiters)}</span>
            </p>
          )}

          {item.tienefragancia && item.fragancia && (
            <p className="font-semibold text-sm mt-1">
              Fragancia: <span className="font-normal">{item.fragancia}</span>
            </p>
          )}

          {item.color !== "" && (
            <p className="font-semibold text-sm mt-1">
              Color: <span className="font-normal">{item.color}</span>
            </p>
          )}
        </div>
      </div>

      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 flex-col items-start text-lg font-semibold">
          <span className="text-xs font-normal text-gray-500">Unitario</span>
          {descuento > 0 && <span className="text-sm text-green-600">-{porcentajeDescuento}% OFF</span>}
          <p>{formatPrice(precioUnit)}</p>
          {descuento > 0 && <p className="text-sm line-through text-gray-400">{formatPrice(precioUnitOriginal)}</p>}
        </div>

        <div className="w-1/3 flex items-center gap-6 text-lg">
          <span
            onClick={() => dispatch(drecreaseQuantity({ _id: item._id }))}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300"
          >
            -
          </span>
          <p>{item.quantity}</p>
          <span
            onClick={() => dispatch(increaseQuantity({ _id: item._id }))}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300"
          >
            +
          </span>
        </div>

        <div className="w-1/3 flex flex-col font-titleFont font-bold text-lg">
          <span className="text-xs font-normal text-gray-500">Subtotal</span>
          {descuento > 0 && <span className="text-sm text-green-600">-{porcentajeDescuento}% OFF</span>}
          <p>{formatPrice(total)}</p>
          {descuento > 0 && <p className="text-sm line-through text-gray-400">{formatPrice(subtotal)}</p>}
        </div>
      </div>
    </div>
  );
};

export default ItemCardTC;
