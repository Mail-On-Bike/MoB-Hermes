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
const bcrypt = require("bcryptjs");

module.exports = {
  // Login
  signinCliente: async (req, res) => {
    try {
      // Buscando al usuario
      const user = await UserCliente.findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }

      // Comprobando la password
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "¡Usuario o contraseña inválida!",
        });
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
        telefono: user.telefono,
        accessToken: token,
        message: "Inicio de sesión correcto",
        clienteAsignado,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Editar usuario
  updateUserCliente: async (req, res) => {
    try {
      console.log(req.body)
      const id = req.params.id;

      const user = {
        contacto: req.body.contacto,
        username: req.body.username,
        email: req.body.email,
        telefono: req.body.telefono,
        clienteId: req.body.clienteId
      };

      const actualizarUser = await UserCliente.update(user, { where: { id } });
      console.log(actualizarUser)
      if (actualizarUser) {

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
          id,
          contacto: user.contacto,
          username: user.username,
          email: user.email,
          telefono: user.telefono,
          accessToken: token,
          message: "Usuario actualizado correctamente",
          clienteAsignado,
        });

      } else {
        res.json({
          message: "¡Error! No se ha podido actualizar el usuario...",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cambiar contraseña
  changePasswordUserCliente: async (req, res) => {
    try {
      const id = req.params.id;

      const user = await UserCliente.findByPk(id);

      const oldPassword = bcrypt.compareSync(
        req.body.oldPassword,
        user.password
      );

      if (!oldPassword) {
        return res.status(401).send({
          message: "¡Contraseña inválida!",
        });
      }

      let passwordActualizada = await UserCliente.update(
        {
          password: bcrypt.hashSync(req.body.newPassword, 10),
        },
        { where: { id } }
      );

      if (passwordActualizada) {
        res.status(200).json({
          message: "¡Tu contraseña fue actualizada satisfactoriamente!",
        });
      } else {
        res.json({
          message: "¡Error! No se ha podido actualizar tu contraseña...",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
