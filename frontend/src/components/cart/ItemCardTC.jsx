import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useArticulos } from "../../context/articulosContext";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
} from "../../redux/orebiSlice";
import { API_URL } from "../../config";

const ItemCardTC = ({ item }) => {
  const dispatch = useDispatch();

  const precioBase = item.priceBase || item.price;
  const fraccion = item.fraccion || 1;
  const cantidad = item.quantity || 0;

  const precioUnitario = precioBase * fraccion;
  const precioTotal = precioUnitario * cantidad;
  // const { CalcularPrecioArticulo } = useArticulos();

  // const [precioCalculado, setPrecioCalculado] = useState(precioDesdePadre ?? 0);
  // const [precioUnitarioCalculado, setPrecioUnitarioCalculado] = useState(item.price || 0);

  // si el padre pasa precio, mantenelo sincronizado
  // useEffect(() => {
  //   if (precioDesdePadre != null) {
  //     setPrecioCalculado(precioDesdePadre);
  //   }
  // }, [precioDesdePadre]);

  // solo calcula localmente si el padre no pasó el subtotal
  // useEffect(() => {
  //   let mounted = true;
  //   async function obtenerPrecio() {
  //     if (precioDesdePadre != null) return; // ya lo tiene el padre
  //     try {
  //       const body = {
  //         precioBase: item.priceBase || item.price,
  //         fraccion: item.fraccion || 1,
  //         cantidad: item.quantity,
  //       };
  //       const response = await CalcularPrecioArticulo(body);
  //       if (!mounted) return;
  //       if (response?.res && response?.data?.precioTotal != null) {
  //         setPrecioCalculado(parseFloat(response.data.precioTotal));
  //       } else {
  //         setPrecioCalculado((item.price || 0) * (item.quantity || 0));
  //       }
  //     } catch (error) {
  //       if (!mounted) return;
  //       setPrecioCalculado((item.price || 0) * (item.quantity || 0));
  //     }
  //   }
  //   obtenerPrecio();
  //   return () => (mounted = false);
  // }, [item.quantity, item.fraccion, precioDesdePadre, item.priceBase, item.price, CalcularPrecioArticulo]);



  // 🧮 Llama al método del context para calcular el precio
  // const obtenerPrecio = async () => {
  //   try {
  //     const body = {
  //       precioBase: item.priceBase || item.price, // Precio por litro
  //       fraccion: item.fraccion || 1,
  //       cantidad: item.quantity,
  //     };

  //     const response = await CalcularPrecioArticulo(body);

  //     if (response?.res && response?.data?.precioTotal) {
  //       setPrecioCalculado(parseFloat(response.data.precioTotal));
  //     } else {
  //       console.warn("Error calculando precio", response);
  //       setPrecioCalculado(0);
  //     }
  //   } catch (error) {
  //     console.error("Error al calcular precio:", error);
  //     setPrecioCalculado(0);
  //   }
  // };


  // 🔁 Recalcula cada vez que cambie cantidad o fracción
  // useEffect(() => {
  //   obtenerPrecio();
  // }, [item.quantity, item.fraccion]);



  //  precio unitario

  // useEffect(() => {
  //   let mounted = true;

  //   async function obtenerPrecioUnitario() {
  //     try {
  //       const body = {
  //         precioBase: item.priceBase || item.price,
  //         fraccion: item.fraccion || 1,
  //         cantidad: 1, // ✅ solo 1 unidad, para obtener el precio unitario
  //       };

  //       const response = await CalcularPrecioArticulo(body);

  //       if (!mounted) return;

  //       if (response?.res && response?.data?.precioTotal != null) {
  //         setPrecioUnitarioCalculado(parseFloat(response.data.precioTotal));
  //       } else {
  //         setPrecioUnitarioCalculado(item.price || 0);
  //       }
  //     } catch (error) {
  //       if (!mounted) return;
  //       setPrecioUnitarioCalculado(item.price || 0);
  //     }
  //   }

  //   obtenerPrecioUnitario();
  //   return () => (mounted = false);
  // }, [item.priceBase, item.price, item.fraccion, CalcularPrecioArticulo]);

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
          {item.tienefragancia && (
            <p className="font-semibold text-sm mt-1">Fragancia: {item.fragancia}</p>
          )}

          {/* Mostrar fracción si existe */}
          {item.tieneFraccion && (
            <p className="font-semibold text-sm mt-1">
              Fracción: <span className="font-normal">{item.fraccion} Litros</span>
            </p>
          )}
        </div>


      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        {/* <div className="flex w-1/3 items-center text-lg font-semibold">
          ${item.price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div> */}
        <div className="flex w-1/3 items-center text-lg font-semibold">
          ${precioUnitario.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
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
          {/* <p> ${(item.quantity * item.price).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </p> */}
          <p>
            ${precioTotal.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemCardTC;
