import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/orebiSlice";
import imprimante1 from "../../assets/images/products/bestSeller/imprimante1.webp";
import { useArticulos } from "../../context/articulosContext";

// import { addToCart } from "../../../redux/orebiSlice";

const ProductInfoTC = ({ productInfo }) => {

  const { fragancias, GetFragancias } = useArticulos();

  const [selectedFragancia, setSelectedFragancia] = useState("");
  const [selectedFraccion, setSelectedFraccion] = useState("1");

  const highlightStyle = {
    color: "#d0121a", // Change this to the desired color
    fontWeight: "bold", // Change this to the desired font weight
  };


  // CAPO ARREGLA ESTO TAMBIEN
  const validCodes = ["15205"];



  const fracciones = ["0.5", "1", "1.5", "2", "2.25", "2.5"];


  useEffect(() => {
    GetFragancias();
  }, []);


  // Establecer el primer valor de fragancia como valor inicial si no hay uno seleccionado
  useEffect(() => {
    if (fragancias && fragancias.length > 0 && !selectedFragancia) {
      setSelectedFragancia(fragancias[0].nombre); // Selecciona la primera fragancia por defecto
    }
  }, [fragancias, selectedFragancia]);


  // const renderDescripcion = () => {
  //   if (!productInfo.descripcion) {
  //     return null; // or handle accordingly if product.des is not defined
  //   }

  //   const descripcion = productInfo.descripcion.split(/:(.*?)-/).map((part, index) => {
  //     return (
  //       <span key={index} style={index % 2 === 1 ? highlightStyle : {}}>
  //         {part}
  //       </span>
  //     );
  //   });

  //   return <>{descripcion}</>;
  // };
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl">{productInfo.descripcion}</h2>
      <p className="text-4xl font-bold">
        {/* $ {productInfo.precio} */}

        $ {(productInfo.precio ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}


        {/* <span className="text-xl font-semibold line-through ml-2">540</span>
        <span style={{fontSize: '20px'}} className="text-xs ml-2 inline-flex items-center px-3 py-3 rounded-full bg-green-600 text-white">
          10%
        </span> */}
      </p>
      <hr />

      {/* Selección de Fragancia */}
      {validCodes.includes(productInfo.codigo) && (
        <div className="mt-4">
          <label htmlFor="fragancia" className="block text-sm font-medium text-gray-700">
            Selecciona una fragancia
          </label>
          <select
            id="fragancia"
            name="fragancia"
            value={selectedFragancia}
            onChange={(e) => setSelectedFragancia(e.target.value)}
            className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            style={{
              width: "20%",
              maxHeight: "15rem",
              overflowY: "auto",
            }}
          >
            {fragancias && fragancias.map((fragancia) => (
              <option key={fragancia.nombre} value={fragancia.nombre}>
                {fragancia.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selección de Fracción */}
      {productInfo?.fracciones?.length > 0 && (
        <div>
          <label
            htmlFor="fraccion"
            className="block text-sm font-medium text-gray-700"
          >
            Selecciona una fracción
          </label>
          <select
            id="fraccion"
            name="fraccion"
            value={selectedFraccion}
            onChange={(e) => setSelectedFraccion(e.target.value)}
            className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            style={{
              width: "20%",
              maxHeight: "15rem",
              overflowY: "auto",
            }}
          >
            {productInfo.fracciones.map((fr) => (
              <option key={fr} value={fr}>
                {fr} L
              </option>
            ))}
          </select>
        </div>
      )}


      {/* <p className="text-base text-gray-600">{renderDescripcion()}</p> */}

      {/* <p className="text-base text-gray-600">{productInfo.precio}</p> */}


      {/* <div className="flex items-center">
        <p className="text-sm mr-2"> leave a review </p>

        <svg
          className="w-4 h-4 text-yellow-300 ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
        <svg
          className="w-4 h-4 text-yellow-300 ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
        <svg
          className="w-4 h-4 text-yellow-300 ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
        <svg
          className="w-4 h-4 text-yellow-300 ms-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
        <svg
          className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      </div> */}

      {/* <p className="font-medium text-lg">
        <span className="font-normal">Colors:</span> {productInfo.color}
      </p> */}


      {/* ESTE ANDABA BIEN PERO EL DE ABAJO LE PASA EL TRAPO */}
      {/* <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo._id,
              codigo: productInfo.codigo,
              name: productInfo.descripcion,
              quantity: 1,
              imagen: productInfo.imagen,
              badge: null,
              price: productInfo.precio,
              colors: productInfo.color,
              fragancia: selectedFragancia,
            })
          )
        }
        className="w-full py-4 bg-[#16a34a] hover:bg-[#15803d] duration-300 text-white text-lg font-titleFont rounded"
      >
        Agregar al Carrito
      </button> */}

      <button
        onClick={() => {
          // Si el código requiere fragancia, se la agregamos al _id
          if (productInfo._fracciones && productInfo._fracciones.length > 0) {
            console.log("Producto con fracciones disponibles:");
            console.log(productInfo._fracciones);
          }

          // antes
          // const customId = validCodes.includes(productInfo.codigo) && selectedFragancia
          //   ? `${productInfo._id}-${selectedFragancia}`
          //   : productInfo._id;

          // ahora
          // Construimos el ID personalizado considerando fragancia y fracción
          let customId = productInfo._id;

          // Si tiene código válido (usa fragancias)
          if (validCodes.includes(productInfo.codigo)) {
            if (selectedFragancia && selectedFraccion) {
              customId = `${productInfo._id}-${selectedFragancia}-${selectedFraccion}`;
            } else if (selectedFragancia) {
              customId = `${productInfo._id}-${selectedFragancia}`;
            } else if (selectedFraccion) {
              customId = `${productInfo._id}-${selectedFraccion}`;
            }
          } else if (selectedFraccion) {
            // Si no tiene fragancia pero sí fracción
            customId = `${productInfo._id}-${selectedFraccion}`;
          }

          dispatch(
            addToCart({
              _id: customId,
              codigo: productInfo.codigo,
              name: productInfo.descripcion,
              quantity: 1,
              imagen: productInfo.imagen,
              badge: null,
              price: productInfo.precio,
              colors: productInfo.color,
              fragancia: selectedFragancia,
              fraccion: selectedFraccion,
            })
          );
        }}
        className="w-full py-4 bg-[#16a34a] hover:bg-[#15803d] duration-300 text-white text-lg font-titleFont rounded"
      >
        Agregar al Carrito
      </button>





      {/* <p className="font-normal text-sm">
        <span className="text-base font-medium"> Categories:</span> Spring
        collection, Streetwear, Women Tags: featured SKU: N/A
      </p> */}
    </div>
  );
};

export default ProductInfoTC;
