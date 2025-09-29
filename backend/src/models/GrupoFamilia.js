import mongoose from "mongoose";

const GrupoFamiliaSchema = new mongoose.Schema({
  descripcion: { type: String, required: true }
}, {
  collection: "gruposFamilias"
});

export default mongoose.model("GrupoFamilia", GrupoFamiliaSchema); // <- ESTE nombre es el que va en el `ref`
