import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/orebiSlice";
import { useArticulos } from "../../context/articulosContext";
import {
  FORCE_SINGLE_LITER_PRESENTATION,
  formatPrice,
  getProductBasePrice,
  normalizePresentations,
} from "../../utils/presentations";

const ProductInfoTC = ({ productInfo }) => {
  const dispatch = useDispatch();
  const { fragancias, GetFragancias } = useArticulos();

  const presentations = normalizePresentations(productInfo);
  const [selectedFragancia, setSelectedFragancia] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedPresentationId, setSelectedPresentationId] = useState(presentations[0]?.id);

  const selectedPresentation =
    presentations.find((presentation) => presentation.id === selectedPresentationId) ||
    presentations[0];

  useEffect(() => {
    if (productInfo?.tienefragancia) {
      GetFragancias();
    }
  }, [productInfo?.tienefragancia]);

  useEffect(() => {
    if (fragancias && fragancias.length > 0 && !selectedFragancia) {
      setSelectedFragancia(fragancias[0].nombre);
    }
  }, [fragancias, selectedFragancia]);

  useEffect(() => {
    if (productInfo?.colores?.length > 0 && !selectedColor) {
      setSelectedColor(productInfo.colores[0]);
    }
  }, [productInfo?.colores, selectedColor]);

  useEffect(() => {
    setSelectedPresentationId(normalizePresentations(productInfo)[0]?.id);
    setQuantity(1);
  }, [productInfo?._id]);

  const addSelectedPresentationToCart = () => {
    if (!selectedPresentation) return;

    let customId = `${productInfo._id}-${selectedPresentation.id}`;

    if (productInfo.tienefragancia && selectedFragancia) {
      customId = `${customId}-${selectedFragancia}`;
    }

    if (productInfo?.colores?.length > 0 && selectedColor) {
      customId = `${customId}-${selectedColor}`;
    }

    dispatch(
      addToCart({
        _id: customId,
        productId: productInfo._id || productInfo.id,
        productName: productInfo.descripcion || productInfo.nombre,
        variantId: selectedPresentation.id,
        presentationLabel: selectedPresentation.label,
        liters: selectedPresentation.liters,
        codigo: productInfo.codigo,
        name: productInfo.descripcion,
        quantity,
        imagen: productInfo.imagen,
        badge: null,
        price: selectedPresentation.originalPrice,
        priceBase: getProductBasePrice(productInfo),
        unitPrice: selectedPresentation.price,
        oldUnitPrice: selectedPresentation.oldPrice,
        discountPercent: selectedPresentation.discountPercent,
        subtotal: selectedPresentation.price * quantity,
        tienefragancia: productInfo.tienefragancia,
        fragancia: productInfo.tienefragancia ? selectedFragancia : "",
        fraccion: selectedPresentation.liters,
        tieneFraccion: !FORCE_SINGLE_LITER_PRESENTATION && presentations.length > 0,
        familiaArticulo: productInfo.familiaArticulo,
        color: productInfo?.colores?.length > 0 ? selectedColor : "",
      })
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl sm:text-4xl">{productInfo.descripcion}</h2>

      <div className="flex flex-col">
        {Number(selectedPresentation?.discountPercent || 0) > 0 && (
          <span className="text-sm font-semibold text-green-600">
            -{selectedPresentation.discountPercent}% OFF
          </span>
        )}

        <p className="text-4xl font-bold">{formatPrice(selectedPresentation?.price)}</p>

        {selectedPresentation?.oldPrice != null && (
          <p className="text-lg line-through text-gray-400">
            {formatPrice(selectedPresentation.oldPrice)}
          </p>
        )}
      </div>

      <hr />

      {productInfo.tienefragancia && (
        <div className="mt-2">
          <label htmlFor="fragancia" className="block text-sm font-medium text-gray-700">
            Selecciona una fragancia
          </label>
          <select
            id="fragancia"
            name="fragancia"
            value={selectedFragancia}
            onChange={(event) => setSelectedFragancia(event.target.value)}
            className="mt-1 w-full sm:w-1/2 lg:w-2/5 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e00725] focus:border-[#e00725] sm:text-sm"
          >
            {fragancias?.map((fragancia) => (
              <option key={fragancia.nombre} value={fragancia.nombre}>
                {fragancia.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {!FORCE_SINGLE_LITER_PRESENTATION && presentations.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-700">Elegí presentación</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
            {presentations.map((presentation) => {
              const isSelected = presentation.id === selectedPresentation?.id;

              return (
                <button
                  key={presentation.id}
                  type="button"
                  onClick={() => setSelectedPresentationId(presentation.id)}
                  className={`min-h-12 rounded-md border px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "border-[#16a34a] bg-[#16a34a] text-white shadow"
                      : "border-gray-300 bg-white text-gray-800 hover:border-[#16a34a] hover:bg-green-50"
                  }`}
                >
                  {presentation.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {productInfo?.colores?.length > 0 && (
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Selecciona un color
          </label>
          <select
            id="color"
            name="color"
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
            className="mt-1 w-full sm:w-1/2 lg:w-2/5 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e00725] focus:border-[#e00725] sm:text-sm"
          >
            {productInfo.colores.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">Cantidad</span>
        <div className="inline-flex h-11 items-center overflow-hidden rounded-md border border-gray-300 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="h-full w-11 text-2xl hover:bg-gray-100"
          >
            -
          </button>
          <span className="flex h-full min-w-12 items-center justify-center border-x border-gray-300 px-4 font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="h-full w-11 text-2xl hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={addSelectedPresentationToCart}
        className="w-full py-4 bg-[#16a34a] hover:bg-[#15803d] duration-300 text-white text-lg font-titleFont rounded"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductInfoTC;
