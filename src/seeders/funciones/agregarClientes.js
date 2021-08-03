const db = require("../../models/index");
const Cliente = db.cliente;
const Distrito = db.distrito;
const Comprobante = db.comprobante;
const RolCliente = db.rolCliente;
const Carga = db.carga;
const Envio = db.envio;
const FormaDePago = db.formaDePago;
const User = db.user;

const Op = db.Sequelize.Op;

// Nuevo CSV
const clientesPorAgregar = require("./clientesPorAgregar.seed");

const capitalizar = (nombres) => {
  const capitalizado = nombres
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

  return capitalizado;
};

const agregarClientes = async () => {
  try {
    for (let cliente of clientesPorAgregar) {
      cliente.contacto = `${capitalizar(cliente.nombre)} ${capitalizar(
        cliente.apellido
      )}`;
      cliente.otroDato = cliente.otroDato == 0 ? "" : cliente.otroDato;
      cliente.ruc = cliente.ruc == 0 ? "" : cliente.ruc;

      cliente.rolCliente = "Remitente";
      cliente.tipoCarga = "Paquete";

      const revisarCliente = await Cliente.findOne({
        where: { razonComercial: { [Op.like]: `%${cliente.razonComercial}%` } },
      });

      if (!revisarCliente) {
        const carga = await Carga.findOne({
          where: { tipo: cliente.tipoCarga },
        });

        const rolDelCliente = await RolCliente.findOne({
          where: { rol: "Remitente" },
        });

        const distrito = await Distrito.findOne({
          where: { distrito: { [Op.like]: `%${cliente.distrito}%` } },
        });

        const comprobante = await Comprobante.findOne({
          where: { tipo: { [Op.like]: `%${cliente.comprobante}%` } },
        });

        const pago = await FormaDePago.findOne({
          where: { pago: { [Op.like]: `%${cliente.formaPago}%` } },
        });

        const tipoEnvio = await Envio.findOne({
          where: { tipo: { [Op.like]: `%${cliente.tipoEnvio}%` } },
        });

        const operador = await User.findOne({
          where: { username: { [Op.like]: `%${cliente.operador}%` } },
        });

        const nuevoCliente = await Cliente.create(cliente);

        await nuevoCliente.setDistrito(distrito);
        await nuevoCliente.setTipoDeComprobante(comprobante);
        await nuevoCliente.setRolCliente(rolDelCliente);
        await nuevoCliente.setTipoDeCarga(carga);
        await nuevoCliente.setFormaDePago(pago);
        await nuevoCliente.setTipoDeEnvio(tipoEnvio);
        await nuevoCliente.setUser(operador);
      }
    }
  } catch (error) {
    console.log(`Ocurrió un error al añadir Clientes: ${error.message}`);
    console.log(error);
  }
};

// Se ejecuta la función
agregarClientes();

// node src/seeders/funciones/agregarClientes.js
