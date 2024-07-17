import axios from "./axios";

export const getArticulosRequest = async () => axios.get("http://localhost:4000/articulos/getarticulos");

// export const getArticulosCategoriaRequest = async (checkedCategorys) => 
//     axios.get("http://localhost:4000/articulos/getArticulosPorCategoria", checkedCategorys);

export const getArticulosCategoriaRequest = async (checkedCategorys) => {
    try {
        const response = await axios.get("http://localhost:4000/articulos/getArticulosPorCategoria", {
            params: {
                checkedCategorys: checkedCategorys
            }
        });
        return response;
    } catch (error) {
        console.error("Error fetching articles by category:", error);
        throw error;
    }
};


export const getFamiliasRequest = async () => axios.get("http://localhost:4000/articulos/getFamilias");




export const createArticuloRequest = async (articulo) => axios.post("/articulos", articulo);

export const updateArticuloRequest = async (articulo) => axios.put(`/articulos/${articulo._id}`, articulo);

export const deleteArticuloRequest = async (id) => axios.delete(`/articulos/${id}`);

export const getArticuloRequest = async (id) => axios.get(`/articulos/${id}`);
