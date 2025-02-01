// import { Router } from "express";
import pkg from 'express';
import fs from 'fs';
const { Router } = pkg;
import {
  GetArticulos,
  GetArticulosCategoria,
  GetArticulosQuery,
  GetFamilias,
  EnviarCarritoWsp,
  ImportarArticulosExcel,
  ActualizarPreciosImportacionExcel,
  CreateArticulo,
  GetArticuloById,
  UpdateArticulo,
  DeleteArticulo,
} from "../controllers/articulos.controller.js";
import multer from 'multer';

const router = Router();

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/imports-excel')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + ".xlsx")
//   }
// })
// var uploadimage = multer({
//   storage: storage,
// })



// Configuración para archivos Excel
const excelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/imports-excel'); // Carpeta para archivos Excel
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".xlsx");
  },
});

const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return cb(new Error('Solo se permiten archivos .xlsx'));
    }
    cb(null, true);
  },
});

// Configuración para imágenes
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/images';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    cb(null, fileName);
    // cb(null, file.fieldname + '-' + file.originalname.match(/\..*$/)[0]);
  },
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: function (req, file, cb) {
    console.log("Archivo recibido en multer:", file); // Agregar log para verificar
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png)'));
    }
    cb(null, true);
  },
  // storage: imageStorage,
  // fileFilter: function (req, file, cb) {
  //   if (!file.mimetype.startsWith('image/')) {
  //     return cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png)'));
  //   }
  //   cb(null, true);
  // },
});


//--------------------------------   API PRO   --------------------------------

router.get("/articulos/getArticulos", GetArticulos);

router.get("/articulos/getArticulosPorCategoria", GetArticulosCategoria);

router.get("/articulos/getArticulosQuery", GetArticulosQuery);

router.get("/articulos/getFamilias", GetFamilias);

router.post("/articulos/enviarCarritoWsp", EnviarCarritoWsp);

router.post("/articulos/importar-articulos-excel", uploadExcel.single("file"), ImportarArticulosExcel);

router.post("/articulos/update-precios-importar-excel", uploadExcel.single("file"), ActualizarPreciosImportacionExcel);



// CRUD
router.post("/articulos/nuevo-articulo", uploadImage.single("file"), CreateArticulo);

router.get("/articulos/get-articulo-id", GetArticuloById);

router.post("/articulos/editar-articulo", uploadImage.single("file"), UpdateArticulo);

router.delete("/articulos/eliminar-articulo/:id", DeleteArticulo);

export default router;




// router.get("/articulos/articulosListado/", renderArticulos);

// // ADMIN ARTICULOS
// // LIST
// router.get("/articulos/administracionArticulos", isAuthenticated, renderAdminArticulos);
// // ALTA GET
// router.get("/articulos/altaArticulo", isAuthenticated, renderArticuloForm);
// // ALTA POST
// router.post("/articulos/nuevoArticulo", isAuthenticated, uploadimage.any(), nuevoArticulo);
// // EDICION GET
// router.get("/articulos/editarArticulo/:id", isAuthenticated, renderEditarArticuloForm);
// // EDICION PUT
// router.put("/articulos/editarArticulo/:id", isAuthenticated, editarArticulo);
// // ELIMINAR
// router.delete("/articulos/eliminarArticulo/:id", isAuthenticated, eliminarArticulo);


