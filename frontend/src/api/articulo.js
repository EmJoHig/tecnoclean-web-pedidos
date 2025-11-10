import axios from "./axios";
import { API_URL } from "../config";


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const getArticulosRequest = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/articulos/getArticulos`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // await delay(2000);
        return response;
    } catch (error) {
        console.error("Error fetching articles by category:", error);
        throw error;
    }
};


export const getArticulosCategoriaRequest = async (token, checkedCategorys, checkedSeccion, offset) => {
    try {
        const response = await axios.get(`${API_URL}/articulos/getArticulosPorCategoria`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                checkedCategorys: checkedCategorys,
                checkedSeccion: checkedSeccion,
                offset: Number(offset) // Asegúrate de convertirlo a número
            }
        });

        return response;
    } catch (error) {
        console.error("Error fetching articles by category:", error);
        throw error;
    }
};


export const getArticulosQueryRequest = async (token, query) => {
    try {
        const response = await axios.get(`${API_URL}/articulos/getArticulosQuery`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { query },
        });

        return response;
    } catch (error) {
        console.error("Error fetching getArticulosQueryRequest: ", error);
        throw error;
    }
};


export const enviarCarritoWspRequest = async (token, bodyCarritoUsuario) => {
    try {
        const response = await axios.post(
            `${API_URL}/articulos/enviarCarritoWsp`,
            { bodyCarritoUsuario: bodyCarritoUsuario },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Error fetching getArticulosQueryRequest: ", error);
        throw error;
    }
};



export const importarArticulosExcelRequest = async (token, formDataExcel) => {
    try {

        const response = await axios.post(
            `${API_URL}/articulos/importar-articulos-excel`,
            formDataExcel,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Error fetching getArticulosQueryRequest: ", error);
        throw error;
    }
};


// importar update precios
export const updatePreciosImportarExcelRequest = async (token, formDataExcel) => {
    try {

        const response = await axios.post(
            `${API_URL}/articulos/update-precios-importar-excel`,
            formDataExcel,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Error fetching getArticulosQueryRequest: ", error);
        throw error;
    }
};



// export const getFamiliasRequest = async (token) => axios.get(`${API_URL}/articulos/getFamilias`);
export const getFamiliasRequest = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/articulos/getFamilias`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        console.error("Error fetching articles by category:", error);
        throw error;
    }
};


export const getFamiliasConArticulosRequest = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/articulos/getFamiliasConArticulos`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        console.error("Error fetching articles by category:", error);
        throw error;
    }
};


export const getFraganciasRequest = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/articulos/getFragancias`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        console.error("Error fetching fragancias by category:", error);
        throw error;
    }
};


// calcular precios fracciones
export const calcularPrecioArticuloRequest = async (token, data) => {
    try {
        const response = await axios.post(
            `${API_URL}/articulos/calcular-precio-articulo`,
            data,
            {
                headers: {// Content-Typ e=> multipart/form-data NO ES NECESARIO PORQUE ENVIO articulo como FormData, q lo hace automatico
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Error fetching calcularPrecioArticuloRequest: ", error);
        throw error;
    }
};


// CRUD

export const createArticuloRequest = async (token, articulo) => {
    try {
        const response = await axios.post(
            `${API_URL}/articulos/nuevo-articulo`,
            articulo,
            {
                headers: {// Content-Typ e=> multipart/form-data NO ES NECESARIO PORQUE ENVIO articulo como FormData, q lo hace automatico
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Error fetching createArticuloRequest: ", error);
        throw error;
    }
};


export const getArticuloPorIdRequest = async (token, id) => {
    try {
        const response = await axios.get(`${API_URL}/articulos/get-articulo-id/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        console.error("Error getArticuloPorIdRequest:", error);
        throw error;
    }
};



export const updateArticuloRequest = async (token, id, articulo) => {
    try {

        const response = await axios.post(`${API_URL}/articulos/editar-articulo`,
            articulo,
            {
                headers: {// Content-Type => multipart/form-data NO ES NECESARIO PORQUE ENVIO articulo como FormData, q lo hace automatico
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Error fetching updateArticuloRequest: ", error);
        throw error;
    }
};



export const deleteArticuloRequest = async (token, id) => {
    try {

        // const response = await axios.delete(`${API_URL}/articulos/eliminar-articulo/${id}`);

        const response = await axios.delete(`${API_URL}/articulos/eliminar-articulo/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );


        return response;
    } catch (error) {
        console.error("Error fetching deleteArticuloRequest: ", error);
        throw error;
    }
};

 
 
// importar update precios POR CODIGO ULTIMA VERSION
export const updatePreciosImportarExcelPorCodigosRequest = async (token, formDataExcel) => {
    try {

        const response = await axios.post(
            `${API_URL}/articulos/update-precios-excel-por-codigo`,
            formDataExcel,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Error fetching getArticulosQueryRequest: ", error);
        throw error;
    }
};
