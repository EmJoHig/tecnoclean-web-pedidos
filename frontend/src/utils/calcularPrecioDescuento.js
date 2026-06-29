export function calcularPrecioItem(item) {
  if (item.unitPrice != null) {
    const cantidad = Number(item.quantity || 0);
    const precioUnitFinal = Number(item.unitPrice || 0);
    const subtotal = precioUnitFinal * cantidad;
    const precioOriginalUnit = Number(item.oldUnitPrice ?? item.originalUnitPrice ?? item.oldPrice ?? precioUnitFinal);
    const subtotalSinDescuento = precioOriginalUnit * cantidad;
    const descuento = Math.max(subtotalSinDescuento - subtotal, 0);

    return {
      precioUnit: precioUnitFinal,
      precioUnitOriginal: precioOriginalUnit,
      subtotal: subtotalSinDescuento,
      descuento,
      porcentajeDescuento: Number(item.discountPercent || item.descuentoPorcentaje || 0),
      total: subtotal,
    };
  }

  const precioBase = item.priceBase || item.price;
  const fraccion = item.fraccion || 1;
  const cantidad = item.quantity || 0;

  const precioUnit = precioBase * fraccion;
  const subtotal = precioUnit * cantidad;

  const descuentoActivo = item.familiaArticulo?.descuento?.activo;
  const porcentaje = item.familiaArticulo?.descuento?.porcentaje || 0;

  const descuento = descuentoActivo
    ? subtotal * (porcentaje / 100)
    : 0;

  const totalConDescuento = subtotal - descuento;
  const precioUnitFinal = cantidad > 0 ? totalConDescuento / cantidad : precioUnit;

  return {
    precioUnit: precioUnitFinal,
    precioUnitOriginal: precioUnit,
    subtotal,
    descuento,
    porcentajeDescuento: porcentaje,
    total: totalConDescuento,
  };
}
