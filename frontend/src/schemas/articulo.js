import { z } from "zod";

export const articuloSchema = z.object({
  id: z.number(),
  codigo: z.string({
    required_error: "El codigo es requerido padre",
  }),
  descripcion: z.string({
    required_error: "Se requiere descripcion p.",
  }),
  precio: z
    .number({
      required_error: "El precio es requerido",
    })
    .min(0, "El precio no puede ser negativo")  // Asegurarse que el precio no sea negativo
    .transform((val) => parseFloat(val.toFixed(2))),
  stock: z.string({
    required_error: "stock is required",
  }),
  imagen: z.string().optional(),
});
