import { createContext, useContext, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getArticulosRequest,
  getFamiliasRequest,
  getFamiliasConArticulosRequest,
  getFraganciasRequest,
  getArticulosCategoriaRequest,
  getArticulosQueryRequest,
  enviarCarritoWspRequest,
  importarArticulosExcelRequest,
  updatePreciosImportarExcelRequest,
  updatePreciosImportarExcelPorCodigosRequest,
  calcularPrecioArticuloRequest,
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

  const { getAccessTokenSilently } = useAuth0();

  const [articulos, setArticulos] = useState([]);

  const [articulosQuery, setArticulosQuery] = useState([]);

  const [familias, setFamilias] = useState([]);

  const [fragancias, setFragancias] = useState([]);

  const [offset, setOffset] = useState(10);

  const [loading, setLoading] = useState(false);

  const [mostrarCargarMas, setMostrarCargarMas] = useState(true);

  
  const updateOffset = (newOffset) => {
    setOffset(newOffset);
  };


  const getArticulos = async () => {

    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      const res = await getArticulosRequest(token);
      // console.log("res.data");
      // console.log(res.data);
      // setArticulos(res.data);
      return res.data;

    } catch (error) {
      console.error('Error fetching articulos:', error);
      return []; // o cualquier valor por defecto apropiado
    }

  };


  const GetArticulosPorCategoria = async (checkedCategorys, checkedSeccion, offset) => {

    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      //setArticulos(null);
      setLoading(true);

      const res = await getArticulosCategoriaRequest(token, checkedCategorys, checkedSeccion, offset);

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

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      const res = await getArticulosQueryRequest(token, query);


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



  const enviarCarritoWsp = async (bodyCarritoUsuario) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      setLoading(true);
      const res = await enviarCarritoWspRequest(token, bodyCarritoUsuario);

      if (res && res.data) {
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

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      const res = await getFamiliasRequest(token);
      setFamilias(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching articulos:', error);
      return [];
    }
  };


  const GetFamiliasConArticulos = async () => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await getFamiliasConArticulosRequest(token);
      setFamilias(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching articulos:', error);
      return [];
    }
  };


const GetFragancias = async () => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await getFraganciasRequest(token);
      setFragancias(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching fragancias:', error);
      return [];
    }
  };






  const importarArticulosExcel = async (formDataExcel) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      setLoading(true);

      console.log("formDataExcel", formDataExcel);

      const res = await importarArticulosExcelRequest(token, formDataExcel);
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

  // importar update precios version vieja
  const updatePreciosImportarExcel = async (formDataExcel) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      setLoading(true);

      const res = await updatePreciosImportarExcelRequest(token, formDataExcel);
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


  // calcular precio articulo segun fracciones
  const CalcularPrecioArticulo = async (bodyCarritoUsuario) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      const res = await calcularPrecioArticuloRequest(token, bodyCarritoUsuario);

      if (res && res.data) {
        return res.data;
      } else {
        console.log("Error en CalcularPrecioArticulo");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error en CalcularPrecioArticulo");
    } finally {

    }
  };




  // CRUD

  const createArticulo = async (articulo) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      setLoading(true);
      const res = await createArticuloRequest(token, articulo);

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

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      const res = await getArticuloPorIdRequest(token, id);
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

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      setLoading(true);

      const res = await updateArticuloRequest(token, id, articulo);
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

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      setLoading(true);

      const res = await deleteArticuloRequest(token, id);
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


  // importar update precios por codigos existentes en bd ULTIMA VERSION 
  const updatePreciosImportarExcelPorCodigos = async (formDataExcel) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      setLoading(true);

      const res = await updatePreciosImportarExcelPorCodigosRequest(token, formDataExcel);
      if (res) {
        return res.data;
      } else {
        console.log("Error en updatePreciosImportarExcelPorCodigos");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error en updatePreciosImportarExcelPorCodigos");
    } finally {
      setLoading(false);
    }
  };


  return (
    <ArticuloContext.Provider
      value={{
        articulos,
        articulosQuery,
        familias,
        fragancias,
        getArticulos,
        GetArticulosPorCategoria,
        GetArticulosQuery,
        GetFamilias,
        GetFamiliasConArticulos,
        GetFragancias,
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
        updatePreciosImportarExcel,// version vieja
        updatePreciosImportarExcelPorCodigos,// version nueva 
        CalcularPrecioArticulo,
      }}
    >
      {children}
    </ArticuloContext.Provider>
  );
}
