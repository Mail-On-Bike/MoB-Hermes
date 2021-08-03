const db = require("../models/index");
const User = db.user;
const Mobiker = db.mobiker;
const Cliente = db.cliente;
const Role = db.role;
const Distrito = db.distrito;
const ZonaCobertura = db.zonaCobertura;
const CodigoPostal = db.codigoPostal;
const Rango = db.rango;
const Comprobante = db.comprobante;
const Carga = db.carga;
const Modalidad = db.modalidad;
const FormaDePago = db.formaDePago;
const RolCliente = db.rolCliente;
const Envio = db.envio;
const Bancos = db.bancos;
const Status = db.status;
const Empresa = db.empresa;
const Destino = db.destino;
const Franquicia = db.franquicia;

// Usuarios
const usuarios = require("./usuarios.seed");

// MoBikers
const mobikers = require("./mobikers.seed");

// Clientes
const clientes = require("./clientes.seed");

// Roles del Usuario
const roles = require("./tablas auxiliares/roles.seed");

// Rangos
const rangos = require("./tablas auxiliares/rangos.seed");

// Tipo de Comprobante
const tipoDeComprobante = require("./tablas auxiliares/tipoDeComprobante.seed");

// Tipo de Carga
const tipoDeCarga = require("./tablas auxiliares/tipoDeCarga.seed");

// Modalidad
const modalidades = require("./tablas auxiliares/modalidades.seed");

// Formas de Pago
const formasDePago = require("./tablas auxiliares/formasDePago.seed");

// Roles de Cliente
const rolesCliente = require("./tablas auxiliares/rolesCliente.seed");

// Tipo de Envío
const tipoEnvio = require("./tablas auxiliares/tipoEnvio.seed");

// Bancos
const entidadesFinancieras = require("./tablas auxiliares/entidadesFinancieras.seed");

// Estados del Pedido
const estadosPedido = require("./tablas auxiliares/estadosPedido.seed");

// Distritos
const distritos = require("./tablas auxiliares/distritos.seed");

// Distritos de la Zona de cobertura
const zonas = require("./tablas auxiliares/zonaCobertura.seed");

// Franquicias o derviados de Mail On Bike
const franquicias = require("./tablas auxiliares/franquicias.seed");

// Empresas
const empresas = require("./empresas.seed");

// Destinos Recurrentes
const destinos = require("./destinos.seed");

// Códigos Postales
const codigosPostales = require("./tablas auxiliares/codigosPostales.seed");

// Ejecutar la Seed
const ejecutarSeed = async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log("Borrando data y creando nuevas tablas...");

    // Creando roles
    roles.forEach(async (rol) => await Role.create(rol));

    // Creando los rangos
    rangos.forEach(async (rango) => await Rango.create(rango));

    // Creando los distritos
    distritos.forEach(async (distrito) => await Distrito.create(distrito));

    // Creando la Zona de Cobertura
    zonas.forEach(async (zona) => await ZonaCobertura.create(zona));

    // Creando tabla de comprobante
    tipoDeComprobante.forEach(
      async (comprobante) => await Comprobante.create(comprobante)
    );

    // Creando tabla de tipo de Carga
    tipoDeCarga.forEach(async (carga) => await Carga.create(carga));

    // Creando tabla de Modalidad
    modalidades.forEach(async (modalidad) => await Modalidad.create(modalidad));

    // Creando tabla de Forma de Pago
    formasDePago.forEach(async (pago) => await FormaDePago.create(pago));

    // Creando tabla de Roles del Cliente
    rolesCliente.forEach(
      async (rolCliente) => await RolCliente.create(rolCliente)
    );

    // Creando tabla de Tipo de Envío
    tipoEnvio.forEach(async (envio) => await Envio.create(envio));

    // Creando Tabla Entidades financieras
    entidadesFinancieras.forEach(async (banco) => await Bancos.create(banco));

    // Creando la tabla de status del Pedido
    estadosPedido.forEach(async (status) => await Status.create(status));

    // Creando la tabla de empresas
    empresas.forEach(async (empresa) => await Empresa.create(empresa));

    // Creando la tabla de franquicias de Mail On Bike
    franquicias.forEach(
      async (franquicia) => await Franquicia.create(franquicia)
    );

    // Creando los Códigos Postales
    codigosPostales.forEach(
      async (codigo) => await CodigoPostal.create(codigo)
    );

    // Creando los Usuarios
    await crearUsuarios();

    // Creando los MoBikers
    await crearMobikers();

    // Creando los Clientes
    await crearClientes();

    // Creando los Destinos Recurrentes
    crearDestinos();
  } catch (error) {
    console.log(
      `Ha ocurrido un error en la ejecución de la Seed: ${error.message}`
    );
    console.log(error);
  }
};

const crearUsuarios = async () => {
  try {
    usuarios.forEach(async (usuario) => {
      const roles = usuario.roles;

      const user = await User.create(usuario);
      await user.addRoles(roles);
    });
  } catch (error) {
    console.log(`Ocurrió un error al crear Usuarios: ${error.message}`);
  }
};

const crearMobikers = async () => {
  mobikers.forEach(async (mobiker) => {
    try {
      const distrito = mobiker.distrito;
      const rangoInicial = mobiker.rango;

      const nuevoMobiker = await Mobiker.create(mobiker);
      await nuevoMobiker.setDistrito(distrito);
      await nuevoMobiker.setRango(rangoInicial);
    } catch (error) {
      console.log(`Ocurrió un error al crear Mobikers: ${error.message}`);
      console.log(error);
    }
  });
};

const crearClientes = async () => {
  clientes.forEach(async (cliente) => {
    try {
      const distrito = cliente.distrito;
      const comprobante = cliente.comprobante;
      const rolDelCliente = cliente.rol;
      const tipoEnvio = cliente.tipoEnvio;
      const tipoDeCarga = cliente.carga;
      const pago = cliente.pago;

      const nuevoCliente = await Cliente.create(cliente);
      const operador = await User.findOne({
        where: { username: cliente.operador },
      });

      await nuevoCliente.setDistrito(distrito);
      await nuevoCliente.setTipoDeComprobante(comprobante);
      await nuevoCliente.setRolCliente(rolDelCliente);
      await nuevoCliente.setTipoDeCarga(tipoDeCarga);
      await nuevoCliente.setFormaDePago(pago);
      await nuevoCliente.setTipoDeEnvio(tipoEnvio);
      await nuevoCliente.setUser(operador);
    } catch (error) {
      console.log(`Ocurrió un error al crear Usuarios: ${error.message}`);
      console.log(error);
    }
  });
};

const crearDestinos = () => {
  destinos.forEach(async (destino) => {
    const nuevoDestino = await Destino.create(destino);
    await nuevoDestino.setDistrito(destino.distrito);
    try {
    } catch (error) {
      console.log(`Ocurrió un error al crear Destinos: ${error.message}`);
      console.log(error);
    }
  });
};

// Ejectutar Funciones
ejecutarSeed();
