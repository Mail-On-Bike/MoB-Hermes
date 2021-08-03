const db = require("../models/index");
const config = require("../config/auth.config");
const UserCliente = db.userCliente;
const Cliente = db.cliente;
const Distrito = db.distrito;
const Comprobante = db.comprobante;
const RolCliente = db.rolCliente;
const Carga = db.carga;
const Envio = db.envio;
const FormaDePago = db.formaDePago;

const jwt = require("jsonwebtoken");

module.exports = {
  // Login
  signinCliente: async (req, res) => {
    try {
      // Buscando al usuario
      const user = await UserCliente.findOne({
        where: { username: req.body.username },
      });
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }

      const clienteAsignado = await Cliente.findOne({
        where: { id: user.clienteId },
        include: [
          {
            model: Distrito,
          },
          {
            model: Comprobante,
          },
          {
            model: RolCliente,
          },
          {
            model: Carga,
          },
          {
            model: FormaDePago,
          },
          {
            model: Envio,
          },
        ],
      });

      // Creando el token
      const token = jwt.sign({ data: user }, config.secret, {
        expiresIn: 2592000, // 30 días
      });

      // Enviando el accessToken
      res.status(200).json({
        id: user.id,
        contacto: user.contacto,
        username: user.username,
        email: user.email,
        accessToken: token,
        message: "Inicio de sesión correcto",
        clienteAsignado,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
