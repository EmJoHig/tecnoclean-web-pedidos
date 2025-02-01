import { createContext, useContext, useState } from "react";
import {
  getArticulosRequest,
  getFamiliasRequest,
  getArticulosCategoriaRequest,
  getArticulosQueryRequest,
  enviarCarritoWspRequest,
  importarArticulosExcelRequest,
  updatePreciosImportarExcelRequest,
  //crud
  createArticuloRequest,
  getArticuloPorIdRequest,
  updateArticuloRequest,
  deleteArticuloRequest,
} from "../api/articulo";

const ArticuloContext = createContext();


export const useArticulos = () => {
  const context = useContext(ArticuloContext);
  if (!context) throw new Error("useArticulos must be used within a ArticuloProvider");
  return context;
};

export function ArticuloProvider({ children }) {
  const [articulos, setArticulos] = useState([]);

  const [articulosQuery, setArticulosQuery] = useState([]);

  const [familias, setFamilias] = useState([]);

  const [offset, setOffset] = useState(10);

  const [loading, setLoading] = useState(false);

  const [mostrarCargarMas, setMostrarCargarMas] = useState(true);





  const updateOffset = (newOffset) => {
    setOffset(newOffset);
  };


  const getArticulos = async () => {

    try {
      const res = await getArticulosRequest();
      // console.log("res.data");
      // console.log(res.data);
      // setArticulos(res.data);
      return res.data;

    } catch (error) {
      console.error('Error fetching articulos:', error);
      return []; // o cualquier valor por defecto apropiado
    }

  };


  const GetArticulosPorCategoria = async (checkedCategorys, offset) => {

    try {
      //setArticulos(null);
      setLoading(true);

      const res = await getArticulosCategoriaRequest(checkedCategorys, offset);

      if (res != null) {
        if (offset > 0) {

          setArticulos((prevArticulos) => [...prevArticulos, ...res.data]);

        } else {
          setArticulos(res.data);
        }

        if (res.data.length > 0) {
          setMostrarCargarMas(true);
        } else {
          setMostrarCargarMas(false);
        }

      }

      return res.data;
    } catch (error) {
      console.error('Error fetching articulos:', error);
      return [];
    } finally {
      setLoading(false); // Desactiva la carga
    }

  };



  const GetArticulosQuery = async (query) => {
    try {

      const res = await getArticulosQueryRequest(query);

      console.log("res");
      console.log(res);

      if (res != null) {
        setArticulosQuery(res.data);
        return res.data;
      } else {

        throw new Error("Error en GetArticulosQuery");
      }
    } catch (error) {
      console.error('Error fetching articulos:', error);
      throw new Error("Error en GetArticulosQuery");
      // return [];
    }
  };



  const enviarCarritoWsp = async (articulos) => {
    try {

      setLoading(true);
      const res = await enviarCarritoWspRequest(articulos);
      if (res) {
        return res.data;
      } else {
        console.log("Error en enviarCarritoWsp");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error en enviarCarritoWsp");
    } finally {
      setLoading(false); // Desactiva la carga
    }
  };




  const GetFamilias = async () => {
    try {
      const res = await getFamiliasRequest();
      setFamilias(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching articulos:', error);
      return [];
    }
  };


  const importarArticulosExcel = async (formDataExcel) => {
    try {

      setLoading(true);

      console.log("formDataExcel", formDataExcel);

      const res = await importarArticulosExcelRequest(formDataExcel);
      if (res) {
        return res.data;
      } else {
        console.log("Error en importarArticulosExcel");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error en importarArticulosExcel");
    } finally {
      setLoading(false); // Desactiva la carga
    }
  };

  // importar update precios
  const updatePreciosImportarExcel = async (formDataExcel) => {
    try {

      setLoading(true);

      const res = await updatePreciosImportarExcelRequest(formDataExcel);
      if (res) {
        return res.data;
      } else {
        console.log("Error en updatePreciosImportarExcel");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error en updatePreciosImportarExcel");
    } finally {
      setLoading(false);
    }
  };


  // CRUD

  const createArticulo = async (articulo) => {
    try {
      setLoading(true);
      const res = await createArticuloRequest(articulo);

      if (res && res.status === 200) {
        return "";
      } else {
        return "Error al crear el articulo";
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Desactiva la carga
    }
  };

  const getArticulo = async (id) => {
    try {
      const res = await getArticuloPorIdRequest(id);
      if (res && res.status === 200) {
        return res.data;
      } else {
        return "Error al obtener el articulo";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateArticulo = async (id, articulo) => {
    try {
      setLoading(true);

      const res = await updateArticuloRequest(id, articulo);
      if (res && res.status === 200) {
        return "";
      } else {
        return "Error al editar el articulo";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Desactiva la carga
    }
  };

  const deleteArticulo = async (id) => {
    try {
      setLoading(true);

      const res = await deleteArticuloRequest(id);
      if (res && res.status === 200) {
        return "";
      } else {
        return "Error al eliminar el articulo";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Desactiva la carga
    }
  };




  return (
    <ArticuloContext.Provider
      value={{
        articulos,
        articulosQuery,
        familias,
        getArticulos,
        GetArticulosPorCategoria,
        GetArticulosQuery,
        GetFamilias,
        deleteArticulo,
        createArticulo,
        getArticulo,
        updateArticulo,
        offset,
        loading,
        mostrarCargarMas,
        updateOffset,
        enviarCarritoWsp,
        importarArticulosExcel,
        updatePreciosImportarExcel,
      }}
    >
      {children}
    </ArticuloContext.Provider>
  );
}
