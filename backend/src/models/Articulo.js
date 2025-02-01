import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ArticuloSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: false, unique: false, trim: true },
    descripcion: { type: String, required: true },
    precio: {type: Number, required: false},
    imagen: {type: String, required: false},
    date: { type: Date, default: Date.now },
    stock: {type: Number, required: false},
    // familiaArticulo: {type: mongoose.Schema.Types.ObjectId, ref: 'familia', required: false},
    familiaArticulo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Familia", // Referencia al modelo FamiliaArticulo
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export default mongoose.model("Articulo", ArticuloSchema);
