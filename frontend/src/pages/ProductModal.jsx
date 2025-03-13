import React, { useState } from 'react';
import axios from 'axios';

const ProductModal = ({ product, onClose, onSave, familias }) => {
  const [codigo, setCodigo] = useState(product?.codigo || "");
  const [descripcion, setDescripcion] = useState(product?.descripcion || "");
  const [familia, setFamilia] = useState(product?.familiaArticulo?._id || "");
  const [precio, setPrecio] = useState(product?.precio || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [imagen, setImagen] = useState(product?.imagen ?? "");

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codigo || !descripcion || !precio || !stock) { //|| !familia
      alert("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();

    if (product) {// si estoy editando uno existente le paso el id al formData sino, viene vacio 
      formData.append("id", product._id);
    }

    formData.append("codigo", codigo);
    formData.append("descripcion", descripcion);
    formData.append("familia", familia);
    formData.append("precio", parseInt(precio, 10));
    formData.append("stock", parseInt(stock, 10));
    formData.append("file", imagen);
  
    console.log("formData:", formData);

    // const formJson = Object.fromEntries(formData.entries());

    // formJson.precio = parseInt(formJson.precio, 10);
    // formJson.stock = parseInt(formJson.stock, 10);

    // console.log("formJson :", formJson);
    try {
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-[50%]">
        <h2 className="text-xl mb-4">{product ? "Editar Producto" : "Nuevo Producto"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código"
            className="mb-2 p-2 border border-gray-300 w-full"
          />
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripcion"
            className="mb-2 p-2 border border-gray-300 w-full"
          />
          <select
            // value={product?.familiaArticulo? product.familiaArticulo._id : familia}
            value={familia}
            onChange={(e) => setFamilia(e.target.value)}
            className="mb-2 p-2 border border-gray-300 w-full"
          >
            <option value="" disabled>
              Seleccionar Familia
            </option>
            {familias.map((option) => (
              <option key={option._id} value={option._id}>
                {option.descripcion}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio"
            className="mb-2 p-2 border border-gray-300 w-full"
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
            className="mb-2 p-2 border border-gray-300 w-full"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="mb-2 p-2"
          />
          <div className="flex justify-center mt-4">
            <button type="button" onClick={onClose} className="p-2 bg-red-500 text-white">Cancelar</button>
            <button type="submit" className="p-2 ml-4 bg-green-500 text-white">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
