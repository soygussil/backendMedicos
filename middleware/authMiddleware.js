import jwt from "jsonwebtoken";
const checkAuth = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
    } catch (error) {
      const e = new Error("Token no válido");
      res.status(403).json({ msg: e.message });
    }
  }

  const error = new Error("Token no válido o inexistente");
  res.status(403).json({ msg: error.message });
  next();
};
export default checkAuth;
