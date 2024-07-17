import Articulo from "../models/Articulo.js";
import Familia from "../models/Familia.js";

import fs from "fs";

import express from 'express';
const app = express();
app.use(express.json());

// LIST catalogo
export const renderArticulos = async (req, res) => {

  let searchOptions = {};
  let familia = req.query.familia;
  let articulos = null;

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

  let carritoDeCompras = [];
  //req.session.carrito = [];

  if (JSON.stringify(req.session.carrito) === JSON.stringify({})) {
    req.session.carrito = [];
  } else {
    carritoDeCompras = req.session.carrito;
  }

  if (carritoDeCompras === undefined) {
    carritoDeCompras = [];
  }
  console.log('carritoDeCompras');
  console.log(carritoDeCompras);

  res.render("articulos/articulosListado", { articulos, carritoDeCompras });

};


// ADMIN ARTICULOS

// LIST
export const renderAdminArticulos = async (req, res) => {

  let searchOptions = {};
  let familia = req.query.familia;
  let articulos = null;

  if (familia != undefined && familia == 'all') {
    articulos = await Articulo.find().lean();
  } else
    if (familia != undefined && familia != '') {
      let flia = await Familia.findOne({ codigo: familia }).lean();
      searchOptions.familiaArticulo = flia._id;
      articulos = await Articulo.find(searchOptions).lean();
    } else {
      articulos = await Articulo.find().limit().lean();
    }

  res.render("articulos/administracionArticulos", { articulos });

};


// ALTA ARTICULO
export const renderArticuloForm = async (req, res) => {

  const familias = await Familia.find();
  res.render("articulos/altaArticulo", { familias })
}

export const nuevoArticulo = async (req, res) => {
  const { descripcion } = req.body;

  console.log('req files');
  console.log(req.files[0]);

  let binaryData = fs.readFileSync(req.files[0].path);
  var base64String = new Buffer.from(binaryData).toString("base64");

  const imagen = base64String;
  const errors = [];
  if (!descripcion) {
    errors.push({ text: "Please Write a descripcion." });
  }
  if (errors.length > 0)
    return res.render("articulos/altaArticulo", {
      errors,
      description,
    });

  const nuevo = new Articulo({ descripcion, imagen });
  await nuevo.save();
  req.flash("success_msg", "Articulo Added Successfully");
  res.redirect("/articulos/articulosListado");
};


export const renderEditarArticuloForm = async (req, res) => {
  const articulo = await Articulo.findById(req.params.id).lean();
  console.log('articulo');
  console.log(articulo);
  res.render("articulos/editarArticulo", { articulo });
};

export const editarArticulo = async (req, res) => {
  const { descripcion } = req.body;
  console.log('ENTRA');
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Articulo Updated Successfully");
  res.redirect("/articulos/administracionArticulos");
};

export const eliminarArticulo = async (req, res) => {
  await Articulo.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Articulo Deleted Successfully");
  res.redirect("/articulos/administracionArticulos");
};


// CARRITO
// export const carritoCompras = async (req, res) => {

//   const familias = await Familia.find();

//   const carritoData = req.query.carrito;

//     console.log(req.query);

//     console.log(carritoData);

//     console.log(JSON.stringify(carritoData, null, 2));

//   // const carritoObj = JSON.parse(req.query.carrito);

// //   carritoData.forEach(producto => {
// //     if (producto && producto._id) {
// //         console.log('ID del producto en el carrito:', producto._id);
// //     }
// // });


//   res.render("articulos/carritoCompras", { familias })
// }



export const enviocarritovista = async (req, res) => {

  const cartcompras = JSON.parse(req.body.cartcompras);
  const lista = cartcompras.cartcomprasData;

  // const cartcompras = JSON.parse(req.session.carrito);

  // console.log('cartcompras');
  // console.log(cartcompras);

  req.session.carrito = lista;
  // console.log('req.session.carrito');
  // console.log(req.session.carrito);

  // const cartcomprasArray = [];

  // for (const key in lista) {
  //   if (cartcomprasData.hasOwnProperty(key)) {
  //     const item = cartcomprasData[key];
  //     const descripcion = item.descripcion;
  //     const cantidad = item.cantidad;
  //     console.log(`ID: ${key}, Descripción: ${descripcion}, Cantidad: ${cantidad}`);
  //   }
  // }

  res.render("articulos/carritoCompras", { listaDePedidos: lista });
};


export const carritoCompras = async (req, res) => {

  // console.log('DIRECTO VISTA');
  // const lista = req.session.carrito;

  // console.log('req.session.carrito');
  // console.log(req.session.carrito);

  // res.render("articulos/carritoCompras", { lista });
};


//envio wsp

export const enviarpedido = async (req, res) => {

  const listaDePedidos = JSON.parse(req.body.lista);
  console.log('listaDePedidos');
  console.log(listaDePedidos);

  res.render("articulos/carritoCompras", { listaDePedidos });
};



//--------------------------- API PRO ------------------------------

export const GetArticulos = async (req, res) => {

  let searchOptions = {};
  let familia = req.query.familia;
  let articulos = null;

  articulos = await Articulo.find().lean();

  // if (familia != undefined && familia == 'all' ){
  //     articulos = await Articulo.find().lean();
  // } else 
  // if (familia != undefined && familia != ''){
  //   let flia = await Familia.findOne({ codigo: familia }).lean(); 
  //   searchOptions.familiaArticulo = flia._id;
  //   articulos = await Articulo.find(searchOptions).lean();
  // } else {
  //   articulos = await Articulo.find().limit(12).lean();
  // }

  res.json(articulos);

};


export const GetArticulosCategoria = async (req, res) => {

  //obtener de la request los codigos de las categorias seleccionadas
  let checkedCategorys = req.query.checkedCategorys;
  let searchOptions = {};
  let articulos = null;

  // console.log('checkedCategorys');
  // console.log(checkedCategorys);


  // if (checkedCategorys != undefined && checkedCategorys.length > 0 ){
  //   let flia = await Familia.find({ codigo: checkedCategorys }).lean(); 
  //   searchOptions.familiaArticulo = { $in: flia.map(f => f._id) };
  //   articulos = await Articulo.find(searchOptions).lean();
  // } else {  
  //   articulos = await Articulo.find().lean();
  // }

  if (checkedCategorys != undefined && checkedCategorys.length > 0) {
    searchOptions.familiaArticulo = { $in: checkedCategorys };
    articulos = await Articulo.find(searchOptions).lean();
  } else {
    articulos = await Articulo.find().lean();
  }


  // console.log('articulos por categorias');
  // console.log(articulos);
  // articulos = await Articulo.find().lean();
  res.json(articulos);
};


export const GetFamilias = async (req, res) => {
  try {
    const familias = await Familia.find();
    res.json(familias);
  }
  catch (error) {
    console.error('Error fetching articulos:', error);
    res.json([]);
  }
};