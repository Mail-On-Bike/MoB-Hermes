const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models/index");
const User = db.user;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) return res.status(403).json({ message: "¡Falta el token!" });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Usuario no válido", err });
      }

      req.userId = decoded.data.id;
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "No autorizado" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "administrador") {
        next();
        return;
      }
    }
    return res
      .status(403)
      .json({ message: "¡Requiere el rol de Administrador!" });
  } catch (error) {
    console.error(error, "¡Requiere el rol de Administrador!");
  }
};

const isOperador = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "operador") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "¡Requiere el rol de Operador!" });
  } catch (error) {
    console.error(error, "¡Requiere el rol de Operador!");
  }
};

const isAuditor = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "auditor") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "¡Requiere el rol de Auditor!" });
  } catch (error) {
    console.error(error, "¡Requiere el rol de Auditor!");
  }
};

const isEquipoAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "administrador") {
        next();
        return;
      }
      if (roles[i].name === "operador") {
        next();
        return;
      }
      if (roles[i].name === "auditor") {
        next();
        return;
      }
    }
    return res
      .status(403)
      .json({ message: "¡Requiere el rol de Administrador!" });
  } catch (error) {
    console.error(error, "¡Requiere el rol de Administrador!");
  }
};

const isCliente = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "administrador") {
        next();
        return;
      }
      if (roles[i].name === "cliente") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "¡Requiere el rol de Cliente!" });
  } catch (error) {
    console.error(error, "¡Requiere el rol de Cliente!");
  }
};

const isMobiker = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "administrador") {
        next();
        return;
      }
      if (roles[i].name === "mobiker") {
        next();
        return;
      }
    }

    return res.status(403).json({ message: "¡Requiere el rol de MoBiker!" });
  } catch (error) {
    console.error(error, "¡Requiere el rol de MoBiker!");
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isOperador: isOperador,
  isAuditor: isAuditor,
  isEquipoAdmin: isEquipoAdmin,
  isCliente: isCliente,
  isMobiker: isMobiker,
};
module.exports = authJwt;
