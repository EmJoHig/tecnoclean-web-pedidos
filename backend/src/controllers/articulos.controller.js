import Articulo from "../models/Articulo.js";
import Familia from "../models/Familia.js";
import Fragancia from "../models/Fragancia.js";
// import multer from "multer";
import fs from "fs";
// import express from 'express';
// import { type } from "os";
import * as XLSX from "xlsx"; // Cambia esto

import whatsapp from "../libs/whatsapp.js";

// const app = express();
// app.use(express.json());


//--------------------------- API PRO ------------------------------

export const GetArticulos = async (req, res) => {

  let searchOptions = {};
  let familia = req.query.familia;
  let articulos = null;

  articulos = await Articulo.find().sort({ descripcion: 1 }).populate("familiaArticulo", "descripcion").lean();

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
  const limit = 10;  // Número de artículos a cargar por cada solicitud
  const offset = req.query.offset || 0;  // El offset (a partir de qué artículo cargar)

  let searchOptions = {};

  // articulos con stock mayor a cero
  searchOptions.stock = { $gt: 0 };

  let articulos = null;

  if (checkedCategorys != undefined && checkedCategorys.length > 0) {
    searchOptions.familiaArticulo = { $in: checkedCategorys };

    articulos = await Articulo.find(searchOptions)
      .skip(offset)
      .limit(limit)
      .lean();
  } else {
    // Si no hay categorías seleccionadas, cargar todos los artículos con paginación
    articulos = await Articulo.find({ stock: { $gt: 0 } })
      .skip(offset)
      .limit(limit)
      .lean();
  }


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
    const familias = await Familia.find();
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
    const familias = await Familia.find();

    const familiasConArticulos = [];

    if(familias != null && familias.length > 0) {
      for (const familia of familias) {
        const count = await Articulo.countDocuments({ familiaArticulo: familia._id });
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

    const articulos = await Articulo.find({
      descripcion: { $regex: query, $options: "i" }, // 'i' para que no sea sensible a mayúsculas/minúsculas
    });

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
    mensaje += "\n";
  });

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


export const EnviarCarritoWsp = async (req, res) => {
  try {
    const { bodyCarritoUsuario } = req.body;
    const mensajeWSP = generarMensaje(bodyCarritoUsuario);
    const tel = '+542215937093'
    const chatId = tel.substring(1) + "@c.us";

    const number_details = await whatsapp.getNumberId(chatId);

    if (number_details) {

      enviarMensaje(chatId, mensajeWSP)
        .then((respuesta) => {
          //console.log(respuesta);
          res.json({ mensaje: respuesta, res: true });
        })
        .catch((error) => {
          //console.error(error);
          res.status(500).json({ res: false, error: error.message || error });
        });
    } else {
      res.json({ res: false })
    }
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




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