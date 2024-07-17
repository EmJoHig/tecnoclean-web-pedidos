import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ArticuloSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: false, unique: true, trim: true },
    descripcion: { type: String, required: true },
    precio: {type: String, required: false},
    imagen: {type: String, required: false},
    date: { type: Date, default: Date.now },
    // marca: {type: mongoose.Schema.Types.ObjectId, ref: 'marca', required: true},
    familiaArticulo: {type: mongoose.Schema.Types.ObjectId, ref: 'familia', required: true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export default mongoose.model("Articulo", ArticuloSchema);
