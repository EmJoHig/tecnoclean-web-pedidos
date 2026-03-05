import React, { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'descripcion', direction: 'asc' });

  // Sorting logic
  const sortedProducts = useMemo(() => {
    let sortableItems = [...products];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested objects (like familiaArticulo.descripcion)
        if (sortConfig.key === 'familia') {
          aValue = a.familiaArticulo?.descripcion || "";
          bValue = b.familiaArticulo?.descripcion || "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [products, sortConfig]);

  // Filtrar productos
  const filteredProducts = sortedProducts.filter(product =>
    product.codigo.toLowerCase().includes(search.toLowerCase()) ||
    product.descripcion.toLowerCase().includes(search.toLowerCase()) ||
    (product.familiaArticulo?.descripcion?.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginación de productos
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, products]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return <FaSort className="text-gray-300 ml-1" />;
    return sortConfig.direction === 'asc' ?
      <FaSortUp className="text-primeColor ml-1" /> :
      <FaSortDown className="text-primeColor ml-1" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Table Header / Search */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-gray-800">Listado de Productos</h3>
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código, nombre o familia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primeColor/20 focus:border-primeColor outline-none transition-all placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
              <th onClick={() => requestSort('codigo')} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center">Código {getSortIcon('codigo')}</div>
              </th>
              <th onClick={() => requestSort('descripcion')} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center">Detalle {getSortIcon('descripcion')}</div>
              </th>
              <th onClick={() => requestSort('familia')} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center">Familia {getSortIcon('familia')}</div>
              </th>
              <th onClick={() => requestSort('precio')} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-right">
                <div className="flex items-center justify-end">Precio {getSortIcon('precio')}</div>
              </th>
              <th onClick={() => requestSort('stock')} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-center">
                <div className="flex items-center justify-center">Stock {getSortIcon('stock')}</div>
              </th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedProducts.map((product) => (
              <tr key={product._id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4 text-sm font-medium text-gray-700">{product.codigo}</td>
                <td className="p-4 text-sm text-gray-600 font-medium">{product.descripcion}</td>
                <td className="p-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold">
                    {product.familiaArticulo?.descripcion || "N/A"}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold text-gray-800 text-right">
                  ${product.precio?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400 italic">
                  No se encontraron productos coincidentes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold">{paginatedProducts.length}</span> de <span className="font-semibold">{filteredProducts.length}</span> productos
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Anterior
          </button>
          <div className="flex items-center gap-1">
            <span className="px-4 py-2 text-sm font-bold bg-primeColor text-white rounded-lg shadow-md">
              {page}
            </span>
            <span className="text-gray-400 px-2">/</span>
            <span className="text-sm font-medium text-gray-600">{totalPages || 1}</span>
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
