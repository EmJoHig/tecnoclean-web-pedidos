import { json } from "react-router-dom";

export function calcularPrecioItem(item) {
  const precioBase = item.priceBase || item.price;
  const fraccion = item.fraccion || 1;
  const cantidad = item.quantity || 0;

  const precioUnit = precioBase * fraccion;
  const subtotal = precioUnit * cantidad;

  const descuentoActivo = item.familiaObj?.descuento?.activo;
  const porcentaje = item.familiaObj?.descuento?.porcentaje || 0;

  const descuento = descuentoActivo
    ? subtotal * (porcentaje / 100)
    : 0;

  const totalConDescuento = subtotal - descuento;
  console.log(`Calculando precio para ${JSON.stringify(item)}`);
  
  return {
    precioUnit,
    subtotal,
    descuento,
    porcentajeDescuento: porcentaje,
    total: totalConDescuento,
  };
}
