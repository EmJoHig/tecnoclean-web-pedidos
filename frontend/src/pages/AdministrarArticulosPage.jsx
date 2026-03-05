import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderBottomTC from "../components/HeaderBottomTC";
import { useArticulos } from "../context/articulosContext";
import { useNavigate } from "react-router-dom";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import {
  FaPlus,
  FaPercent,
  FaLayerGroup,
  FaFileExcel,
  FaUpload,
  FaFilter,
  FaCheck,
  FaTimes
} from "react-icons/fa";

const AdministrarArticulosPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    familias,
    loading,
    getArticulos,
    updatePreciosImportarExcelPorCodigos,
    updateStockImportarExcelPorCodigos,
    GetFamilias,
    createArticulo,
    updateArticulo,
    deleteArticulo
  } = useArticulos();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef(null);

  // New state for multi-select families
  const [familiasSeleccionadas, setFamiliasSeleccionadas] = useState([]);

  const productosFiltrados = familiasSeleccionadas.length > 0
    ? products.filter(p => familiasSeleccionadas.includes(p.familiaArticulo?._id))
    : products;

  const familiasOrdenadas = [...(familias || [])].sort((a, b) =>
    a.descripcion.localeCompare(b.descripcion, "es", { sensitivity: "base" })
  );

  const [fileExcel, setFileExcel] = useState(null);
  const [procesandoExcel, setProcesandoExcel] = useState(false);

  useEffect(() => {
    GetFamilias();
    fetchData();

    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchData() {
    try {
      const articulosData = await getArticulos();
      setProducts(articulosData);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  }

  const openCreateModal = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleProductSave = async (formArticuloJson) => {
    try {
      const formJson = Object.fromEntries(formArticuloJson.entries());
      if (!formJson.id) {
        await createArticulo(formArticuloJson);
      } else {
        await updateArticulo(formJson.id, formArticuloJson);
      }
      const resp = await getArticulos();
      setProducts(resp);
      closeModal();
    } catch (error) {
      console.error('Error al guardar el articulo:', error);
    }
  };

  const handleImportarExcel = async () => {
    if (!fileExcel) return alert("Selecciona un archivo");
    try {
      setProcesandoExcel(true);
      const formData = new FormData();
      formData.append("file", fileExcel);
      const response = await updatePreciosImportarExcelPorCodigos(formData);
      if (response) alert("Precios actualizados");
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setProcesandoExcel(false);
    }
  };

  const handleImportarExcelStock = async () => {
    if (!fileExcel) return alert("Selecciona un archivo");
    try {
      setProcesandoExcel(true);
      const formData = new FormData();
      formData.append("file", fileExcel);
      const response = await updateStockImportarExcelPorCodigos(formData);
      if (response) alert("Stock actualizado");
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setProcesandoExcel(false);
    }
  };

  const handleFileChange = (e) => setFileExcel(e.target.files[0]);

  const handleDeleteArticulo = (producto) => {
    setProductoAEliminar(producto);
    setDeleteModalOpen(true);
  };

  const confirmDeleteArticulo = async () => {
    try {
      await deleteArticulo(productoAEliminar._id);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const toggleFamilia = (id) => {
    setFamiliasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <HeaderBottomTC />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Administración</h1>
            <p className="mt-1 text-gray-500">Gestiona tus productos, precios y stock de manera eficiente.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95"
            >
              <FaPlus size={18} /> Crear Producto
            </button>
            <button
              onClick={() => navigate("/descuentos-familias")}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all active:scale-95"
            >
              <FaPercent size={18} /> Descuentos
            </button>
            <button
              onClick={() => navigate("/asignar-grupos-familias")}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <FaLayerGroup size={18} /> Asignar Grupos
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 transform transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <FaFileExcel size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Carga Masiva (Excel)</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-widest">Paso 1: Adjuntar Archivo</label>
              <div className="flex items-center gap-4 group">
                <label className="flex-1 relative cursor-pointer">
                  <input
                    id="fileInput"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed border-gray-200 group-hover:border-blue-400 rounded-2xl bg-gray-50 group-hover:bg-blue-50 transition-all">
                    <FaUpload className="text-gray-400 group-hover:text-blue-500" />
                    <span className="text-gray-600 font-medium group-hover:text-blue-700 truncate max-w-xs">
                      {fileExcel ? fileExcel.name : "Seleccionar Excel..."}
                    </span>
                  </div>
                </label>
                {fileExcel && (
                  <button
                    onClick={() => { setFileExcel(null); document.getElementById('fileInput').value = ''; }}
                    className="p-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Quitar archivo"
                  >
                    <FaTimes size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-widest">Paso 2: Ejecutar Acción</label>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleImportarExcel}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 hover:bg-black text-white rounded-2xl font-bold transition-all disabled:opacity-50"
                  disabled={!fileExcel || procesandoExcel}
                >
                  💲 Actualizar Precios
                </button>
                <button
                  onClick={handleImportarExcelStock}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 hover:bg-black text-white rounded-2xl font-bold transition-all disabled:opacity-50"
                  disabled={!fileExcel || procesandoExcel}
                >
                  📦 Actualizar Stock
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex flex-wrap items-end gap-6">
          <div className="relative" ref={filterRef}>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-widest mb-3">
              Filtrar por Familia(s)
            </label>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center justify-between gap-4 w-72 px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left"
            >
              <span className="text-gray-700 font-medium truncate">
                {familiasSeleccionadas.length === 0
                  ? "Todas las familias"
                  : `${familiasSeleccionadas.length} seleccionada${familiasSeleccionadas.length > 1 ? 's' : ''}`}
              </span>
              <FaFilter className={`transition-colors ${familiasSeleccionadas.length > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">Seleccione Familias</span>
                  {familiasSeleccionadas.length > 0 && (
                    <button
                      onClick={() => setFamiliasSeleccionadas([])}
                      className="text-xs text-blue-600 hover:underline font-bold"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                  {familiasOrdenadas.map((familia) => {
                    const isSelected = familiasSeleccionadas.includes(familia._id);
                    return (
                      <div
                        key={familia._id}
                        onClick={() => toggleFamilia(familia._id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'
                          }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200'
                          }`}>
                          {isSelected && <FaCheck size={10} />}
                        </div>
                        <span className="text-sm font-semibold">{familia.descripcion}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {familiasSeleccionadas.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1">
              {familiasSeleccionadas.map(id => {
                const f = familias.find(fam => fam._id === id);
                return (
                  <span key={id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">
                    {f?.descripcion}
                    <FaTimes
                      className="cursor-pointer hover:text-blue-900"
                      onClick={() => toggleFamilia(id)}
                    />
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Table */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="w-16 h-16 border-4 border-primeColor border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-xl animate-pulse">Cargando productos...</p>
          </div>
        ) : (
          <ProductTable
            products={productosFiltrados}
            onEdit={openEditModal}
            onDelete={handleDeleteArticulo}
          />
        )}
      </div>

      {modalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={closeModal}
          onSave={handleProductSave}
          familias={familias}
        />
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteArticulo}
        producto={productoAEliminar}
      />

      {procesandoExcel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 max-w-sm w-full mx-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Procesando Archivo</h3>
              <p className="text-gray-500 font-medium">Estamos actualizando la base de datos con tu archivo Excel. Por favor, no cierres esta ventana.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrarArticulosPage;
