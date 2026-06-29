const DEFAULT_PRESENTATIONS = [0.5, 1, 1.5, 2, 2.25, 2.5];

// Set this to false to reactivate the product fraction/presentation selector.
export const FORCE_SINGLE_LITER_PRESENTATION = true;
export const SINGLE_LITER_PRESENTATION = 1;

const toNumber = (value, fallback = 0) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  let normalized = String(value ?? "")
    .trim()
    .replace(/[^\d,.-]/g, "");

  if (normalized === "") {
    return fallback;
  }

  if (normalized.includes(",") && normalized.includes(".")) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (normalized.includes(",")) {
    normalized = normalized.replace(",", ".");
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(normalized)) {
    normalized = normalized.replace(/\./g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const labelFromLiters = (liters) => {
  if (liters < 1) return `${Math.round(liters * 1000)} ml`;
  return `${Number(liters.toFixed(2)).toString()} L`;
};

const idFromLabel = (label) =>
  String(label)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(",", ".")
    .replace(/\./g, "_");

const firstPresentValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

export const getProductBasePrice = (product = {}) =>
  toNumber(
    firstPresentValue(
      product.precio,
      product.price,
      product.priceBase,
      product.precioBase,
      product.precioVenta,
      product.PRECIOVENTA,
      product.PRECIO_VENTA,
      product["PRECIO VENTA"],
      product["*Precio de Venta"],
      product.precioUnitario,
      product.unitPrice,
      product.PRECIO,
      product.Price
    ),
    0
  );

const normalizeRawPresentation = (presentation) => {
  if (typeof presentation === "number" || typeof presentation === "string") {
    const liters = toNumber(presentation, 1);
    const label = labelFromLiters(liters);
    return { id: idFromLabel(label), label, liters };
  }

  const liters = toNumber(
    presentation?.liters ??
      presentation?.litros ??
      presentation?.fraccion ??
      presentation?.cantidad ??
      presentation?.value,
    1
  );
  const label = presentation?.label ?? presentation?.descripcion ?? presentation?.nombre ?? labelFromLiters(liters);

  return {
    ...presentation,
    id: presentation?.id ?? presentation?._id ?? idFromLabel(label),
    label,
    liters,
  };
};

export const normalizePresentations = (product = {}) => {
  const rawPresentations =
    product.presentaciones ??
    product.variantes ??
    product.preciosPorFraccion ??
    product.fracciones ??
    product.fraccion ??
    [];

  const normalizedRaw = Array.isArray(rawPresentations)
    ? rawPresentations
    : [rawPresentations];

  const oneLiterPresentation = normalizedRaw.find((presentation) => {
    const normalized = normalizeRawPresentation(presentation);
    return normalized.liters === SINGLE_LITER_PRESENTATION;
  });
  const source = FORCE_SINGLE_LITER_PRESENTATION
    ? [oneLiterPresentation ?? SINGLE_LITER_PRESENTATION]
    : normalizedRaw.length > 0
      ? normalizedRaw
      : DEFAULT_PRESENTATIONS;
  const basePrice = getProductBasePrice(product);
  const discountActive = product.familiaArticulo?.descuento?.activo === true;
  const discountPercent = discountActive
    ? toNumber(product.familiaArticulo?.descuento?.porcentaje, 0)
    : 0;

  return source.map((raw) => {
    const presentation = normalizeRawPresentation(raw);
    const originalPrice = toNumber(
      firstPresentValue(
        raw?.oldPrice,
        raw?.precioAnterior,
        raw?.precioOriginal,
        raw?.originalPrice,
        raw?.precio,
        raw?.price,
        raw?.precioVenta,
        raw?.PRECIOVENTA,
        raw?.PRECIO,
        raw?.precioUnitario,
        raw?.unitPrice
      ),
      basePrice * presentation.liters
    );
    const explicitPrice = firstPresentValue(
      raw?.price,
      raw?.precio,
      raw?.precioActual,
      raw?.precioVenta,
      raw?.PRECIOVENTA,
      raw?.PRECIO,
      raw?.precioUnitario,
      raw?.unitPrice
    );
    const hasExplicitDiscount = raw?.oldPrice || raw?.precioAnterior || raw?.precioOriginal || raw?.originalPrice;
    const price = toNumber(
      explicitPrice,
      discountPercent > 0 ? originalPrice - (originalPrice * discountPercent) / 100 : originalPrice
    );
    const oldPrice = hasExplicitDiscount || discountPercent > 0 ? originalPrice : null;

    return {
      id: presentation.id,
      label: presentation.label,
      liters: presentation.liters,
      price,
      oldPrice,
      originalPrice,
      discountPercent: toNumber(raw?.discountPercent ?? raw?.descuentoPorcentaje, discountPercent || null),
    };
  });
};

export const formatPrice = (value) =>
  `$ ${Number(value || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatLiters = (value) => {
  const liters = toNumber(value, 0);
  return `${Number(liters.toFixed(2)).toString()} L`;
};
