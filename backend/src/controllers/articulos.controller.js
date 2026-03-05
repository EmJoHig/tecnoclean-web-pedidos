import Articulo from "../models/Articulo.js";
import Familia from "../models/Familia.js";
import Fragancia from "../models/Fragancia.js";
import GrupoFamilia from "../models/GrupoFamilia.js";
// import multer from "multer";
import fs from "fs";
// import express from 'express';
// import { type } from "os";
// import * as XLSX from "xlsx"; // Cambia esto
import xlsx from "xlsx";

import whatsapp from "../libs/whatsapp.js";
import mongoose from "mongoose";

// const app = express();
// app.use(express.json());


//--------------------------- API PRO ------------------------------

export const GetArticulos = async (req, res) => {

  let searchOptions = {};
  let familia = req.query.familia;
  let articulos = null;

  // articulos = await Articulo.find().sort({ descripcion: 1 }).populate("familiaArticulo", "descripcion").lean();

  articulos = await Articulo
    .find()
    .collation({ locale: "es", strength: 1 }) // ignora mayúsculas y acentos
    .sort({ descripcion: 1 })
    .populate("familiaArticulo", "descripcion")
    .lean();




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

  let { checkedCategorys, offset = 0 } = req.query;

  const limit = 10;

  let searchOptions = {
    stock: { $gt: 0 }
  };

  if (checkedCategorys) {
    // Si viene como string, lo pasamos a array
    if (typeof checkedCategorys === "string") {
      checkedCategorys = [checkedCategorys];
    }

    const validIds = checkedCategorys
      .map(cat => {
        // Si es objeto, sacamos el _id
        if (typeof cat === "object" && cat._id) {
          return cat._id;
        }
        return cat;
      })
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    if (validIds.length > 0) {
      searchOptions.familiaArticulo = { $in: validIds };
    }
  }

  // 🔥 QUERY FINAL
  const articulos = await Articulo.find(searchOptions)
    .sort({ descripcion: 1 })
    .skip(Number(offset))
    .limit(limit)
    .populate(
      "familiaArticulo",
      "descripcion codigo descuento"
    )
    .lean();

  // v1
  //obtener de la request los codigos de las categorias seleccionadas
  // let checkedCategorys = req.query.checkedCategorys;
  // const limit = 10;  // Número de artículos a cargar por cada solicitud
  // const offset = req.query.offset || 0;  // El offset (a partir de qué artículo cargar)

  // let searchOptions = {};

  // // articulos con stock mayor a cero
  // searchOptions.stock = { $gt: 0 };

  // let articulos = null;

  // if (checkedCategorys != undefined && checkedCategorys.length > 0) {
  //   searchOptions.familiaArticulo = { $in: checkedCategorys };

  //   articulos = await Articulo.find(searchOptions)
  //     .skip(offset)
  //     .limit(limit)
  //     .lean();
  // } else {
  //   // Si no hay categorías seleccionadas, cargar todos los artículos con paginación
  //   articulos = await Articulo.find({ stock: { $gt: 0 } })
  //     .skip(offset)
  //     .limit(limit)
  //     .lean();
  // }


  if (!articulos) {
    return res.status(404).json({ message: "No hay articulos." });
  }

  res.status(200).json(articulos);


  // if (checkedCategorys != undefined && checkedCategorys.length > 0 ){
  //   let flia = await Familia.find({ codigo: checkedCategorys }).lean(); 
  //   searchOptions.familiaArticulo = { $in: flia.map(f => f._id) };
  //   articulos = await Articulo.find(searchOptions).lean();
  // } else {  
  //   articulos = await Articulo.find().lean();
  // }

  // if (checkedCategorys != undefined && checkedCategorys.length > 0) {
  //   console.log('offset');
  //   console.log(offset);

  //   searchOptions.familiaArticulo = { $in: checkedCategorys };

  //   if (offset != undefined && offset > 0) {
  //     articulos = await Articulo.find(searchOptions).skip(offset).limit(limit);//lean();
  //   }
  //   else {
  //     articulos = await Articulo.find(searchOptions).limit(limit);
  //   }
  // } else {
  //   articulos = await Articulo.find().lean();
  // }

  // res.json(articulos);
};


