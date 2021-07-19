const db = require("../../models/index");
const User = db.user;
const Mobiker = db.mobiker;
const Cliente = db.cliente;
const Pedido = db.pedido;
const Distrito = db.distrito;
const Envio = db.envio;
const Modalidad = db.modalidad;
const Status = db.status;
const RolCliente = db.rolCliente;
const FormaDePago = db.formaDePago;
const Rango = db.rango;

const Op = db.Sequelize.Op;

// Pedidos
// const pedidos = require("./pedidos-seed/pedidos-01.seed");
// const pedidos = require("./pedidos-seed/pedidos-02.seed");
// const pedidos = require("./pedidos-seed/pedidos-03.seed");
// const pedidos = require("./pedidos-seed/pedidos-04.seed");
// const pedidos = require("./pedidos-seed/pedidos-05.seed");
const pedidos = require("./pedidos-seed/pedidos-06.seed");

// const pedidos = require("./pedidos-seed/arreglandoPedidos");

// const pedidos = [
//   ...pedidos1,
//   ...pedidos2,
//   ...pedidos3,
//   ...pedidos4,
//   ...pedidos5,
//   ...pedidos6,
// ];

// Funcion para capitalizar las primeras letras
const capitalizar = (nombres) => {
  const capitalizado = nombres
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

  return capitalizado;
};
// pedidos.forEach(async (pedido) =>

const crearPedidos = async () => {
  try {
    for (let pedido of pedidos) {
      let migracionCtrl = await Pedido.findByPk(pedido.id);

      if (!migracionCtrl) {
        // Formatear Fecha
        pedido.fecha = new Date(pedido.fecha.split("/").reverse().join("-"));

        // Agregar Rol del Cliente tal cual aparece en la Base de Datos
        const buscarRolCliente = await RolCliente.findOne({
          where: { rol: { [Op.like]: `%${pedido.rolCliente}%` } },
        });
        pedido.rolCliente = buscarRolCliente.rol;

        // Agregar forma de Pago tal cual aparece en la Base de Datos
        const buscarFormaPago = await FormaDePago.findOne({
          where: { pago: { [Op.like]: `%${pedido.formaPago}%` } },
        });
        pedido.formaPago = buscarFormaPago.pago;

        // Ajustando el Booleano de Compensado y Facturado
        pedido.compensado = pedido.compensado === "SI" ? true : false;
        pedido.facturado = pedido.facturado === "SI" ? true : false;

        const nuevoPedido = await Pedido.create(pedido);

        let mobiker = await Mobiker.findOne({
          where: {
            fullName: { [Op.like]: `%${pedido.mobiker}%` },
          },
        });
        if (mobiker && mobiker.fullName === "Maria Gabriela Viloria") {
          mobiker = await Mobiker.findOne({
            where: { fullName: "Gaby Viloria" },
          });
        }
        if (mobiker && mobiker.fullName === "Mail On Bike") {
          mobiker = await Mobiker.findOne({
            where: { fullName: "zzMoBiker Retirado" },
          });
        }

        const distritoPedido = await Distrito.findOne({
          where: { distrito: { [Op.like]: `%${pedido.distritoConsignado}%` } },
        });
        const tipoEnvio = await Envio.findOne({
          where: { tipo: { [Op.like]: `%${pedido.tipoDeEnvio}%` } },
        });
        const modalidadPedido = await Modalidad.findOne({
          where: { tipo: { [Op.like]: `%${pedido.modalidad}%` } },
        });
        const estadoPedido = await Status.findOne({
          where: { id: pedido.status },
        });

        if (mobiker === null || mobiker === undefined) {
          let nuevoMobiker = {};

          nuevoMobiker.fullName = capitalizar(pedido.mobiker);
          nuevoMobiker.nombres = nuevoMobiker.fullName.split(" ")[0];
          nuevoMobiker.apellidos = nuevoMobiker.fullName.split(" ")[1];

          nuevoMobiker.telegram = "pendiente";
          nuevoMobiker.telefono = "pendiente";
          nuevoMobiker.direccion = "pendiente";
          nuevoMobiker.tipoDocumento = "DNI";
          nuevoMobiker.numeroDocumento = "pendiente";
          nuevoMobiker.email = "pendiente@mob.com";
          nuevoMobiker.equipo = "Mochila";
          nuevoMobiker.tipoBicicleta = "MTB";
          nuevoMobiker.status = "Inactivo";
          nuevoMobiker.genero = "Masculino";
          nuevoMobiker.fechaNacimiento = "2013-04-12";
          nuevoMobiker.fechaIngreso = "2013-04-12";

          const distritoDelMobiker = await Distrito.findOne({
            where: { distrito: "Cercado de Lima" },
          });
          const nivelMoB = await Rango.findOne({
            where: { rangoMoBiker: "Pre-MoBiker" },
          });

          mobiker = await Mobiker.create(nuevoMobiker);
          await mobiker.setDistrito(distritoDelMobiker);
          await mobiker.setRango(nivelMoB);
        }
        const operador = await User.findOne({
          where: {
            username: pedido.operador,
          },
        });
        let clienteAsignado = await Cliente.findOne({
          where: {
            razonComercial: { [Op.like]: `%${pedido.empresaRemitente}%` },
          },
        });
        if (!clienteAsignado) {
          clienteAsignado = await Cliente.findOne({
            where: {
              razonComercial: "CLIENTE ÚNICO",
            },
          });
        }

        await nuevoPedido.setMobiker(mobiker);
        await nuevoPedido.setUser(operador);
        await nuevoPedido.setDistrito(distritoPedido);
        await nuevoPedido.setTipoDeEnvio(tipoEnvio);
        await nuevoPedido.setModalidad(modalidadPedido);
        await nuevoPedido.setCliente(clienteAsignado);
        await nuevoPedido.setStatus(estadoPedido);
      }
    }
  } catch (error) {
    console.log(`Ocurrió un error al crear Pedidos: ${error.message}`);
    console.log(error);
  }
};

// Creando los Pedidos
crearPedidos();

// node src/seeders/funciones/crearPedidos.js
