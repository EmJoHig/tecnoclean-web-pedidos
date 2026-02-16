import mongoose from "mongoose";
import GrupoFamilia from "../models/GrupoFamilia.js";  // ruta según estructura

const FamiliaSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, required: true },
    grupoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GrupoFamilia",  // el nombre EXACTO del modelo GrupoFamilia
      required: true
    },
    descuento: {
      activo: { type: Boolean, default: false },
      porcentaje: { type: Number, default: 0, min: 0, max: 100 }
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export default mongoose.model("Familia", FamiliaSchema);
