import axios from "./axios";

// export const getArticulosRequest = async () => axios.get("http://localhost:4000/articulos/getArticulos");

export const getArticulosRequest = async () => {
    try {
        const response = await axios.get(`http://localhost:4000/articulos/getArticulos`, {
            
        });

        await delay(2000);

        return response;
    } catch (error) {
        console.error("Error fetching articles by category:", error);
        throw error;
    }
};




// export const getArticulosCategoriaRequest = async (checkedCategorys) => 
//     axios.get("http://localhost:4000/articulos/getArticulosPorCategoria", checkedCategorys);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



export const getArticulosCategoriaRequest = async (checkedCategorys, offset) => {
    try {
        const response = await axios.get(`http://localhost:4000/articulos/getArticulosPorCategoria`, {
            params: {
                checkedCategorys: checkedCategorys,
                offset: Number(offset) // Asegúrate de convertirlo a número
            }
        });

        await delay(2000);

        return response;
    } catch (error) {
        console.error("Error fetching articles by category:", error);
        throw error;
    }
};


export const getArticulosQueryRequest = async (query) => {
    try {
        const response = await axios.get(`http://localhost:4000/articulos/getArticulosQuery`, {
            params: { query },
        });

        return response;
    } catch (error) {
        console.error("Error fetching getArticulosQueryRequest: ", error);
        throw error;
    }
};


export const enviarCarritoWspRequest = async (carrito) => {
    try {
        await delay(2000);
        
        const response = await axios.post(
            `http://localhost:4000/articulos/enviarCarritoWsp`,
            { carrito },
            {
                headers: {
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



export const importarArticulosExcelRequest = async (formDataExcel) => {
    try {
        
        const response = await axios.post(
            `http://localhost:4000/articulos/importar-articulos-excel`,
            formDataExcel,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        await delay(2000);

        return response;
    } catch (error) {
        console.error("Error fetching getArticulosQueryRequest: ", error);
        throw error;
    }
};


// importar update precios
export const updatePreciosImportarExcelRequest = async (formDataExcel) => {
    try {
        
        const response = await axios.post(
            `http://localhost:4000/articulos/update-precios-importar-excel`,
            formDataExcel,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        await delay(2000);

        return response;
    } catch (error) {
        console.error("Error fetching getArticulosQueryRequest: ", error);
        throw error;
    }
};



export const getFamiliasRequest = async () => axios.get("http://localhost:4000/articulos/getFamilias");


// CRUD

export const createArticuloRequest = async (articulo) => {
    try {
        const response = await axios.post(
            `http://localhost:4000/articulos/nuevo-articulo`,
            { articulo },
            {
                headers: {// Content-Typ e=> multipart/form-data NO ES NECESARIO PORQUE ENVIO articulo como FormData, q lo hace automatico
                    "Content-Type": "application/json",
                },
            }
        );

        await delay(2000);

        return response;
    } catch (error) {
        console.error("Error fetching createArticuloRequest: ", error);
        throw error;
    }
};


export const getArticuloPorIdRequest = async (id) => {
    try {
        const response = await axios.get(`http://localhost:4000/articulos/get-articulo-id/${id}`, {
            
        });

        await delay(2000);

        return response;
    } catch (error) {
        console.error("Error getArticuloPorIdRequest:", error);
        throw error;
    }
};



export const updateArticuloRequest = async (id, articulo) => {
    try {

        console.log("updateArticuloRequest axios: ", articulo);

        const response = await axios.post(
            `http://localhost:4000/articulos/editar-articulo`,
            articulo,
            {
                headers: {// Content-Type => multipart/form-data NO ES NECESARIO PORQUE ENVIO articulo como FormData, q lo hace automatico
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        await delay(2000);

        return response;
    } catch (error) {
        console.error("Error fetching updateArticuloRequest: ", error);
        throw error;
    }
};



export const deleteArticuloRequest = async (id) => {
    try {
        
        const response = await axios.delete(`http://localhost:4000/articulos/eliminar-articulo/${id}`);

        await delay(2000);

        return response;
    } catch (error) {
        console.error("Error fetching deleteArticuloRequest: ", error);
        throw error;
    }
};
