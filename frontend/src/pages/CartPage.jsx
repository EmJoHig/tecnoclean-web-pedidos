import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BreadcrumbsTC from "../components/BreadcrumbsTC";
import HeaderBottomTC from "../components/HeaderBottomTC";
import { resetCart } from "../redux/orebiSlice";
import { emptyCart } from "../assets/images/index";
import ItemCardTC from "../components/cart/ItemCardTC";
import { useArticulos } from "../context/articulosContext";
import { FaSpinner, FaCheck } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { calcularPrecioItem } from "../utils/calcularPrecioDescuento";

const CartPage = () => {
  const dispatch = useDispatch();
  const { enviarCarritoWsp, loading, CalcularPrecioArticulo } = useArticulos();

  const { user, getAccessTokenSilently, getIdTokenClaims } = useAuth0();

  const navigate = useNavigate();
  const [calculandoTotales, setCalculandoTotales] = useState(false);
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState("");
  const [subtotalsMap, setSubtotalsMap] = useState({}); // { [productId]: precioCalculado }

  // COSTO ENVÍO, MAS ADELANTE...
  const [shippingCharge, setShippingCharge] = useState("");

  const [showModalConfirm, setShowModalConfirm] = useState(false);

  const [loadingSendMsg, setLoadingSendMsg] = useState(false);

  // descuentos
  useEffect(() => {
    const total = products.reduce((acc, item) => {
      const precios = calcularPrecioItem(item);
      return acc + precios.total;
    }, 0);

    setTotalAmt(total);
  }, [products]);



  // useEffect(() => {
  //   let price = 0;
  //   products.map((item) => {
  //     price += item.price * item.quantity;
  //     return price;
  //   });
  //   setTotalAmt(price);
  // }, [products]);


  // const calcularPrecioLocal = ({ precioBase, fraccion = 1, cantidad = 1 }) => {
  //   const unitario = Number(precioBase || 0) * Number(fraccion || 1);
  //   const total = unitario * Number(cantidad || 1);

  //   return {
  //     unitario,
  //     total,
  //   };
  // };

  // useEffect(() => {
  //   const total = products.reduce((acc, item) => {
  //     const precioBase = item.priceBase || item.price;
  //     const fraccion = item.fraccion || 1;
  //     const cantidad = item.quantity || 0;

  //     return acc + precioBase * fraccion * cantidad;
  //   }, 0);

  //   setTotalAmt(total);
  // }, [products]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);


  // const calcularTotales = useCallback(async (productos) => {
  //   if (!productos || productos.length === 0) {
  //     setTotalAmt(0);
  //     setSubtotalsMap({});
  //     return;
  //   }

  //   setCalculandoTotales(true);

  //   try {
  //     const resultados = await Promise.all(
  //       productos.map(async (item) => {
  //         const { priceBase, price, fraccion = 1, quantity, _id } = item;
  //         const body = { precioBase: priceBase || price, fraccion, cantidad: quantity };

  //         try {
  //           const resp = await CalcularPrecioArticulo(body);
  //           const precioTotal = resp?.data?.precioTotal ?? price * quantity;
  //           return { id: _id, precio: parseFloat(precioTotal) || 0 };
  //         } catch {
  //           return { id: _id, precio: (price || 0) * (quantity || 0) };
  //         }
  //       })
  //     );

  //     // Construir mapa de subtotales y sumar total
  //     const map = resultados.reduce((acc, { id, precio }) => {
  //       acc[id] = precio;
  //       return acc;
  //     }, {});

  //     const suma = resultados.reduce((sum, r) => sum + r.precio, 0);

  //     setSubtotalsMap(map);
  //     setTotalAmt(suma);
  //   } catch (error) {
  //     console.error("Error al calcular totales:", error);
  //   } finally {
  //     setCalculandoTotales(false);
  //   }
  // }, [CalcularPrecioArticulo]);

  // recalcular cuando cambia products
  // useEffect(() => {
  //   calcularTotales(products);
  //   console.log("calcularTotales...");
  // }, [products]);





  // Dentro de tu useEffect
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const claims = await getIdTokenClaims();

  //       // console.log("user:", user);


  //     } catch (error) {
  //       console.error("Error al obtener claims:", error);
  //     }
  //   }

  //   fetchData();
  // }, []);


  // useEffect(() => {
  //   if (totalAmt <= 200) {
  //     setShippingCharge(30);
  //   } else if (totalAmt <= 400) {
  //     setShippingCharge(25);
  //   } else if (totalAmt > 401) {
  //     setShippingCharge(20);
  //   }
  // }, [totalAmt]);


  const handleClickEnviarCarrito = async () => {

    try {

      setLoadingSendMsg(true);

      const telefono = user['https://tecnoclean/api/phone_number'];

      const body = {
        mailUsuario: user.email,
        nombreUsuario: user.name,
        telefono: telefono,
        articulos: products,
        precioTotal: totalAmt,
      }

      const respuesta = await enviarCarritoWsp(body);


      if (respuesta != null && respuesta.res == true) {
        window.open(respuesta.link, '_blank');
        setShowModalConfirm(true);

      } else {
        toast.error("Error al enviar el pedido, por favor intente nuevamente.");
      }

    } catch (error) {

    }
    // finally{
    //   setLoadingSendMsg(false);
    // }
  }

  const handleClickCerrarModal = async () => {
    setShowModalConfirm(false);
    navigate(`/shop`);
  }


  return (
    <>
      <HeaderBottomTC />
      <div className="max-w-container mx-auto px-4">
        <BreadcrumbsTC title="Carrito de compras" />
        {products.length > 0 ? (
          <div className="pb-20">
            <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
              <h2 className="col-span-2">Producto</h2>
              <h2>Precio</h2>
              <h2>Cantidad</h2>
              <h2>Sub Total</h2>
            </div>
            <div className="mt-5">
              {products.map((item) => {
                const precios = calcularPrecioItem(item);

                return (
                  <div
                    key={item._id}
                    className="bg-white border rounded-xl shadow-md mb-4 transition-transform hover:scale-[1.01]"
                  >
                    <ItemCardTC
                      key={item._id}
                      item={item}
                      precios={precios}
                    />
                  </div>
                );
              })}
              {/* {products.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border rounded-xl shadow-md mb-4 transition-transform hover:scale-[1.01]"
                >
                  <ItemCardTC item={item} />
                </div>
              ))} */}
            </div>

            <button
              onClick={() => dispatch(resetCart())}
              className="mt-6 py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300 rounded"
            >
              Vaciar carrito
            </button>

            {/* <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
            <div className="flex items-center gap-4">
              <input
                className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
                type="text"
                placeholder="Coupon Number"
              />
              <p className="text-sm mdl:text-base font-semibold">
                Apply Coupon
              </p>
            </div>
            <p className="text-lg font-semibold">Update Cart</p>
          </div> */}
            <div className="max-w-7xl gap-4 flex justify-end mt-4">
              <div className="w-96 flex flex-col gap-4">
                <h1 className="text-2xl font-semibold text-right">Total carrito</h1>
                <div>
                  <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                    Total
                    <span className="font-bold">
                      ${totalAmt.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex justify-end">
                  {/* <Link to="/shop"> */}
                  <button onClick={handleClickEnviarCarrito} className="w-52 h-10 bg-[#16a34a] text-white hover:bg-[#15803d] duration-300 rounded">
                    ENVIAR PEDIDO WHATSAPP
                  </button>
                  {/* </Link> */}
                </div>
              </div>
            </div>

            {loading && loadingSendMsg ? (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="flex flex-col justify-center items-center p-6 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16">
                    <FaSpinner className="w-16 h-16 text-red-500 animate-spin" />
                  </div>
                  <span className="text-gray-600 text-lg font-semibold mt-4">Enviando su pedido a WhatsApp...</span>
                </div>
              </div>
            ) : null}


            {showModalConfirm ? (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="flex flex-col justify-center items-center p-6 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16">
                    <FaCheck className="w-16 h-16 text-green-500" />
                  </div>
                  <span className="text-gray-600 text-lg font-semibold mt-4">Se ha enviado su pedido correctamente.</span>
                  <button onClick={handleClickCerrarModal} className="w-52 h-10 mt-4 bg-[#16a34a] text-white hover:bg-[#15803d] duration-300">
                    ACEPTAR
                  </button>
                </div>
              </div>
            ) : null}

          </div>
        ) : (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
          >
            <div>
              <img
                className="w-80 rounded-lg p-4 mx-auto"
                src={emptyCart}
                alt="emptyCart"
              />
            </div>
            <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
              <h1 className="font-titleFont text-xl font-bold uppercase">
                No hay articulos en el carrito de compras
              </h1>
              <p className="text-sm text-center px-10 -mt-2">
                Agrega los productos que desees al carrito y envianos tu pedido
              </p>
              <Link to="/shop">
                <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                  Ir a la Tienda
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </>

  );
};

export default CartPage;
