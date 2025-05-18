import Articulo from "../models/Articulo.js";
import Familia from "../models/Familia.js";

import express from 'express';
const app = express();
app.use(express.json());

export const renderIndex = async (req, res) => {
  const articulos = await Articulo.find().lean();//.limit(3).lean();
  const familias = await Familia.find().lean();

  //carrito
  let carritoDeCompras = [];

  if (JSON.stringify(req.session.carrito) === JSON.stringify({})) {
    req.session.carrito = [];
  } else {
    carritoDeCompras = req.session.carrito;
  }

  if(carritoDeCompras === undefined){
    carritoDeCompras = [];
  }
  // console.log('carritoDeCompras index');
  // console.log(carritoDeCompras);


  res.render("index", { articulos, familias, carritoDeCompras });
};

export const renderAbout = (req, res) => {
  res.render("about");
};


export const busquedaArticulos = async (req, res) => {
  let searchOptions = {};
  let familia = req.query.familia;
  let articulos = null;

  // console.log(familia);
  if (familia != undefined && familia == 'all') {
    articulos = await Articulo.find().lean();
  } else
    if (familia != undefined && familia != '') {
      let flia = await Familia.findOne({ codigo: familia }).lean();
      searchOptions.familiaArticulo = flia._id;
      articulos = await Articulo.find(searchOptions).lean();
    } else {
      articulos = await Articulo.find().limit(12).lean();
    }


    //carrito
  let carritoDeCompras = [];

  if (JSON.stringify(req.session.carrito) === JSON.stringify({})) {
    req.session.carrito = [];
  } else {
    carritoDeCompras = req.session.carrito;
  }
  if(carritoDeCompras === undefined){
    carritoDeCompras = [];
  }

  res.render("index", { articulos, carritoDeCompras });

};


export const busquedaCategoriaArticulos = async (req, res) => {
  let searchOptions = {};
  let categoria = req.query.categoria;
  let articulosvista = null;
  let familias = null;
  let arrayFamilias = [];

  if (categoria != undefined && categoria == 'all') {
    articulosvista = await Articulo.find().lean();
    return res.render("index", { articulos: articulosvista });
  } else
    if (categoria == 'LIMPIEZA') {
      let familias = await Familia.find({ codigo: { $in: ['LIQUIDO', 'DESINF', 'AROM', 'AER', 'PAST', 'ESPONJA', 'REJ'] } }).lean();
      arrayFamilias = familias;
    }
  if (categoria == 'DESECHABLES') {
    let familias = await Familia.find({ codigo: { $in: ['DESC', 'BOLSAS', 'PAPEL', 'TRAPO'] } }).lean();
    arrayFamilias = familias;
  }
  if (categoria == 'UTENSILIOS') {
    let familias = await Familia.find({ codigo: { $in: ['PLAST', 'SEC', 'CEP', 'BAZAR'] } }).lean();
    arrayFamilias = familias;
  }
  if (categoria == 'AROMAS') {
    let familias = await Familia.find({ codigo: { $in: ['PERF', 'ESCEN', 'SAHUME'] } }).lean();
    arrayFamilias = familias;
  }
  if (categoria == 'PEGAMENTOS') {
    let familias = await Familia.find({ codigo: { $in: ['PEG'] } }).lean();
    arrayFamilias = familias;
  }
  if (categoria == 'VENENOS') {
    let familias = await Familia.find({ codigo: { $in: ['VEN'] } }).lean();
    arrayFamilias = familias;
  }
  if (categoria == 'MASCOTAS') {
    let familias = await Familia.find({ codigo: { $in: ['MASCOTA'] } }).lean();
    arrayFamilias = familias;
  }


  if (arrayFamilias == null) {
    // res.render("index", { articulos: null });
  }

  let familiaIds = arrayFamilias.map(familia => familia._id);

  searchOptions.familiaArticulo = { $in: familiaIds };

  articulosvista = await Articulo.find(searchOptions).lean();

  //carrito
  let carritoDeCompras = [];
  if (JSON.stringify(req.session.carrito) === JSON.stringify({})) {
    req.session.carrito = [];
  } else {
    carritoDeCompras = req.session.carrito;
  }
  if(carritoDeCompras === undefined){
    carritoDeCompras = [];
  }

  return res.render("index", { articulos: articulosvista, carritoDeCompras });
  // return res.json({ success: true, articulos: articulosvista });
  // res.json({ success: true, articulos: articulosvista });
};

export const renderModalArticulo = async (req, res) => {
  const articuloModal = await Articulo.findOne({ codigo: req.params.codigo }).lean();
  res.json({articulo: articuloModal}); 
};
