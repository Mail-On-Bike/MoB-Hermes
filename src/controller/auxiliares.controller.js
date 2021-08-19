const db = require("../models/index");
const Role = db.role;
const Distrito = db.distrito;
const ZonaCobertura = db.zonaCobertura;
const Comprobante = db.comprobante;
const Carga = db.carga;
const Modalidad = db.modalidad;
const FormaDePago = db.formaDePago;
const RolCliente = db.rolCliente;
const Envio = db.envio;
const Rango = db.rango;
const Bancos = db.bancos;
const Status = db.status;

module.exports = {
  sendRolesUsuarios: async (req, res) => {
    const sendRoles = await Role.findAll();
    res.send(sendRoles);
  },

  sendDistritos: async (req, res) => {
    const distritos = await Distrito.findAll({ order: [["distrito", "ASC"]] });
    res.send(distritos);
  },

  sendZonaCobertura: async (req, res) => {
    const zonaCobertura = await ZonaCobertura.findAll({
      order: [["distrito", "ASC"]],
    });
    res.send(zonaCobertura);
  },

  sendTiposComprobantes: async (req, res) => {
    const comprobantes = await Comprobante.findAll();
    res.send(comprobantes);
  },

  sendTipoCarga: async (req, res) => {
    const cargas = await Carga.findAll();
    res.send(cargas);
  },

  sendTipoModalidad: async (req, res) => {
    const modalidad = await Modalidad.findAll();
    res.send(modalidad);
  },

  sendFormaPago: async (req, res) => {
    const pagos = await FormaDePago.findAll();
    res.send(pagos);
  },

  sendRolCliente: async (req, res) => {
    const rolesCliente = await RolCliente.findAll();
    res.send(rolesCliente);
  },

  sendTipoEnvio: async (req, res) => {
    const envios = await Envio.findAll();
    res.send(envios);
  },

  sendRangosMoB: async (req, res) => {
    const rangos = await Rango.findAll();
    res.send(rangos);
  },

  sendBancos: async (req, res) => {
    const bancos = await Bancos.findAll();
    res.send(bancos);
  },

  sendStatus: async (req, res) => {
    const estados = await Status.findAll();
    res.send(estados);
  },
};
