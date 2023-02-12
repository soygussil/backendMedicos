import express from "express";
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
} from "../controllers/medicoController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//Rutas publicas
router.post("/", registrar);

router.get("/confirmar/:token", confirmar);

router.post("/login", autenticar);

//rutas privadas

router.get("/perfil", checkAuth, perfil);

export default router;
