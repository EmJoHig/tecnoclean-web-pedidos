import { createContext, useContext, useState } from "react";
import {
  createArticuloRequest,
  deleteArticuloRequest,
  getArticulosRequest,
  getArticuloRequest,
  getFamiliasRequest,
  getArticulosCategoriaRequest,
  updateArticuloRequest,
} from "../api/articulo";

const ArticuloContext = createContext();

export const useArticulos = () => {
  const context = useContext(ArticuloContext);
  if (!context) throw new Error("useArticulos must be used within a ArticuloProvider");
  return context;
};

export function ArticuloProvider({ children }) {
  const [articulos, setArticulos] = useState([]);
  const [familias, setFamilias] = useState([]);

  const getArticulos = async () => {

    try {
      const res = await getArticulosRequest();
      // console.log("res.data");
      // console.log(res.data);
      setArticulos(res.data);
      return res.data;

    } catch (error) {
      console.error('Error fetching articulos:', error);
      return []; // o cualquier valor por defecto apropiado
    }

  };


  const GetArticulosPorCategoria = async (checkedCategorys) => {

    try {
      // console.log("checkedCategorys");
      // console.log(checkedCategorys);
      const res = await getArticulosCategoriaRequest(checkedCategorys);
      // console.log("getArticulosCategoriaRequest");
      // console.log(res.data);
      setArticulos(res.data);
      return res.data;

    } catch (error) {
      console.error('Error fetching articulos:', error);
      return []; // o cualquier valor por defecto apropiado
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




  const deleteArticulo = async (id) => {
    try {
      const res = await deleteArticuloRequest(id);
      if (res.status === 204) setArticulos(articulos.filter((articulo) => articulo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const createArticulo = async (articulo) => {
    try {
      const res = await createArticuloRequest(articulo);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getArticulo = async (id) => {
    try {
      const res = await getArticuloRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateArticulo = async (id, articulo) => {
    try {
      await updateArticuloRequest(id, articulo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ArticuloContext.Provider
      value={{
        articulos,
        familias,
        getArticulos,
        GetArticulosPorCategoria,
        GetFamilias,
        deleteArticulo,
        createArticulo,
        getArticulo,
        updateArticulo,
      }}
    >
      {children}
    </ArticuloContext.Provider>
  );
}
