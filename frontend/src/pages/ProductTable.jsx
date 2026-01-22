import React, { useState, useEffect } from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Filtrar productos
  const filteredProducts = products.filter(product =>
    product.codigo.includes(search) ||
    product.descripcion.toLowerCase().includes(search.toLowerCase()) ||
    (product.familiaArticulo && product.familiaArticulo.descripcion && product.familiaArticulo.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginación de productos
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search]);


  return (
    <div>
      <div className='flex justify-center items-center'>
        <input
          type="text"
          placeholder="Buscar producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[30%] mb-4 p-2 border border-gray-300"
        />
      </div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border">Código</th>
            <th className="p-2 border">Detalle</th>
            <th className="p-2 border">Familia</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product._id}>
              <td className="p-2 border text-center">{product.codigo}</td>
              <td className="p-2 border text-center">{product.descripcion}</td>
              <td className="p-2 border text-center">{product.familiaArticulo ? product.familiaArticulo.descripcion : ""}</td>
              <td className="p-2 border text-right">${product.precio}</td>
              <td className="p-2 border text-center">{product.stock}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => onEdit(product)}
                  className="p-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="p-1 ml-4 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center items-center space-x-10">
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Anterior
        </button>
        <span>{page} / {Math.ceil(filteredProducts.length / pageSize)}</span>
        <button
          onClick={() => setPage(page < Math.ceil(filteredProducts.length / pageSize) ? page + 1 : page)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
