import mongoose from "mongoose";

const FamiliaSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export default mongoose.model("Familia", FamiliaSchema);
