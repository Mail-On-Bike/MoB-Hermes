const db = require("../models/index");
const Cliente = db.cliente;
const Distrito = db.distrito;
const Mobiker = db.mobiker;
const Pedido = db.pedido;
const Comprobante = db.comprobante;
const RolCliente = db.rolCliente;
const Carga = db.carga;
const Envio = db.envio;
const FormaDePago = db.formaDePago;
const Modalidad = db.modalidad;
const Status = db.status;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 50;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalPedidos, rows: pedidos } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalPedidos / limit);

  return { totalPedidos, pedidos, totalPages, currentPage };
};

module.exports = {
  storageCliente: async (req, res) => {
    try {
      let cliente = {
        contacto: req.body.contacto,
        razonSocial: req.body.razonSocial,
        razonComercial: req.body.razonComercial,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        otroDato: req.body.otroDato,
        email: req.body.email,
        ruc: req.body.ruc,
      };

      let distrito = await Distrito.findOne({
        where: {
          distrito: req.body.distrito,
        },
      });

      let comprobante = await Comprobante.findOne({
        where: {
          tipo: req.body.comprobante,
        },
      });

      let rolDelCliente = await RolCliente.findOne({
        where: {
          rol: req.body.rol,
        },
      });

      let tipoEnvio = await Envio.findOne({
        where: {
          tipo: req.body.tipoEnvio,
        },
      });

      let tipoDeCarga = await Carga.findOne({
        where: {
          tipo: req.body.carga,
        },
      });

      let pago = await FormaDePago.findOne({
        where: {
          pago: req.body.pago,
        },
      });

      if (distrito && comprobante && rolDelCliente && tipoDeCarga && pago) {
        try {
          let nuevoCliente = await Cliente.create(cliente);

          await nuevoCliente.setDistrito(distrito);
          await nuevoCliente.setTipoDeComprobante(comprobante);
          await nuevoCliente.setRolCliente(rolDelCliente);
          await nuevoCliente.setTipoDeCarga(tipoDeCarga);
          await nuevoCliente.setFormaDePago(pago);
          await nuevoCliente.setTipoDeEnvio(tipoEnvio);

          res.json({ message: "¡Se ha creado el Cliente con éxito!" });
        } catch (err) {
          res.status(500).send({ message: err.message });
        }
      } else {
        res.json({ message: "¡Error! No se ha podido crear el cliente..." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Mostrar todos los Clientes
  indexClientes: async (req, res) => {
    try {
      let clientes = await Cliente.findAll({
        order: [
          ["biciEnvios", "DESC"],
          ["razonComercial", "ASC"],
        ],
        limit: 30,
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
      res.json(clientes);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Obtener los Clientes que tengan Pedidos para Facturarlos en un rango de fechas
  getClientesConPedidos: async (req, res) => {
    try {
      const { desde, hasta } = req.query;

      const condition = {
        [Op.and]: [
          { statusId: { [Op.between]: [1, 5] } },
          { fecha: { [Op.between]: [desde, hasta] } },
        ],
      };
      let clientesConPedidos = [];
      let clienteConPedidos = {};

      const clientes = await Cliente.findAll({
        order: [
          ["biciEnvios", "DESC"],
          ["razonComercial", "ASC"],
        ],
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

      for (let cliente of clientes) {
        let cantidadPedidos = await Pedido.count({
          where: { [Op.and]: [{ clienteId: cliente.id }, condition] },
        });

        if (cantidadPedidos !== 0) {
          clienteConPedidos = {
            cliente,
            cantidadPedidos: cantidadPedidos,
          };

          clientesConPedidos.push(clienteConPedidos);
        }
      }

      res.json(clientesConPedidos);
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  },

  // Obtener un Cliente por su Id
  getClienteById: async (req, res) => {
    try {
      const id = req.params.id;

      let dataCliente = await Cliente.findByPk(id, {
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

      if (!dataCliente) {
        res.status(404).json({ msg: "No se ha encontrado el Cliente" });
      } else {
        res.json(dataCliente);
      }
    } catch (error) {
      res.status(500).send({
        message: `Error, no se encontró el cliente con el id: ${id}`,
      });
    }
  },

  // Obtener todos los Pedidos del Cliente por Id usando paginación. Rango de fechas es opcional
  getPedidosDelCliente: async (req, res) => {
    try {
      let { desde, hasta, id, page, size } = req.query;
      let condition;

      console.log(req.query);

      if (desde && hasta) {
        condition = {
          [Op.and]: [
            { clienteId: id },
            { statusId: { [Op.between]: [1, 6] } },
            { fecha: { [Op.between]: [desde, hasta] } },
          ],
        };
      } else {
        condition = {
          [Op.and]: [{ clienteId: id }, { statusId: { [Op.between]: [1, 6] } }],
        };
      }

      const { limit, offset } = getPagination(page, size);

      let data = await Pedido.findAndCountAll({
        order: [["id", "DESC"]],
        where: condition,
        limit,
        offset,
        include: [
          {
            model: Distrito,
          },
          {
            model: Mobiker,
            attributes: ["fullName"],
          },
          {
            model: Cliente,
            attributes: ["contacto", "razonComercial"],
          },
          {
            model: Envio,
          },
          {
            model: Modalidad,
          },
          {
            model: Status,
          },
        ],
      });

      const pedidosDelMobiker = getPagingData(data, page, limit);

      res.json(pedidosDelMobiker);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Obtener los Pedidos del Cliente por su Id
  getPedidosDelClienteById: async (req, res) => {
    try {
      const id = req.params.id;

      let pedidosDelCliente = await Pedido.findAll({
        order: [["id", "DESC"]],
        where: {
          [Op.and]: [{ clienteId: id }, { statusId: { [Op.between]: [1, 5] } }],
        },
        include: [
          {
            model: Distrito,
          },
          {
            model: Mobiker,
            attributes: ["fullName"],
          },
          {
            model: Cliente,
            attributes: ["contacto", "razonComercial"],
          },
          {
            model: Envio,
          },
          {
            model: Modalidad,
          },
          {
            model: Status,
          },
        ],
      });

      res.json(pedidosDelCliente);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Editar / Actualizar un Cliente
  updateCliente: async (req, res) => {
    try {
      const id = req.params.id;

      let distrito = await Distrito.findOne({
        where: {
          distrito: req.body.distrito,
        },
      });

      let comprobante = await Comprobante.findOne({
        where: {
          tipo: req.body.comprobante,
        },
      });

      let rolDelCliente = await RolCliente.findOne({
        where: {
          rol: req.body.rol,
        },
      });

      let tipoEnvio = await Envio.findOne({
        where: {
          tipo: req.body.tipoEnvio,
        },
      });

      let tipoDeCarga = await Carga.findOne({
        where: {
          tipo: req.body.carga,
        },
      });

      let pago = await FormaDePago.findOne({
        where: {
          pago: req.body.pago,
        },
      });

      let cliente = {
        contacto: req.body.contacto,
        razonSocial: req.body.razonSocial,
        razonComercial: req.body.razonComercial,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        otroDato: req.body.otroDato,
        email: req.body.email,
        ruc: req.body.ruc,
        distritoId: distrito.id,
        tipoDeComprobanteId: comprobante.id,
        rolClienteId: rolDelCliente.id,
        tipoDeCargaId: tipoDeCarga.id,
        formaDePagoId: pago.id,
        tipoDeEnvioId: tipoEnvio.id,
      };

      let clienteActualizado = await Cliente.update(cliente, {
        where: { id: id },
      });

      if (clienteActualizado) {
        res.json({ message: "¡Se ha actualizado el Cliente con éxito!" });
      } else {
        res.json({
          message: "¡Error! No se ha podido actualizar el cliente...",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Buscar cliente por nombre o empresa
  searchCliente: async (req, res) => {
    try {
      const query = req.query.q;

      let cliente = await Cliente.findAll({
        order: [["razonComercial", "ASC"]],
        where: {
          [Op.or]: [
            { contacto: { [Op.like]: `%${query}%` } },
            { razonComercial: { [Op.like]: `%${query}%` } },
            { razonSocial: { [Op.like]: `%${query}%` } },
          ],
        },
        limit: 10,
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

      res.json(cliente);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
};