// GET FAMILIAS TODAS
export const GetFamilias = async (req, res) => {
  try {
    const familias = await Familia.find().populate("grupoId").sort({ descripcion: 1 });
    res.json(familias);
  }
  catch (error) {
    console.error('Error fetching articulos:', error);
    res.status(500).json({ message: "Error fetching articulos" });
  }
};

// GET FAMILIAS CON ARTICULOS
export const GetFamiliasConArticulos = async (req, res) => {
  try {
    const familias = await Familia.find().populate("grupoId").sort({ descripcion: 1 });
    const familiasConArticulos = [];

    if (familias != null && familias.length > 0) {
      for (const familia of familias) {
        // const count = await Articulo.countDocuments({ familiaArticulo: familia._id });
        const count = await Articulo.countDocuments({
          familiaArticulo: familia._id,
          stock: { $gt: 0 }  // <-- filtro para stock mayor a cero
        });
        if (count > 0) {
          familiasConArticulos.push(familia);
        }
      }
    }
    else {
      familiasConArticulos = familias;
    }

    res.json(familiasConArticulos);
  }
  catch (error) {
    console.error('Error fetching articulos:', error);
    res.status(500).json({ message: "Error fetching articulos" });
  }
};

// UPDATE DESCUENTO FAMILIA
export const UpdateDescuentoFamilia = async (req, res) => {
  try {
    const { bodyDtoFamilia } = req.body;
    // console.log("Datos recibidos para actualizar descuento de familia:", { bodyDtoFamilia });

    if (!bodyDtoFamilia._id || bodyDtoFamilia.porcentaje == null) {
      return res.status(400).json({ message: "ID de familia y datos de descuento son requeridos" });
    }

    if (bodyDtoFamilia?.porcentaje == null) {
      return res.status(400).json({ message: "Datos de descuento son requeridos" });
    }

    const activo = bodyDtoFamilia.activo;
    const porcentaje = Number(bodyDtoFamilia.porcentaje);

    if (Number.isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      return res.status(400).json({ message: "Porcentaje inválido (0 a 100)" });
    }

    const familiaActualizada = await Familia.findByIdAndUpdate(
      bodyDtoFamilia._id,
      {
        $set: {
          "descuento.activo": activo,
          "descuento.porcentaje": porcentaje,
        },
      },
      { new: true }
    );

    if (!familiaActualizada) {
      return res.status(404).json({ message: "Familia no encontrada" });
    }

    return res.status(200).json({
      message: "Descuento de familia actualizado exitosamente",
      data: familiaActualizada,
      res: true,
    });


  } catch (error) {
    console.error("Error al actualizar el descuento de familia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET FRAGANCIAS TODAS
export const GetFragancias = async (req, res) => {
  try {
    const fragancias = await Fragancia.find();
    res.json(fragancias);
  }
  catch (error) {
    console.error('Error fetching fragancias:', error);
    res.status(500).json({ message: "Error fetching fragancias" });
  }
};


export const GetArticulosQuery = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // const articulos = await Articulo.find({
    //   descripcion: { $regex: query, $options: "i" }, // 'i' para que no sea sensible a mayúsculas/minúsculas
    // });

    // 🔹 Normalizar texto (sin acentos)
    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const normalizedQuery = normalizeText(query.trim());

    // 🔹 Separar en palabras
    const tokens = normalizedQuery
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // escapar regex
      .map((t) => t.replace(/n/g, "(?:n|ñ)"));// 👇 n debe matchear n o ñ

    // 🔹 Regex que exige que todas las palabras estén presentes (en cualquier orden)
    const pattern = tokens.map((t) => `(?=.*${t})`).join("") + ".*";

    const articulos = await Articulo.find({
      descripcion: { $regex: pattern, $options: "i" },
      stock: { $gt: 0 }
    })
      .collation({ locale: "es", strength: 1 }) // ignora mayúsculas y acentos
      .sort({ descripcion: 1 })
      .populate("familiaArticulo", "descripcion codigo descuento")
      .limit(15) // importante para buscador dinámico
      .lean();


    return res.json(articulos);
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const generarMensaje = (bodyCarritoUsuario) => {
  // let mensaje = "¡Hola! Aquí tienes tu pedido:\n\n";
  // carrito.forEach(item => {
  //   mensaje += `- ${item.name}: ${item.quantity} unidad(es)\n`;
  //   if(item.fragancia != "") {
  //     mensaje += `  Fragancia: ${item.fragancia}\n`;
  //   }
  // });
  // return mensaje.trim();

  let mensaje = "🛒 ¡ ¡ ¡ NUEVO PEDIDO ! ! !*\n\n";
  mensaje += ` *EMAIL:* ${bodyCarritoUsuario.mailUsuario}\n`;
  mensaje += ` *NOMBRE:* ${bodyCarritoUsuario.nombreUsuario}\n`;
  mensaje += ` *TELEFONO:* ${bodyCarritoUsuario.telefono}\n\n`;
  mensaje += " *Artículos:*\n\n";
  bodyCarritoUsuario.articulos.forEach(item => {
    mensaje += `• ${item.name}\n`;
    mensaje += `  Cantidad: ${item.quantity}\n`;
    if (item.fragancia) {
      mensaje += `  Fragancia: ${item.fragancia}\n`;
    }
    if (item.fraccion) {
      mensaje += `  Fracción: ${item.fraccion}\n`;
    }

    if (item.color && item.color != "") {
      mensaje += `  Color: ${item.color}\n`;
    }

    // ✅ TOTAL DEL ITEM (cantidad + descuento aplicado)
    if (item.totalItem != null) {
      mensaje += `  Total: $ ${item.totalItem.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}\n`;
    }

    mensaje += "\n";
  });

  mensaje += "\n";
  mensaje += `  PRECIO TOTAL: $ ${bodyCarritoUsuario.precioTotal.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}\n`;

  return mensaje.trim();

};

const enviarMensaje = (chatId, mensaje) => {
  return new Promise((resolve, reject) => {
    whatsapp.sendMessage(chatId, mensaje)
      .then(() => {
        resolve("Mensaje enviado correctamente");
      })
      .catch((error) => {
        reject("Error al enviar el mensaje: " + error.message);
      });
  });
};



// VERSION 2 SIN LIBRERIA, CON API WHATSSAP
export const EnviarCarritoWsp = async (req, res) => {
  try {
    const { bodyCarritoUsuario } = req.body;
    const mensajeWSP = generarMensaje(bodyCarritoUsuario);
    // const tel = '542215937093'; // sin el + adelante

    // tel negocio: +54 9 2213 18-8915 
    const tel = '542213188915'; // sin el + adelante


    // Codificamos el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensajeWSP);

    // Armamos el link directo a WhatsApp
    const linkWsp = `https://wa.me/${tel}?text=${mensajeCodificado}`;

    // Lo devolvés al frontend
    res.json({ link: linkWsp, res: true });

  } catch (error) {
    console.error("Error generando link de WhatsApp:", error);
    res.status(500).json({ res: false, error: "Error interno del servidor" });
  }
};




// VERSION 1 CON LIBRERIA
// export const EnviarCarritoWsp = async (req, res) => {
//   try {
//     const { bodyCarritoUsuario } = req.body;
//     const mensajeWSP = generarMensaje(bodyCarritoUsuario);
//     const tel = '+542215937093'
//     const chatId = tel.substring(1) + "@c.us";

//     const number_details = await whatsapp.getNumberId(chatId);

//     if (number_details) {

//       enviarMensaje(chatId, mensajeWSP)
//         .then((respuesta) => {
//           //console.log(respuesta);
//           res.json({ mensaje: respuesta, res: true });
//         })
//         .catch((error) => {
//           //console.error(error);
//           res.status(500).json({ res: false, error: error.message || error });
//         });
//     } else {
//       res.json({ res: false })
//     }
//   } catch (error) {
//     console.error("Error fetching articles by category:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };




// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Ruta de destino
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // Nombre del archivo
//   },
// });

// const upload = multer({ storage: storage });

// Exportar la carga del archivo
// export const cargarProductos = upload.single("file");



// IMPORTACION CON ALTA DE ARTICULOS
export const ImportarArticulosExcel = async (req, res) => {
  // Verificar si se cargó un archivo

  // const { formDataExcel } = req.body;
  const formDataExcel = req.file;

  if (!formDataExcel) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Leer el archivo Excel
    const workbook = XLSX.readFile(formDataExcel.path);
    const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet); // Convertir la hoja en un array de objetos

    // Mapear los datos del Excel a los campos del esquema
    const productos = data.map(item => ({
      codigo: item.CODIGO || "", // Si el código es null o undefined, lo dejamos vacío
      descripcion: item.DETALLE || "", // Descripción o detalle
      precio: item.PRECIO ?? 0, // Si el precio es null o undefined, lo ponemos en 0
      familiaArticulo: item.FAMILIA || null, // Asegúrate de que la familia esté referenciada correctamente
    }));


    // quito los duplicados
    const productosSinDuplicados = Array.from(
      new Map(productos.map(item => [item.descripcion, item])).values()
    );


    const articulosParaGuardar = [];

    //articulos con propiedades modificadas para guardarse
    const articulosParaGuardarModif = [];

    (async () => {

      for (const producto of productosSinDuplicados) {

        const productoExistente = await Articulo.findOne({ descripcion: producto.descripcion });

        // Agregar al array de artículos para guardar si no existe
        if (!productoExistente) {

          articulosParaGuardar.push({
            codigo: producto.codigo,
            descripcion: producto.descripcion,
            precio: producto.precio,
            familiaArticulo: producto.familiaArticulo,
          });
        } else {
          // console.log(`Artículo ya existe en la base de datos: ${producto.codigo}`);
        }
      }


      //recorro los articulos que arme para guardar y le seteo las propiedad necesaria para guardarlos
      for (const articulo of articulosParaGuardar) {
        const familia = await Familia.findOne({ codigo: articulo.familiaArticulo });

        if (!familia) {

          // obtengo la familia con codigo ARTICULOS
          const fliaARTICULOS = await Familia.findOne({ codigo: "ARTICULOS" });

          if (fliaARTICULOS) {
            // seteo al articulo la familia por defecto ARTICULOS
            articulo.familiaArticulo = fliaARTICULOS._id;

            //seteo las props necesarias para guardar el articulo
            const nuevoArticulo = new Articulo({
              codigo: articulo.codigo,
              descripcion: articulo.descripcion,
              precio: articulo.precio,
              familiaArticulo: fliaARTICULOS._id,
            });

            articulosParaGuardarModif.push(nuevoArticulo);


            const responseNuevoArticulo = await nuevoArticulo.save();
            if (!responseNuevoArticulo) {
              console.error("Error al guardar el artículo:", responseNuevoArticulo);
            }
            else {
              console.log("Artículo guardado en la base de datos:", responseNuevoArticulo);
            }

          }
        } else { // si el articulo impotado tiene familia existente

          // seteo al articulo el id de la familia existente
          articulo.familiaArticulo = familia._id;

          //seteo las props necesarias para guardar el articulo
          const nuevoArticulo = new Articulo({
            codigo: articulo.codigo,
            descripcion: articulo.descripcion,
            precio: articulo.precio,
            familiaArticulo: familia._id,
          });

          articulosParaGuardarModif.push(nuevoArticulo);

          const responseNuevoArticulo = await nuevoArticulo.save();
          if (!responseNuevoArticulo) {
            console.error("Error al guardar el artículo:", responseNuevoArticulo);
          }
          else {
            console.log("Artículo guardado en la base de datos:", responseNuevoArticulo);
          }
        }
      }

      await res.status(200).json({ message: "Productos importados exitosamente", data: articulosParaGuardarModif });

      //   !!!!   IMPORTANTE   !!!!!
      // esta FUNCION async donde realizo el bucle for, las variables como articulosParaGuardar
      // no tienen los datos actualizados por fuera de ella.
    })();


    // res.status(200).json({ message: "Productos importados exitosamente", data: articulosParaGuardar, NOdupli: productosSinDuplicados });
  } catch (error) {
    console.error("Error al importar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};



// IMPORTACION CON EDICION DE DATOS DE ARTICULOS

export const ActualizarPreciosImportacionExcel = async (req, res) => {
  const formDataExcel = req.file;

  if (!formDataExcel) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Leer el archivo Excel
    const workbook = XLSX.readFile(formDataExcel.path);
    const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet); // Convertir la hoja en un array de objetos

    // Mapear los datos del Excel a los campos necesarios
    const productos = data.map(item => ({
      codigo: item.CODIGO || "", // Si el código es null o undefined, lo dejamos vacío
      descripcion: item.DETALLE || "", // Descripción o detalle
      precio: item.PRECIO ?? 0, // Si el precio es null o undefined, lo ponemos en 0
      //familiaArticulo: item.FAMILIA || null, // Asegúrate de que la familia esté referenciada correctamente
    }));

    // Validar que no haya productos sin código
    const productosValidos = productos.filter(producto => producto.codigo);

    // Actualizar precios en la base de datos
    const resultados = [];

    for (const producto of productosValidos) {
      try {
        // Buscar y actualizar el producto por su código
        const productoActualizado = await Articulo.findOneAndUpdate(
          { codigo: producto.codigo }, // Filtro por código
          { $set: { precio: producto.precio } }, // Actualizar el precio
          { new: true } // Retornar el documento actualizado
        );

        if (productoActualizado) {
          resultados.push({
            codigo: producto.codigo,
            mensaje: "Precio actualizado",
            producto: productoActualizado,
          });
        } else {
          resultados.push({
            codigo: producto.codigo,
            mensaje: "Producto no encontrado en la base de datos",
          });
        }
      } catch (error) {
        console.error(`Error al actualizar el producto con código ${producto.codigo}:`, error);
        resultados.push({
          codigo: producto.codigo,
          mensaje: "Error al actualizar el producto",
          error: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Actualización de productos completada",
      data: resultados,
    });


  } catch (error) {
    console.error("Error al procesar el archivo Excel:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


//  ---------   CRUD   ------------

export const CreateArticulo = async (req, res) => {
  try {
    const { codigo, descripcion, precio, familia, stock } = req.body;
    const imagenPath = req.file ? req.file : null;

    let imagenFilename = null;

    if (imagenPath) {
      imagenFilename = `/uploads/images/${imagenPath.filename}`; // Ruta de la imagen en el servidor
    }

    if (!codigo || !descripcion || precio == null || !stock) {// || !familiaArticulo
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const nuevoArticulo = new Articulo({
      codigo: codigo,
      descripcion: descripcion,
      precio: precio,
      stock: stock,
      familiaArticulo: familia,
      imagen: imagenFilename
    });

    const articuloGuardado = await nuevoArticulo.save();


    if (articuloGuardado) {
      res.status(200).json({ message: "Artículo creado exitosamente", data: articuloGuardado });
    }
    else {
      res.status(404).json({ message: "Error al crear el artículo" });
    }

  } catch (error) {
    console.error("Error al crear el artículo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const GetArticuloById = async (req, res) => {
  try {
    const { id } = req.params;

    const articulo = await Articulo.findById(id);

    if (!articulo) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    res.status(200).json(articulo);
  } catch (error) {
    console.error("Error al obtener el artículo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const UpdateArticulo = async (req, res) => {
  try {
    const { id, codigo, descripcion, precio, familia, stock } = req.body;
    const imagenPath = req.file ? req.file : null;

    //let imagenFilename = null;

    // if (imagenPath) {
    //   imagenFilename = `/uploads/images/${imagenPath.filename}`; // Ruta de la imagen en el servidor
    // }


    //console.log('imagenPath: ', imagenPath);

    if (!codigo || !descripcion || precio == null) { //|| !familiaArticulo
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    //console.log('imagenFilename: ', imagenFilename);

    // Busca el artículo actual para obtener la imagen existente
    const articuloExistente = await Articulo.findById(id);
    if (!articuloExistente) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    let imagenFilename = articuloExistente.imagen;

    // Si se proporciona una nueva imagen, actualiza la ruta de la imagen
    if (imagenPath) {
      imagenFilename = `/uploads/images/${imagenPath.filename}`; // Ruta de la nueva imagen en el servidor
    }


    const articuloActualizado = await Articulo.findByIdAndUpdate(
      id,
      { codigo, descripcion, precio, familiaArticulo: familia, stock, imagen: imagenFilename }, // info =>  codigo: codigo, stock: stock etc
      { new: true } //  devuelve el documento ya actualizado
    );

    if (!articuloActualizado) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    res.status(200).json({ message: "Artículo actualizado exitosamente", data: articuloActualizado });
  } catch (error) {
    console.error("Error al actualizar el artículo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const DeleteArticulo = async (req, res) => {
  try {
    const { id } = req.params;

    const articuloEliminado = await Articulo.findByIdAndDelete(id);

    if (!articuloEliminado) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    res.status(200).json({ message: "Artículo eliminado exitosamente" });

  } catch (error) {
    console.error("Error al eliminar el artículo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};




// ENDPOINT LLAMADO POR N8N QUE CAMBIA PRECIO SEGUN CODIGO DEL SISTEMA A MI WEB PEDIDOS
// n8n envia por body los articulos con codigo, descripcion y precio que llegan al mail y los actualiza en mi web pedidos

export const ActualizarPreciosAgenteN8N = async (req, res) => {
  const { data: productos } = req.body;

  // console.log("Productos recibidos para actualización de precios:", productos);

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "No se enviaron productos en el body" });
  }

  const resultados = [];

  for (const producto of productos) {
    const codigo = producto.CODIGO?.toString().trim() || "";

    if (!codigo) {
      resultados.push({
        codigo: null,
        mensaje: "Producto sin código, se omitió",
      });
      continue;
    }

    try {
      const productoEnDB = await Articulo.findOne({ codigo });

      if (productoEnDB) {
        productoEnDB.precio = parseFloat(producto.PRECIOVENTA) || 0;
        await productoEnDB.save();

        resultados.push({
          codigo,
          mensaje: "Precio actualizado",
          producto: {
            descripcion: productoEnDB.descripcion,
            precio: productoEnDB.precio,
          },
        });
      } else {
        resultados.push({
          codigo,
          mensaje: "Producto no encontrado en la base de datos",
        });
      }
    } catch (error) {
      console.error(`Error al actualizar el producto con código ${codigo}:`, error);
      resultados.push({
        codigo,
        mensaje: "Error al actualizar el producto",
        error: error.message,
      });
    }
  }

  res.status(200).json({
    message: "Actualización de precios completada",
    data: resultados,
  });
};





// ENDPOINT PARA ACTUALIZAR PRECIOS DE ARTICULOS POR EXCEL SEGUN CODIGO DEL SISTEMA (NUEVO) A MI WEB PEDIDOS
// LOS CODIGOS ESTAN CASI SINCRONIZADOS CON MI WEB, cambian algunos que no hay stock

export const ActualizarPreciosExcelPorCodigo = async (req, res) => {
  const formDataExcel = req.file;

  if (!formDataExcel) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  try {
    // Leer el archivo Excel
    const workbook = xlsx.readFile(formDataExcel.path);
    const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Mapear datos desde el Excel sistema viejo
    // const productos = data.map(item => ({
    //   codigo: item.CODIGO?.toString().trim() || "",
    //   descripcion: item.DETALLE?.toString().trim() || "",
    //   precioVenta: parseFloat(item["PRECIO VENTA"]) || 0,
    // }));

    // Mapear datos desde el Excel sistema nuevo
    const productos = data.map(item => ({
      codigo: item["*Codigo"]?.toString().trim() || "",
      descripcion: item["*Descripcion"]?.toString().trim() || "",
      precioVenta: parseFloat(item["*Precio de Venta"]) || 0,
    }));

    const resultados = [];

    for (const producto of productos) {
      if (!producto.codigo) {
        resultados.push({
          codigo: null,
          mensaje: "Producto sin código, se omitió",
        });
        continue;
      }

      try {
        const productoEnDB = await Articulo.findOne({ codigo: producto.codigo });

        if (productoEnDB) {
          productoEnDB.precio = producto.precioVenta;
          await productoEnDB.save();

          resultados.push({
            codigo: producto.codigo,
            mensaje: "Precio actualizado",
            producto: {
              descripcion: productoEnDB.descripcion,
              precio: productoEnDB.precio,
            },
          });
        } else {
          resultados.push({
            codigo: producto.codigo,
            mensaje: "Producto no encontrado en la base de datos",
          });
        }
      } catch (error) {
        console.error(`Error al actualizar el producto con código ${producto.codigo}:`, error);
        resultados.push({
          codigo: producto.codigo,
          mensaje: "Error al actualizar el producto",
          error: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Actualización de precios completada",
      data: resultados,
    });

  } catch (error) {
    console.error("Error al procesar el archivo Excel:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// CALCULAR PRECIO EN BASE A FRACCION
export const CalcularPrecioArticulo = async (req, res) => {
  try {

    const { precioBase, fraccion, cantidad } = req.body;

    // Validaciones básicas
    if (
      precioBase === undefined ||
      fraccion === undefined ||
      cantidad === undefined
    ) {
      return res.status(400).json({
        res: false,
        error: "Debe enviar precioBase, fraccion y cantidad en el cuerpo de la petición",
      });
    }

    const base = parseFloat(precioBase);
    const frac = parseFloat(fraccion);
    const cant = parseFloat(cantidad);

    if (isNaN(base) || isNaN(frac) || isNaN(cant)) {
      return res.status(400).json({
        res: false,
        error: "Los valores deben ser numéricos",
      });
    }

    // Cálculo
    const precioPorFraccion = base * frac;
    const precioTotal = precioPorFraccion * cant;

    // Respuesta
    res.json({
      res: true,
      data: {
        precioBase: base,
        fraccion: frac,
        cantidad: cant,
        precioUnitarioSegunFraccion: precioPorFraccion.toFixed(2),
        precioTotal: precioTotal.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error en CalcularPrecioArticulo:", error);
    res.status(500).json({
      res: false,
      error: "Error interno del servidor",
    });
  }
};




// ENDPOINT PARA ACTUALIZAR STOCK DE ARTICULOS POR EXCEL SEGUN CODIGO DEL SISTEMA (NUEVO) A MI WEB PEDIDOS
export const ActualizarStockExcelPorCodigo = async (req, res) => {
  const formDataExcel = req.file;

  if (!formDataExcel) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  try {
    // Leer el archivo Excel
    const workbook = xlsx.readFile(formDataExcel.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Mapear datos desde el Excel
    const productos = data.map(item => ({
      codigo: item["Codigo"]?.toString().trim() || "",
      stock: parseFloat(item["Stock_Fisico"]) || 0,
    }));

    const resultados = [];

    for (const producto of productos) {
      if (!producto.codigo) {
        resultados.push({
          codigo: null,
          mensaje: "Producto sin código, se omitió",
        });
        continue;
      }

      try {
        const productoEnDB = await Articulo.findOne({ codigo: producto.codigo });

        if (productoEnDB) {
          productoEnDB.stock = producto.stock;
          await productoEnDB.save();

          resultados.push({
            codigo: producto.codigo,
            mensaje: "Stock actualizado",
            producto: {
              descripcion: productoEnDB.descripcion,
              stock: productoEnDB.stock,
            },
          });
        } else {
          resultados.push({
            codigo: producto.codigo,
            mensaje: "Producto no encontrado en la base de datos",
          });
        }
      } catch (error) {
        console.error(
          `Error al actualizar el stock del producto con código ${producto.codigo}:`,
          error
        );
        resultados.push({
          codigo: producto.codigo,
          mensaje: "Error al actualizar el stock",
          error: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Actualización de stock completada",
      data: resultados,
    });

  } catch (error) {
    console.error("Error al procesar el archivo Excel:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};







// ENDPOINT  PARA MIGRAR CODIGOS DE NUEVO SISTEMA A MI BD

export const Migracion = async (req, res) => {
  console.log("Iniciando migración de códigos...");
  const archivoExcel = req.file;

  if (!archivoExcel) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  try {
    // Leer Excel
    const workbook = xlsx.readFile(archivoExcel.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const resultados = [];

    for (const fila of data) {
      const codigoBarra = fila["Codigo de Barras"]?.toString().trim();
      const nuevoCodigo = fila["*Codigo"]?.toString().trim();

      if (!codigoBarra || !nuevoCodigo) {
        resultados.push({
          codigoBarra: codigoBarra || null,
          mensaje: "Fila incompleta, se omitió",
        });
        continue;
      }

      try {
        const articulo = await Articulo.findOne({ codigo: codigoBarra });

        if (!articulo) {
          resultados.push({
            codigoBarra,
            mensaje: "Artículo no encontrado en la base de datos",
          });
          continue;
        }

        // Actualizar código
        articulo.codigo = nuevoCodigo;
        await articulo.save();

        resultados.push({
          codigoBarra,
          nuevoCodigo,
          mensaje: "Código actualizado correctamente",
          articulo: {
            descripcion: articulo.descripcion,
            codigoAnterior: codigoBarra,
            codigoActual: nuevoCodigo,
          },
        });

      } catch (error) {
        console.error(`Error con código de barras ${codigoBarra}:`, error);
        resultados.push({
          codigoBarra,
          mensaje: "Error al actualizar el artículo",
          error: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Actualización de códigos completada",
      totalProcesados: data.length,
      resultados,
    });

  } catch (error) {
    console.error("Error al procesar el Excel:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }

};



// GET GRUPOS FAMILIAS
export const GetGruposFamilias = async (req, res) => {
  try {
    const grupos = await GrupoFamilia.find().sort({ descripcion: 1 });
    res.json(grupos);
  } catch (error) {
    console.error("Error fetching grupos familias:", error);
    res.status(500).json({ message: "Error fetching grupos familias" });
  }
};

// ASIGNAR GRUPO A FAMILIAS
export const AsignarGrupoAFamilias = async (req, res) => {
  try {
    const { grupoId, familiasIds } = req.body;

    if (!grupoId) {
      return res.status(400).json({ message: "El ID del grupo es requerido" });
    }

    // Actualizar las familias seleccionadas con el nuevo grupoId
    await Familia.updateMany(
      { _id: { $in: familiasIds } },
      { $set: { grupoId: grupoId } }
    );

    res.status(200).json({ message: "Grupo asignado exitosamente a las familias seleccionadas", res: true });
  } catch (error) {
    console.error("Error asignando grupo a familias:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
