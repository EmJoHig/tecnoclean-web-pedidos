import Articulo from "../models/Articulo.js";



export const renderIndex = async (req, res) => {
    const articulos = await Articulo.find().limit(3).lean();
    res.render("index", { articulos });
};

export const renderAbout = (req, res) => {
  res.render("about");
};
