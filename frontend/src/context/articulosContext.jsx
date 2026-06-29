import { createContext, useContext, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  getArticulosRequest,
  getFamiliasRequest,
  getFamiliasPublicRequest,
  getFamiliasConArticulosRequest,
  getGruposFamiliasRequest,
  createGrupoFamiliaRequest,
  updateGrupoFamiliaRequest,
  deleteGrupoFamiliaRequest,
  updateFamiliaGrupoRequest,
  createFamiliaRequest,
  updateFamiliaRequest,
  deleteFamiliaRequest,
  UpdateDescuentoFamiliaRequest,
  getFraganciasRequest,
  getArticulosCategoriaRequest,
  getArticulosQueryRequest,
  enviarCarritoWspRequest,
  importarArticulosExcelRequest,
  updatePreciosImportarExcelRequest,
  updatePreciosImportarExcelPorCodigosRequest,
  // calcularPrecioArticuloRequest,
  migracionRequest,
  updateStockImportarExcelPorCodigosRequest,
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

  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [articulos, setArticulos] = useState([]);

  const [articulosQuery, setArticulosQuery] = useState([]);

  const [familias, setFamilias] = useState([]);

  const [familiasConArticulos, setFamiliasConArticulos] = useState([]);

  const [fragancias, setFragancias] = useState([]);

  const [offset, setOffset] = useState(10);

  const [loading, setLoading] = useState(false);

  const [mostrarCargarMas, setMostrarCargarMas] = useState(true);
  const shopRequestRef = useRef({ key: null, promise: null });
  const lastShopFiltersKeyRef = useRef(null);
  const familiasRequestRef = useRef(null);
  const familiasLoadedRef = useRef(false);
  const familiasConArticulosRequestRef = useRef(null);
  const familiasConArticulosLoadedRef = useRef(false);
  const fraganciasRequestRef = useRef(null);
  const fraganciasLoadedRef = useRef(false);

  const buildShopFiltersKey = (checkedCategorys = [], checkedSeccion) => {
    const categoryIds = checkedCategorys
      .map((category) => category?._id || category)
      .filter(Boolean)
      .sort()
      .join(",");

    return JSON.stringify({
      categoryIds,
      checkedSeccion: checkedSeccion || null,
    });
  };

  const buildShopRequestKey = (checkedCategorys = [], checkedSeccion, offset = 0) =>
    JSON.stringify({
      filters: buildShopFiltersKey(checkedCategorys, checkedSeccion),
      offset: Number(offset) || 0,
    });


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


  const GetArticulosPorCategoria = async (checkedCategorys = [], checkedSeccion = null, offset = 0) => {
    const normalizedOffset = Number(offset) || 0;
    const filtersKey = buildShopFiltersKey(checkedCategorys, checkedSeccion);
    const requestKey = buildShopRequestKey(checkedCategorys, checkedSeccion, normalizedOffset);

    if (
      normalizedOffset === 0 &&
      lastShopFiltersKeyRef.current === filtersKey &&
      articulos.length > 0
    ) {
      return articulos;
    }

    if (
      shopRequestRef.current.key === requestKey &&
      shopRequestRef.current.promise
    ) {
      return shopRequestRef.current.promise;
    }

    setLoading(true);

    const requestPromise = getArticulosCategoriaRequest(
      null,
      checkedCategorys,
      checkedSeccion,
      normalizedOffset
    )
      .then((res) => {
        const data = res?.data || [];

        if (normalizedOffset > 0) {
          setArticulos((prevArticulos) => [...prevArticulos, ...data]);
        } else {
          setArticulos(data);
          setOffset(data.length || 10);
          lastShopFiltersKeyRef.current = filtersKey;
        }

        setMostrarCargarMas(data.length > 0);

        return data;
      })
      .catch((error) => {
        console.error('Error fetching articulos:', error);
        return [];
      })
      .finally(() => {
        if (shopRequestRef.current.key === requestKey) {
          shopRequestRef.current = { key: null, promise: null };
        }
        setLoading(false);
      });

    shopRequestRef.current = { key: requestKey, promise: requestPromise };

    return requestPromise;
  };



  const GetArticulosQuery = async (query) => {
    try {
      const res = await getArticulosQueryRequest(null, query);


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
    if (familiasLoadedRef.current) {
      return familias;
    }

    if (familiasRequestRef.current) {
      return familiasRequestRef.current;
    }

    try {
      const requestPromise = (async () => {
        let res;

        if (isAuthenticated) {
          try {
            const token = await getAccessTokenSilently({
              audience: 'https://tecnoclean/api',
            });
            res = await getFamiliasRequest(token);
          } catch (error) {
            console.warn("Token no disponible. Se usa endpoint publico de familias.", error);
            res = await getFamiliasPublicRequest();
          }
        } else {
          res = await getFamiliasPublicRequest();
        }

        setFamilias(res.data);
        familiasLoadedRef.current = true;
        return res.data;
      })();

      familiasRequestRef.current = requestPromise;
      return await requestPromise;
    } catch (error) {
      console.error('Error fetching articulos:', error);
      return [];
    } finally {
      familiasRequestRef.current = null;
    }
  };


  const GetFamiliasConArticulos = async () => {
    if (familiasConArticulosLoadedRef.current) {
      return familiasConArticulos;
    }

    if (familiasConArticulosRequestRef.current) {
      return familiasConArticulosRequestRef.current;
    }

    try {
      const requestPromise = getFamiliasConArticulosRequest(null).then((res) => {
        const data = res?.data || [];
        setFamiliasConArticulos(data);
        familiasConArticulosLoadedRef.current = true;
        return data;
      });

      familiasConArticulosRequestRef.current = requestPromise;
      return await requestPromise;
    } catch (error) {
      console.error('Error fetching articulos:', error);
      return [];
    } finally {
      familiasConArticulosRequestRef.current = null;
    }
  };


  const GetGruposFamilias = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await getGruposFamiliasRequest(token);
      return res.data;
    } catch (error) {
      console.error('Error fetching grupos de familias:', error);
      return [];
    }
  };


  const CreateGrupoFamilia = async (descripcion) => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await createGrupoFamiliaRequest(token, descripcion);
      familiasLoadedRef.current = false;
      familiasConArticulosLoadedRef.current = false;
      return res.data;
    } catch (error) {
      console.error('Error creating grupo de familia:', error);
      throw error;
    }
  };


  const UpdateGrupoFamilia = async (id, descripcion) => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await updateGrupoFamiliaRequest(token, id, descripcion);
      familiasLoadedRef.current = false;
      familiasConArticulosLoadedRef.current = false;
      return res.data;
    } catch (error) {
      console.error('Error updating grupo de familia:', error);
      throw error;
    }
  };


  const DeleteGrupoFamilia = async (id) => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await deleteGrupoFamiliaRequest(token, id);
      familiasLoadedRef.current = false;
      familiasConArticulosLoadedRef.current = false;
      return res.data;
    } catch (error) {
      console.error('Error deleting grupo de familia:', error);
      throw error;
    }
  };


  const UpdateFamiliaGrupo = async (familiaId, grupoId) => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await updateFamiliaGrupoRequest(token, familiaId, grupoId);
      familiasLoadedRef.current = false;
      familiasConArticulosLoadedRef.current = false;
      return res.data;
    } catch (error) {
      console.error('Error updating grupo de familia:', error);
      throw error;
    }
  };

  const CreateFamilia = async (familia) => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await createFamiliaRequest(token, familia);
      familiasLoadedRef.current = false;
      familiasConArticulosLoadedRef.current = false;
      return res.data;
    } catch (error) {
      console.error('Error creating familia:', error);
      throw error;
    }
  };

  const UpdateFamilia = async (id, familia) => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await updateFamiliaRequest(token, id, familia);
      familiasLoadedRef.current = false;
      familiasConArticulosLoadedRef.current = false;
      return res.data;
    } catch (error) {
      console.error('Error updating familia:', error);
      throw error;
    }
  };

  const DeleteFamilia = async (id) => {
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await deleteFamiliaRequest(token, id);
      familiasLoadedRef.current = false;
      familiasConArticulosLoadedRef.current = false;
      return res.data;
    } catch (error) {
      console.error('Error deleting familia:', error);
      throw error;
    }
  };

  const UpdateDescuentoFamilia = async (bodyDtoFamilia) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });

      const res = await UpdateDescuentoFamiliaRequest(token, bodyDtoFamilia);
      familiasLoadedRef.current = false;
      familiasConArticulosLoadedRef.current = false;
      if (res && res.status === 200) {
        return "";
      } else {
        return "Error al editar el descuento de familia";
      }
    } catch (error) {
      console.error('Error updating descuento familia:', error);
      return "Error al editar el descuento de familia";
    }
  };
  
  
  // const  = async (id, descuento) => {
  //   return fetch(`${API_URL}/familias/${id}/descuento`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(descuento),
  //   });
  // };


  const GetFragancias = async () => {
    if (fraganciasLoadedRef.current) {
      return fragancias;
    }

    if (fraganciasRequestRef.current) {
      return fraganciasRequestRef.current;
    }

    try {
      const requestPromise = getFraganciasRequest(null).then((res) => {
        const data = res?.data || [];
        setFragancias(data);
        fraganciasLoadedRef.current = true;
        return data;
      });

      fraganciasRequestRef.current = requestPromise;
      return await requestPromise;
    } catch (error) {
      console.error('Error fetching fragancias:', error);
      return [];
    } finally {
      fraganciasRequestRef.current = null;
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
  // const CalcularPrecioArticulo = async (bodyCarritoUsuario) => {
  //   try {

  //     const token = await getAccessTokenSilently({
  //       audience: 'https://tecnoclean/api',
  //     });


  //     const res = await calcularPrecioArticuloRequest(token, bodyCarritoUsuario);

  //     if (res && res.data) {
  //       return res.data;
  //     } else {
  //       console.log("Error en CalcularPrecioArticulo");
  //       return res.data;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("Error en CalcularPrecioArticulo");
  //   } finally {

  //   }
  // };




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


  // migracion
  const migracion = async (formDataExcel) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      setLoading(true);

      const res = await migracionRequest(token, formDataExcel);
      if (res) {
        return res.data;
      } else {
        console.log("Error en migracion");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error en migracion");
    } finally {
      setLoading(false);
    }
  };


  // importar update stock por codigos existentes en bd 
  const updateStockImportarExcelPorCodigos = async (formDataExcel) => {
    try {

      const token = await getAccessTokenSilently({
        audience: 'https://tecnoclean/api',
      });


      setLoading(true);

      const res = await updateStockImportarExcelPorCodigosRequest(token, formDataExcel);
      if (res) {
        return res.data;
      } else {
        console.log("Error en updateStockImportarExcelPorCodigos");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error en updateStockImportarExcelPorCodigos");
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
        familiasConArticulos,
        fragancias,
        getArticulos,
        GetArticulosPorCategoria,
        GetArticulosQuery,
        GetFamilias,
        GetFamiliasConArticulos,
        GetGruposFamilias,
        CreateGrupoFamilia,
        UpdateGrupoFamilia,
        DeleteGrupoFamilia,
        UpdateFamiliaGrupo,
        CreateFamilia,
        UpdateFamilia,
        DeleteFamilia,
        UpdateDescuentoFamilia,
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
        // CalcularPrecioArticulo,
        migracion,
        updateStockImportarExcelPorCodigos
      }}
    >
      {children}
    </ArticuloContext.Provider>
  );
}
