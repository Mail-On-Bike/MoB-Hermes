const db = require("../models/index");
const Mobiker = db.mobiker;
const Distrito = db.distrito;
const Rango = db.rango;
const Pedido = db.pedido;
const Cliente = db.cliente;
const Envio = db.envio;
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
  storageMobiker: async (req, res) => {
    try {
      const mobiker = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        telegram: req.body.telegram,
        direccion: req.body.direccion,
        tipoDocumento: req.body.tipoDocumento,
        numeroDocumento: req.body.numeroDocumento,
        email: req.body.email,
        genero: req.body.genero,
        banco: req.body.banco,
        tipoCuenta: req.body.tipoCuenta,
        numeroCuentaBancaria: req.body.numeroCuentaBancaria,
        equipo: req.body.equipo,
        tipoBicicleta: req.body.tipoBicicleta,
        fechaNacimiento: req.body.fechaNacimiento,
        fechaIngreso: req.body.fechaIngreso,
        status: req.body.status,
      };

      mobiker.fullName = `${req.body.nombres.split(" ")[0]} ${
        req.body.apellidos.split(" ")[0]
      }`;

      let distrito = await Distrito.findOne({
        where: {
          distrito: req.body.distrito,
        },
      });

      let rangoInicial = await Rango.findOne({
        where: {
          rangoMoBiker: req.body.rango,
        },
      });

      if (distrito && rangoInicial) {
        try {
          let nuevoMobiker = await Mobiker.create(mobiker);

          await nuevoMobiker.setDistrito(distrito);
          await nuevoMobiker.setRango(rangoInicial);

          res.json({ message: "¡Se ha creado el MoBiker con éxito!" });
        } catch (err) {
          res.status(500).send({ message: err.message });
        }
      } else {
        res.json({ message: "¡Error! No se ha podido crear el mobiker..." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Mostrar todos los MoBikers
  equipoMobiker: async (req, res) => {
    try {
      let mobikers = await Mobiker.findAll({
        order: [["fullName", "ASC"]],
        include: [
          {
            model: Distrito,
          },
          {
            model: Rango,
          },
        ],
      });

      res.json(mobikers);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Mostrar todos los MoBikers
  filterMobiker: async (req, res) => {
    try {
      const { status } = req.query;

      let mobikers = await Mobiker.findAll({
        where: { status },
        order: [["fullName", "ASC"]],
        include: [
          {
            model: Distrito,
          },
          {
            model: Rango,
          },
        ],
      });

      res.json(mobikers);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Mostrar 1 MoBiker por id
  getMobikerById: async (req, res) => {
    try {
      const id = req.params.id;

      let mobiker = await Mobiker.findByPk(id, {
        include: [
          {
            model: Distrito,
          },
          {
            model: Rango,
          },
        ],
      });

      if (!mobiker) {
        res.status(404).json({ msg: "No se ha encontrado el MoBiker" });
      } else {
        res.json(mobiker);
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  getPedidosDelMobiker: async (req, res) => {
    try {
      let { desde, hasta, id, page, size } = req.query;
      const condition = {
        [Op.and]: [
          { mobikerId: id },
          { statusId: { [Op.between]: [4, 5] } },
          { fecha: { [Op.between]: [desde, hasta] } },
        ],
      };
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

  getPedidosDelMobikerById: async (req, res) => {
    try {
      let id = req.params.id;
      const condition = {
        mobikerId: id,
      };

      let pedidosDelMobikerById = await Pedido.findAll({
        order: [["id", "DESC"]],
        where: condition,
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

      res.json(pedidosDelMobikerById);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  getCantidadPedidosMobiker: async (req, res) => {
    try {
      let { desde, hasta, mobikerId } = req.query;
      const condition = {
        [Op.and]: [
          { mobikerId: mobikerId },
          { statusId: { [Op.between]: [4, 5] } },
          { fecha: { [Op.between]: [desde, hasta] } },
        ],
      };

      let cantidadPedidos = await Pedido.count({ where: condition });

      res.json(cantidadPedidos);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  getMobikerConPedidos: async (req, res) => {
    try {
      const { desde, hasta } = req.query;

      const condition = {
        [Op.and]: [
          { statusId: { [Op.between]: [2, 5] } },
          { fecha: { [Op.between]: [desde, hasta] } },
        ],
      };
      // Array de control para que no se repitan los MoBikers
      let mobikersRepetidos = [];

      let mobikersConPedidos = [];
      let mobikerConPedidos = {};

      const pedidos = await Pedido.findAll({
        where: condition,
        order: [["id", "DESC"]],
      });

      for (pedido of pedidos) {
        let mobiker = await Mobiker.findOne({
          where: { id: pedido.mobikerId },
          include: [
            {
              model: Distrito,
            },
            {
              model: Rango,
            },
          ],
        });

        if (!mobikersRepetidos.includes(mobiker.id)) {
          let cantidadPedidos = await Pedido.sum("viajes", {
            where: { mobikerId: mobiker.id },
          });

          if (cantidadPedidos > 0) {
            mobikerConPedidos = {
              mobiker,
              cantidadPedidos,
            };

            mobikersConPedidos.push(mobikerConPedidos);
          }

          mobikersRepetidos.push(mobiker.id);
        }
      }

      res.json(mobikersConPedidos);
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  },

  // Editar MoBiker
  updateMobiker: async (req, res) => {
    try {
      const id = req.params.id;

      let distrito = await Distrito.findOne({
        where: {
          distrito: req.body.distrito,
        },
      });

      let rangoInicial = await Rango.findOne({
        where: {
          rangoMoBiker: req.body.rango,
        },
      });

      let mobiker = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        telegram: req.body.telegram,
        direccion: req.body.direccion,
        distritoId: distrito.id,
        tipoDocumento: req.body.tipoDocumento,
        numeroDocumento: req.body.numeroDocumento,
        email: req.body.email,
        genero: req.body.genero,
        banco: req.body.banco,
        tipoCuenta: req.body.tipoCuenta,
        numeroCuentaBancaria: req.body.numeroCuentaBancaria,
        rangoId: rangoInicial.id,
        equipo: req.body.equipo,
        tipoBicicleta: req.body.tipoBicicleta,
        fechaNacimiento: req.body.fechaNacimiento,
        fechaIngreso: req.body.fechaIngreso,
        status: req.body.status,
      };

      mobiker.fullName = `${req.body.nombres.split(" ")[0]} ${
        req.body.apellidos.split(" ")[0]
      }`;

      let mobikerActualizado = await Mobiker.update(mobiker, {
        where: {
          id: id,
        },
      });

      if (mobikerActualizado) {
        res.json({ message: "¡Se ha actualizado el MoBiker con éxito!" });
      } else {
        res.json({
          message: "¡Error! No se ha podido actualizar el mobiker...",
        });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  searchMobiker: async (req, res) => {
    try {
      const query = req.query.q;

      let mobiker = await Mobiker.findAll({
        order: [["fullName", "ASC"]],
        where: {
          fullName: { [Op.like]: `%${query}%` },
        },
        limit: 100,
        include: [
          {
            model: Distrito,
          },
          {
            model: Rango,
          },
        ],
      });

      res.json(mobiker);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  getCountMobikersByStatus: async (req, res) => {
    try {
      const activos = await Mobiker.count({ where: { status: "Activo" } });
      const inactivos = await Mobiker.count({
        where: { status: "Inactivo" },
      });
      const retirados = await Mobiker.count({
        where: { status: "Retirado" },
      });

      const mobikers = {
        activos,
        inactivos,
        retirados,
      };

      res.json(mobikers);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
