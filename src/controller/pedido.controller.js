const db = require("../models/index");
const Pedido = db.pedido;
const Distrito = db.distrito;
const Mobiker = db.mobiker;
const Cliente = db.cliente;
const Envio = db.envio;
const Modalidad = db.modalidad;
const Status = db.status;
const User = db.user;
const Rango = db.rango;

const Ruteo = db.ruteo;

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
  storagePedido: async (req, res) => {
    try {
      let pedido = {
        fecha: req.body.fecha,
        contactoRemitente: req.body.contactoRemitente,
        empresaRemitente: req.body.empresaRemitente,
        direccionRemitente: req.body.direccionRemitente,
        distritoRemitente: req.body.distritoRemitente,
        telefonoRemitente: req.body.telefonoRemitente,
        otroDatoRemitente: req.body.otroDatoRemitente,
        contactoConsignado: req.body.contactoConsignado,
        empresaConsignado: req.body.empresaConsignado,
        direccionConsignado: req.body.direccionConsignado,
        telefonoConsignado: req.body.telefonoConsignado,
        otroDatoConsignado: req.body.otroDatoConsignado,
        tipoCarga: req.body.tipoCarga,
        formaPago: req.body.formaPago,
        tarifa: req.body.tarifa,
        tarifaSugerida: req.body.tarifaSugerida,
        recaudo: req.body.recaudo,
        tramite: req.body.tramite,
        comision: req.body.comision,
        distancia: req.body.distancia,
        CO2Ahorrado: req.body.CO2Ahorrado,
        ruido: req.body.ruido,
        status: req.body.status,
        compensado: req.body.compensado,
        facturado: req.body.facturado,
        rolCliente: req.body.rolCliente,
        viajes: req.body.viajes,
        isRuteo: req.body.isRuteo,
        ruteo: req.body.ruteo,
      };

      let distritoPedido = await Distrito.findOne({
        where: {
          distrito: { [Op.like]: `%${req.body.distritoConsignado}%` },
        },
      });

      let mobiker = await Mobiker.findOne({
        where: {
          fullName: req.body.mobiker,
        },
      });
      let tipoEnvio = await Envio.findOne({
        where: {
          tipo: req.body.tipoEnvio,
        },
      });

      let modalidadPedido = await Modalidad.findOne({
        where: {
          tipo: req.body.modalidad,
        },
      });

      let clienteAsignado = await Cliente.findOne({
        where: {
          razonComercial: req.body.empresaRemitente,
        },
      });

      let estadoPedido = await Status.findOne({
        where: {
          id: req.body.status,
        },
      });

      let operador = await User.findOne({
        where: {
          username: req.body.operador,
        },
      });

      if (
        distritoPedido &&
        mobiker &&
        tipoEnvio &&
        modalidadPedido &&
        clienteAsignado
      ) {
        try {
          let nuevoPedido = await Pedido.create(pedido);

          await nuevoPedido.setDistrito(distritoPedido);
          await nuevoPedido.setMobiker(mobiker);
          await nuevoPedido.setTipoDeEnvio(tipoEnvio);
          await nuevoPedido.setModalidad(modalidadPedido);
          await nuevoPedido.setCliente(clienteAsignado);
          await nuevoPedido.setStatus(estadoPedido);
          await nuevoPedido.setUser(operador);

          if (pedido.isRuteo === true) {
            await nuevoPedido.setRuteo(pedido.ruteo);
          }

          res
            .status(200)
            .json({ message: "¡Se ha creado el Pedido con éxito!" });

          // Asignar al MoBiker
          let cantidadPedidosDelMoBiker = await Pedido.sum("viajes", {
            where: {
              [Op.and]: [
                { mobikerId: mobiker.id },
                { statusId: { [Op.between]: [4, 5] } },
              ],
            },
          });

          let kilometrosAsignadosMobiker = await Pedido.sum("distancia", {
            where: {
              [Op.and]: [
                { mobikerId: mobiker.id },
                { statusId: { [Op.between]: [4, 5] } },
              ],
            },
          });

          let CO2AsignadosMobiker = await Pedido.sum("CO2Ahorrado", {
            where: {
              [Op.and]: [
                { mobikerId: mobiker.id },
                { statusId: { [Op.between]: [4, 5] } },
              ],
            },
          });

          let ruidoAsignadosMobiker = await Pedido.sum("ruido", {
            where: {
              [Op.and]: [
                { mobikerId: mobiker.id },
                { statusId: { [Op.between]: [4, 5] } },
              ],
            },
          });

          // Actualizando el Nivel MoB
          const mobikerConNuevoRango = await Mobiker.findOne({
            where: { id: mobiker.id },
            include: [
              {
                model: Rango,
              },
            ],
          });

          let nuevoRango = mobikerConNuevoRango.rango.rangoMoBiker;

          // Caso para subir a MoBiker
          if (
            cantidadPedidosDelMoBiker >= 100 &&
            mobikerConNuevoRango.rango.id !== 5 &&
            mobikerConNuevoRango.rango.id !== 6
          ) {
            nuevoRango = 2;
          }

          // Caso para subir a MoBiker Pro
          if (
            cantidadPedidosDelMoBiker >= 500 &&
            mobikerConNuevoRango.rango.id !== 5 &&
            mobikerConNuevoRango.rango.id !== 6
          ) {
            nuevoRango = 3;
          }

          // Caso para subir a MoBiker Élite
          if (
            cantidadPedidosDelMoBiker >= 1000 &&
            mobikerConNuevoRango.rango.id !== 5 &&
            mobikerConNuevoRango.rango.id !== 6
          ) {
            nuevoRango = 4;
          }

          await Mobiker.update(
            {
              biciEnvios: cantidadPedidosDelMoBiker,
              kilometros: kilometrosAsignadosMobiker,
              CO2Ahorrado: CO2AsignadosMobiker,
              ruido: ruidoAsignadosMobiker,
              rangoId: nuevoRango,
            },
            {
              where: { id: mobiker.id },
            }
          );

          // Asignar al Cliente
          let cantidadPedidosDelCliente = await Pedido.sum("viajes", {
            where: {
              [Op.and]: [
                { clienteId: clienteAsignado.id },
                { statusId: { [Op.between]: [1, 5] } },
              ],
            },
          });

          let kilometrosAsignados = await Pedido.sum("distancia", {
            where: {
              [Op.and]: [
                { clienteId: clienteAsignado.id },
                { statusId: { [Op.between]: [1, 5] } },
              ],
            },
          });

          let CO2Asignados = await Pedido.sum("CO2Ahorrado", {
            where: {
              [Op.and]: [
                { clienteId: clienteAsignado.id },
                { statusId: { [Op.between]: [1, 5] } },
              ],
            },
          });

          let ruidoAsignados = await Pedido.sum("ruido", {
            where: {
              [Op.and]: [
                { clienteId: clienteAsignado.id },
                { statusId: { [Op.between]: [1, 5] } },
              ],
            },
          });

          await Cliente.update(
            {
              biciEnvios: cantidadPedidosDelCliente,
              kilometros: kilometrosAsignados,
              CO2Ahorrado: CO2Asignados,
              ruido: ruidoAsignados,
            },
            {
              where: { id: clienteAsignado.id },
            }
          );
        } catch (err) {
          res.status(500).send({ message: err.message });
        }
      } else {
        res
          .status(500)
          .json({ message: "¡Error! No se ha podido crear el pedido..." });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Creando nuevo Ruteo en la Tabla Ruteo
  newRuteo: async (req, res) => {
    try {
      const ruta = await Ruteo.create();

      res.json(ruta);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Mostrar todos los Pedidos por la fecha
  indexPedidos: async (req, res) => {
    try {
      const { page, size, fecha } = req.query;
      let condition = {
        fecha: { [Op.startsWith]: `${fecha}` },
      };
      const { limit, offset } = getPagination(page, size);

      const data = await Pedido.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
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

      const pedidos = getPagingData(data, page, limit);

      res.send(pedidos);
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(
        `Error al llamar los pedidos por rangos de Fechas: ${error.message}`
      );
    }
  },

  // Mostrar 1 Pedido por id
  getPedidoById: async (req, res) => {
    try {
      const id = req.params.id;

      let pedido = await Pedido.findByPk(id, {
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

      if (!pedido) {
        res.status(404).json({ msg: "No se ha encontrado el Pedido" });
      } else {
        res.json(pedido);
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  // Editar Pedido
  updatePedido: async (req, res) => {
    try {
      const id = req.params.id;

      let distritoPedido = await Distrito.findOne({
        where: {
          distrito: { [Op.like]: `%${req.body.distritoConsignado}%` },
        },
      });

      let mobiker = await Mobiker.findOne({
        where: {
          fullName: req.body.mobiker,
        },
      });

      let tipoEnvio = await Envio.findOne({
        where: {
          tipo: req.body.tipoEnvio,
        },
      });

      let modalidadPedido = await Modalidad.findOne({
        where: {
          tipo: req.body.modalidad,
        },
      });

      let pedido = {
        fecha: req.body.fecha,
        contactoRemitente: req.body.contactoRemitente,
        empresaRemitente: req.body.empresaRemitente,
        direccionRemitente: req.body.direccionRemitente,
        distritoRemitente: req.body.distritoRemitente,
        telefonoRemitente: req.body.telefonoRemitente,
        otroDatoRemitente: req.body.otroDatoRemitente,
        contactoConsignado: req.body.contactoConsignado,
        empresaConsignado: req.body.empresaConsignado,
        direccionConsignado: req.body.direccionConsignado,
        telefonoConsignado: req.body.telefonoConsignado,
        otroDatoConsignado: req.body.otroDatoConsignado,
        tipoCarga: req.body.tipoCarga,
        formaPago: req.body.formaPago,
        tarifa: req.body.tarifa,
        tarifaSugerida: req.body.tarifaSugerida,
        recaudo: req.body.recaudo,
        tramite: req.body.tramite,
        comision: req.body.comision,
        distancia: req.body.distancia,
        CO2Ahorrado: req.body.CO2Ahorrado,
        ruido: req.body.ruido,
        statusId: req.body.status,
        compensado: req.body.compensado,
        facturado: req.body.facturado,
        distritoId: distritoPedido.id,
        mobikerId: mobiker.id,
        tipoDeEnvioId: tipoEnvio.id,
        modalidadId: modalidadPedido.id,
        rolCliente: req.body.rolCliente,
        viajes: req.body.viajes,
        isRuteo: req.body.isRuteo,
        ruteoId: req.body.ruteoId,
      };

      let pedidoActualizado = await Pedido.update(pedido, {
        where: { id: id },
      });

      if (pedidoActualizado) {
        res.json({ message: "¡Se ha actualizado el Pedido con éxito!" });

        // Asignar al MoBiker
        let cantidadPedidosDelMoBiker = await Pedido.sum("viajes", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let kilometrosAsignadosMobiker = await Pedido.sum("distancia", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let CO2AsignadosMobiker = await Pedido.sum("CO2Ahorrado", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let ruidoAsignadosMobiker = await Pedido.sum("ruido", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        // Actualizando el Nivel MoB
        const mobikerConNuevoRango = await Mobiker.findOne({
          where: { id: mobiker.id },
          include: [
            {
              model: Rango,
            },
          ],
        });

        let nuevoRango = mobikerConNuevoRango.rango.rangoMoBiker;

        // Caso para subir a MoBiker
        if (
          cantidadPedidosDelMoBiker >= 100 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 2;
        }

        // Caso para subir a MoBiker Pro
        if (
          cantidadPedidosDelMoBiker >= 500 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 3;
        }

        // Caso para subir a MoBiker Élite
        if (
          cantidadPedidosDelMoBiker >= 1000 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 4;
        }

        await Mobiker.update(
          {
            biciEnvios: cantidadPedidosDelMoBiker,
            kilometros: kilometrosAsignadosMobiker,
            CO2Ahorrado: CO2AsignadosMobiker,
            ruido: ruidoAsignadosMobiker,
            rangoId: nuevoRango,
          },
          {
            where: { id: mobiker.id },
          }
        );

        // Asignar al Cliente
        let clienteAsignado = await Cliente.findOne({
          where: {
            contacto: req.body.contactoRemitente,
          },
        });

        let cantidadPedidosDelCliente = await Pedido.sum("viajes", {
          where: {
            [Op.and]: [
              { clienteId: clienteAsignado.id },
              { statusId: { [Op.between]: [1, 5] } },
            ],
          },
        });

        let kilometrosAsignados = await Pedido.sum("distancia", {
          where: {
            [Op.and]: [
              { clienteId: clienteAsignado.id },
              { statusId: { [Op.between]: [1, 5] } },
            ],
          },
        });

        let CO2Asignados = await Pedido.sum("CO2Ahorrado", {
          where: {
            [Op.and]: [
              { clienteId: clienteAsignado.id },
              { statusId: { [Op.between]: [1, 5] } },
            ],
          },
        });

        let ruidoAsignados = await Pedido.sum("ruido", {
          where: {
            [Op.and]: [
              { clienteId: clienteAsignado.id },
              { statusId: { [Op.between]: [1, 5] } },
            ],
          },
        });

        await Cliente.update(
          {
            biciEnvios: cantidadPedidosDelCliente,
            kilometros: kilometrosAsignados,
            CO2Ahorrado: CO2Asignados,
            ruido: ruidoAsignados,
          },
          {
            where: { id: clienteAsignado.id },
          }
        );
      } else {
        res.json({
          message: "¡Error! No se ha podido actualizar el Pedido...",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Cambiar la asignacion de un MoBiker y el estado del pedido
  asignacionPedido: async (req, res) => {
    try {
      const id = req.params.id;

      let mobiker = await Mobiker.findOne({
        where: {
          fullName: req.body.mobiker,
        },
      });

      let pedidoAsignado = {
        mobikerId: mobiker.id,
        comision: req.body.comision,
        statusId: req.body.status,
      };

      let pedidoActualizado = await Pedido.update(pedidoAsignado, {
        where: { id: id },
      });

      if (pedidoActualizado) {
        res.json({ message: "¡Se ha asignado el Pedido con éxito!" });

        // Asignar al MoBiker
        let cantidadPedidosDelMoBiker = await Pedido.sum("viajes", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let kilometrosAsignadosMobiker = await Pedido.sum("distancia", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let CO2AsignadosMobiker = await Pedido.sum("CO2Ahorrado", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let ruidoAsignadosMobiker = await Pedido.sum("ruido", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        // Actualizando el Nivel MoB
        const mobikerConNuevoRango = await Mobiker.findOne({
          where: { id: mobiker.id },
          include: [
            {
              model: Rango,
            },
          ],
        });

        let nuevoRango = mobikerConNuevoRango.rango.rangoMoBiker;

        // Caso para subir a MoBiker
        if (
          cantidadPedidosDelMoBiker >= 100 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 2;
        }

        // Caso para subir a MoBiker Pro
        if (
          cantidadPedidosDelMoBiker >= 500 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 3;
        }

        // Caso para subir a MoBiker Élite
        if (
          cantidadPedidosDelMoBiker >= 1000 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 4;
        }

        await Mobiker.update(
          {
            biciEnvios: cantidadPedidosDelMoBiker,
            kilometros: kilometrosAsignadosMobiker,
            CO2Ahorrado: CO2AsignadosMobiker,
            ruido: ruidoAsignadosMobiker,
            rangoId: nuevoRango,
          },
          {
            where: { id: mobiker.id },
          }
        );
      } else {
        res.json({
          message: "¡Error! No se ha podido actualizar el Pedido...",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Cambiar el estado de un Pedido
  cambiarStatusPedido: async (req, res) => {
    try {
      const id = req.params.id;

      //Es importante enviar el MoBiker para que actualice sus estadísticas
      let mobiker = await Mobiker.findOne({
        where: {
          fullName: req.body.mobiker,
        },
      });

      let estadoCambiado = {
        comentario: req.body.comentario,
        statusId: req.body.status,
        isRuteo: req.body.isRuteo,
        ruteoId: req.body.ruteoId,
      };

      let pedidoActualizado = await Pedido.update(estadoCambiado, {
        where: { id: id },
      });

      if (pedidoActualizado) {
        res.json({
          message: "¡Se ha cambiado el estado del Pedido con éxito!",
        });

        // Asignar al MoBiker
        let cantidadPedidosDelMoBiker = await Pedido.sum("viajes", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let kilometrosAsignadosMobiker = await Pedido.sum("distancia", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let CO2AsignadosMobiker = await Pedido.sum("CO2Ahorrado", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        let ruidoAsignadosMobiker = await Pedido.sum("ruido", {
          where: {
            [Op.and]: [
              { mobikerId: mobiker.id },
              { statusId: { [Op.between]: [4, 5] } },
            ],
          },
        });

        // Actualizando el Nivel MoB
        const mobikerConNuevoRango = await Mobiker.findOne({
          where: { id: mobiker.id },
          include: [
            {
              model: Rango,
            },
          ],
        });

        let nuevoRango = mobikerConNuevoRango.rango.rangoMoBiker;

        // Caso para subir a MoBiker
        if (
          cantidadPedidosDelMoBiker >= 100 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 2;
        }

        // Caso para subir a MoBiker Pro
        if (
          cantidadPedidosDelMoBiker >= 500 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 3;
        }

        // Caso para subir a MoBiker Élite
        if (
          cantidadPedidosDelMoBiker >= 1000 &&
          mobikerConNuevoRango.rango.id !== 5 &&
          mobikerConNuevoRango.rango.id !== 6
        ) {
          nuevoRango = 4;
        }

        await Mobiker.update(
          {
            biciEnvios: cantidadPedidosDelMoBiker,
            kilometros: kilometrosAsignadosMobiker,
            CO2Ahorrado: CO2AsignadosMobiker,
            ruido: ruidoAsignadosMobiker,
            rangoId: nuevoRango,
          },
          {
            where: { id: mobiker.id },
          }
        );
      } else {
        res.json({
          message: "¡Error! No se ha podido actualizar el Pedido...",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Buscar pedido por id, cliente, etc
  searchPedido: async (req, res) => {
    try {
      const query = req.query.q;

      const mob = await Mobiker.findOne({
        where: { fullName: { [Op.like]: `%${query}%` } },
      });

      if (mob) {
        const pedido = await Pedido.findAll({
          where: {
            [Op.or]: [
              { id: { [Op.like]: `%${query}%` } },
              { contactoRemitente: { [Op.like]: `%${query}%` } },
              { empresaRemitente: { [Op.like]: `%${query}%` } },
              { contactoConsignado: { [Op.like]: `%${query}%` } },
              { empresaConsignado: { [Op.like]: `%${query}%` } },
              { mobikerId: mob.id },
            ],
          },
          order: [["id", "DESC"]],
          limit: 200,
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

        res.json(pedido);
      } else {
        const pedido = await Pedido.findAll({
          where: {
            [Op.or]: [
              { id: { [Op.like]: `%${query}%` } },
              { contactoRemitente: { [Op.like]: `%${query}%` } },
              { empresaRemitente: { [Op.like]: `%${query}%` } },
              { contactoConsignado: { [Op.like]: `%${query}%` } },
              { empresaConsignado: { [Op.like]: `%${query}%` } },
            ],
          },
          order: [["id", "DESC"]],
          limit: 20,
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

        res.json(pedido);
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  searchPedidoProgramados: async (req, res) => {
    try {
      let { desde, hasta, page, size } = req.query;
      let condition = {
        [Op.and]: [
          { fecha: { [Op.between]: [`%${desde}%`, `%${hasta}%`] } },
          { statusId: { [Op.between]: [1, 2] } },
        ],
      };
      const { limit, offset } = getPagination(page, size);

      let data = await Pedido.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
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

      const pedidos = getPagingData(data, page, limit);

      res.json(pedidos);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Mostrar todo el historial de Pedidos
  getHistorialPedidos: async (req, res) => {
    try {
      let { desde, hasta, page, size } = req.query;
      let condition = { fecha: { [Op.between]: [`%${desde}%`, `%${hasta}%`] } };
      const { limit, offset } = getPagination(page, size);

      const data = await Pedido.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
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

      const pedidos = getPagingData(data, page, limit);

      res.json(pedidos);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Mostrar Pedidos con Transferencia
  getPedidosTransferencia: async (req, res) => {
    try {
      let { desde, hasta, page, size } = req.query;
      let condition = {
        [Op.and]: [
          { fecha: { [Op.between]: [`%${desde}%`, `%${hasta}%`] } },
          { formaPago: "Transferencia" },
          { statusId: { [Op.ne]: 6 } },
        ],
      };
      const { limit, offset } = getPagination(page, size);

      const data = await Pedido.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
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

      const pedidos = getPagingData(data, page, limit);

      res.json(pedidos);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Mostrar Pedidos con Recaudos
  getPedidosRecaudo: async (req, res) => {
    try {
      const pagosExcluidos = [
        "Efectivo en Destino",
        "Efectivo en Origen",
        "Sin Cargo x Canje",
        "Sin Cargo x Compensación",
        "Sin Cargo x Cortesía",
        "Sin Cargo x Envío Propio",
        "Sin Cargo x Error MoB",
      ];
      let { desde, hasta, page, size } = req.query;
      let condition = {
        [Op.and]: [
          { fecha: { [Op.between]: [`%${desde}%`, `%${hasta}%`] } },
          { formaPago: { [Op.notIn]: pagosExcluidos } },
          { statusId: { [Op.ne]: 6 } },
          { recaudo: { [Op.gt]: 0 } },
        ],
      };
      const { limit, offset } = getPagination(page, size);

      const data = await Pedido.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
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

      const pedidos = getPagingData(data, page, limit);

      res.json(pedidos);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Mostrar todos los Pedidos dentro de la Ruta
  getPedidosByRuteo: async (req, res) => {
    try {
      let { desde, hasta, page, size } = req.query;
      let condition = {
        fecha: { [Op.between]: [`%${desde}%`, `%${hasta}%`] },
      };
      const { limit, offset } = getPagination(page, size);

      let ruteoConPedidos = [];
      let rutaConPedido = {};

      const ruteos = await Ruteo.findAll();

      for (let ruta of ruteos) {
        let pedidosRuta = await Pedido.findAll({
          where: { [Op.and]: [{ ruteoId: ruta.id }, condition] },
          order: [["id", "DESC"]],
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

        if (pedidosRuta.length > 0) {
          rutaConPedido = {
            ruta,
            pedidosRuta,
          };

          ruteoConPedidos.push(rutaConPedido);
        }
      }

      const data = {
        count: ruteoConPedidos.length,
        rows: ruteoConPedidos,
      };

      const pedidos = getPagingData(data, page, limit);

      res.json(pedidos);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getRutaById: async (req, res) => {
    try {
      const id = req.params.id;

      const ruta = await Ruteo.findByPk(id);

      const pedidosRuta = await Pedido.findAll({
        where: { ruteoId: ruta.id },
        order: [["id", "DESC"]],
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

      let rutaConPedido = {
        ruta,
        pedidosRuta,
      };

      res.json(rutaConPedido);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  // Procesas CSV y retornar un JSON
  procesarCSV: async (req, res) => {
    try {
      const fs = require("fs"); // filesystem
      const csv = require("csv-parse"); // Encargado de parsear
      const pedidos = [];

      const parseador = csv({
        delimiter: ",", //Delimitador, por defecto es la coma ,
        cast: true, // Intentar convertir las cadenas a tipos nativos
        comment: "#", // El carácter con el que comienzan las líneas de los comentarios, en caso de existir
      });

      parseador.on("readable", function () {
        let fila;
        let i = 0;
        while ((fila = parseador.read())) {
          if (i != 0) {
            let pedido = {
              contactoConsignado: fila[0],
              empresaConsignado: fila[1],
              telefonoConsignado: fila[2],
              direccionConsignado: fila[3],
              distritoConsignado: fila[4],
              otroDatoConsignado: fila[5],
            };
            pedidos.push(pedido);
          }
          i++;
        }
      });

      parseador.on("error", function (err) {
        console.error("Error al leer CSV:", err.message);
      });

      fs.createReadStream("src/files/file") // Abrir archivo
        .pipe(parseador) // Pasarlo al parseador a través de una tubería
        .on("end", function () {
          // Y al finalizar, terminar lo necesario
          parseador.end();
          res.json({ data: pedidos });
        });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
};
