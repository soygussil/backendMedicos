import Medico from "../models/Medico.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarId.js";

const registrar = async (req, res) => {
  const { email } = req.body;
  // prevenir usuarios duplicados
  const existeUsuario = await Medico.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado...");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //Guardar nuevo Medico
    const medico = new Medico(req.body);
    const medicoGuardado = await medico.save();
    res.json(medicoGuardado);
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { medico } = req;
  res.json({ perfil: medico });
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Medico.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente..." });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  //Comprobar si el usuario existe...
  const usuario = await Medico.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe...");
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar si el usuario si está confirmado.
  if (!usuario.confirmado) {
    const error = new Error("Tú cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //revisar password
  if (await usuario.comprobarPassword(password)) {
    //Autenticar
    res.json({ token: generarJWT(usuario.id) });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const existeMedico = await Medico.findOne({ email });
  if (!existeMedico) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeMedico.token = generarID();
    await existeMedico.save();
    res.json({ msg: "Hemos enviado un email con las instrucciones." });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Medico.findOne({ token });
  if (tokenValido) {
    // El token es válido, el usuario existe.
    res.json({ msg: "Token válido, el usuario existe." });
  } else {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const medico = await Medico.findOne({ token });
  if (!medico) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    medico.token = null;
    medico.password = password;
    await medico.save();
    res.json({ msg: "password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
};
