import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderBottomTC from "../components/HeaderBottomTC";
import BreadcrumbsTC from "../components/shop/BreadcrumbsTC";
import PaginationTC from "../components/shop/PaginationTC";
import ProductBannerTC from "../components/shop/ProductBannerTC";
import ShopSideNavTC from "../components/shop/ShopSideNavTC";
import { filterArticulos } from "../redux/orebiSlice";
import { useArticulos } from "../context/articulosContext";
import { useNavigate } from "react-router-dom";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AdministrarArticulosPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { familias,
    loading,
    GetArticulosPorCategoria,
    getArticulos,
    updatePreciosImportarExcel,
    updatePreciosImportarExcelPorCodigos,
    updateStockImportarExcelPorCodigos,
    migracion,
    GetFamilias,
    createArticulo,
    updateArticulo,
    deleteArticulo
  } = useArticulos();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);  // Producto seleccionado para edición
  const [modalOpen, setModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);


  const [fileExcel, setFileExcel] = useState(null);

  useEffect(() => {
    // GetFamilias();
    async function fetchData() {
      try {
        const articulosData = await getArticulos();  // Obtener artículos
        setProducts(articulosData);  // Establecer productos
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    }

    fetchData();  // Llamada a la función fetchData
  }, []); // [getArticulos]



  // Abrir el modal para crear un producto
  const openCreateModal = () => {
    setSelectedProduct(null);  // No hay producto seleccionado, es para crear
    setModalOpen(true);
  };

  // Abrir el modal para editar un producto
  const openEditModal = (product) => {
    setSelectedProduct(product);  // Establecer el producto seleccionado para editar
    setModalOpen(true);
  };

  // Función para manejar el cierre del modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Función para manejar la actualización de productos después de crear o editar
  const handleProductSave = async (formArticuloJson) => {
    try {
      const { codigo, descripcion, precio, stock } = formArticuloJson;

      const formJson = Object.fromEntries(formArticuloJson.entries());

      if (!formJson.id) {  // NUEVO  producto

        // console.log('formArticuloJson NEW', formArticuloJson);
        const resp = await createArticulo(formArticuloJson);


        if (resp === "") {
          alert('exito al crear el articulo:', resp);
          // openSnackBar('El Articulo se ha creado con éxito.', 'success');
        } else {
          console.log('Error al crear el articulo:', resp);
          // openSnackBar('No se pudo crear la actividad. Inténtalo de nuevo.', 'error');
        }
      } else { // EDITAR producto

        // console.log('formArticuloJson EDIT', formArticuloJson);
        const resp = await updateArticulo(formJson.id, formArticuloJson);


        if (resp === "") {
          alert('exito al editar el articulo:', resp);
          // openSnackBar('El Articulo se ha creado con éxito.', 'success');
        } else {
          console.log('Error al crear el articulo:', resp);
          // openSnackBar('No se pudo crear la actividad. Inténtalo de nuevo.', 'error');
        }
      }

      const resp = await getArticulos();
      setProducts(resp);

    } catch (error) {
      console.error('Error al crear/editar el articulo:', error);
      closeModal();
      // openSnackBar('Error al crear la actividad. Verifica los datos.', 'error');
    }
  };




  // ----------- FUNCIONES PARA IMPORTAR EXCEL -----------

  // Manejar la importación del archivo
  const handleImportarExcel = async () => {

    if (!fileExcel) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileExcel); // Agregar el archivo al FormData

      // console.log("formData", formData);

      // const response = await migracion(formData); 

      const response = await updatePreciosImportarExcelPorCodigos(formData); // Llamar a la función con el FormData

      if (response) {
        //console.log("response data front", response.data);

        const fileInput = document.getElementById("fileInput");
        if (fileInput) fileInput.value = "";

        // alert("Productos importados con éxito");
      } else {
        alert("Error al importar productos");
      }
    } catch (error) {
      console.error("Error al importar los productos:", error);
    }
  };


  // update stock

  const handleImportarExcelStock = async () => {

    if (!fileExcel) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileExcel); // Agregar el archivo al FormData

      // console.log("formData", formData);

      // const response = await migracion(formData); 

      const response = await updateStockImportarExcelPorCodigos(formData); // Llamar a la función con el FormData

      if (response) {
        //console.log("response data front", response.data);

        const fileInput = document.getElementById("fileInput");
        if (fileInput) fileInput.value = "";

        alert("Productos importados con éxito");

      } else {
        alert("Error al importar productos");
      }
    } catch (error) {
      console.error("Error al importar los productos:", error);
    }
  };



  // Manejar la selección de archivo
  const handleFileChange = (event) => {
    setFileExcel(event.target.files[0]);
  };



  //DELETE
  const handleDeleteArticulo = async (producto) => {
    setProductoAEliminar(producto);
    setDeleteModalOpen(true);
    // try {

    //   const resp = await deleteArticulo(id);

    //   if (resp === "") {
    //     alert('exito al eliminar el articulo:', resp);
    //     // openSnackBar('El Articulo se ha creado con éxito.', 'success');
    //   } else {
    //     console.log('Error al eliminar el articulo:', resp);
    //     // openSnackBar('No se pudo crear la actividad. Inténtalo de nuevo.', 'error');
    //   }

    //   const respArt = await getArticulos();
    //   setProducts(respArt);

    // } catch (error) {
    //   console.error("Error al eliminar los productos:", error);
    // }
  }


  const confirmDeleteArticulo = async () => {
    try {
      const resp = await deleteArticulo(productoAEliminar._id);

      if (resp === "") {
        alert("✅ Artículo eliminado con éxito");
      } else {
        alert("❌ No se pudo eliminar el artículo");
      }

      const respArt = await getArticulos();
      setProducts(respArt);

    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("❌ Error inesperado al eliminar");
    } finally {
      setDeleteModalOpen(false);
      setProductoAEliminar(null);
    }
  };


  return (
    // <div className="max-w-container mx-auto px-4 mb-9">
    //   <BreadcrumbsTC title="ADMINISTRAR ARTICULOS" />
    // </div>
    <>
      <HeaderBottomTC />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Administrar Productos</h1>

        <div className="mb-8">
          <button
            onClick={openCreateModal}
            className="p-2 bg-green-600 text-white rounded"
          >
            Crear Producto
          </button>

          <button
            onClick={() => navigate("/descuentos-familias")}
            className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            % Descuentos por Familia
          </button>
        </div>



        <div className="flex flex-wrap items-center gap-4 mb-10 p-4 bg-white rounded-xl shadow-sm border">
          <label className="text-sm font-semibold text-gray-700">
            ADJUNTAR ARCHIVO:
          </label>

          <input
            id="fileInput"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-semibold
      file:bg-gray-100 file:text-gray-700
      hover:file:bg-gray-200
      transition
      cursor-pointer
    "
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleImportarExcel}
              className="
        px-4 py-2 rounded-lg text-white font-medium
        bg-green-600 hover:bg-green-700
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-green-400
        transition-all duration-200
        shadow-sm hover:shadow-md
      "
            >
              💲 Actualizar precios
            </button>

            <button
              onClick={handleImportarExcelStock}
              className="
        px-4 py-2 rounded-lg text-white font-medium
        bg-blue-600 hover:bg-blue-700
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-400
        transition-all duration-200
        shadow-sm hover:shadow-md
      "
            >
              📦 Actualizar stock
            </button>

            <button
              onClick={() => {
                const fileInput = document.getElementById("fileInput");
                if (fileInput) fileInput.value = "";
              }}
              className="
        px-4 py-2 rounded-lg text-white font-medium
        bg-gray-500 hover:bg-gray-600
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-gray-400
        transition-all duration-200
      "
            >
              🧹 Limpiar
            </button>
          </div>
        </div>





        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <span className="text-gray-600 font-semibold text-5xl">Cargando...</span>
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={openEditModal}
            onDelete={handleDeleteArticulo}
          />
        )}

        {modalOpen && (
          <ProductModal
            product={selectedProduct}
            onClose={closeModal}
            onSave={handleProductSave}
            familias={familias}
          />
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteArticulo}
        producto={productoAEliminar}
      />

    </>



  );
};

export default AdministrarArticulosPage;
