import express from "express";
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
} from "../controllers/medicoController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//Rutas publicas
router.post("/", registrar);

router.get("/confirmar/:token", confirmar);

router.post("/login", autenticar);

router.post("/olvide-password", olvidePassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//rutas privadas

router.get("/perfil", checkAuth, perfil);

export default router;
