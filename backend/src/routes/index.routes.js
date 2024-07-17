// import { Router } from "express";
import pkg from 'express';
const { Router } = pkg;
import { renderIndex, renderAbout, busquedaArticulos, busquedaCategoriaArticulos, renderModalArticulo } from "../controllers/index.controller.js";

const router = Router();

router.get("/", renderIndex);
router.get("/about", renderAbout);

router.get("/busquedaArticulos", busquedaArticulos);

router.get("/busquedaArticulosCategoria", busquedaCategoriaArticulos);

router.get("/articulosmodal/:codigo", renderModalArticulo);


export default router;
