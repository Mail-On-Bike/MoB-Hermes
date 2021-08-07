const config = require("../config/db.config");

const Sequelize = require("sequelize");
// Conexión a la Base de Datos
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: 3306,
  timezone: "-05:00",
  define: {
    charset: "utf8",
    dialectOptions: {
      collate: "utf8_general_ci",
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Tablas Principales
db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.pedido = require("./pedido.model")(sequelize, Sequelize);
db.mobiker = require("./mobiker.model")(sequelize, Sequelize);
db.cliente = require("./cliente.model")(sequelize, Sequelize);
db.destino = require("./destino.model")(sequelize, Sequelize);
db.ruteo = require("./ruteo.model")(sequelize, Sequelize);

db.userCliente = require("./user-cliente.model")(sequelize, Sequelize);
db.userMobiker = require("./user-mobiker.model")(sequelize, Sequelize);

// Tablas Auxiliares
db.distrito = require("./tablas auxiliares/distrito.model")(
  sequelize,
  Sequelize
);
db.zonaCobertura = require("./tablas auxiliares/zonaCobertura.model")(
  sequelize,
  Sequelize
);
db.codigoPostal = require("./tablas auxiliares/codigoPostal.model")(
  sequelize,
  Sequelize
);
db.rango = require("./tablas auxiliares/rango.model")(sequelize, Sequelize);
db.carga = require("./tablas auxiliares/carga.model")(sequelize, Sequelize);
db.comprobante = require("./tablas auxiliares/comprobante.model")(
  sequelize,
  Sequelize
);
db.modalidad = require("./tablas auxiliares/modalidad.model")(
  sequelize,
  Sequelize
);
db.formaDePago = require("./tablas auxiliares/formaDePago.model")(
  sequelize,
  Sequelize
);
db.rolCliente = require("./tablas auxiliares/rolCliente.model")(
  sequelize,
  Sequelize
);
db.envio = require("./tablas auxiliares/envio.model")(sequelize, Sequelize);
db.bancos = require("./tablas auxiliares/bancos.model")(sequelize, Sequelize);
db.status = require("./tablas auxiliares/status.model")(sequelize, Sequelize);
db.empresa = require("./empresa.model")(sequelize, Sequelize);
db.franquicia = require("./tablas auxiliares/franquicia.model")(
  sequelize,
  Sequelize
);

// Associations
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.mobiker.hasMany(db.userMobiker);
db.userMobiker.belongsTo(db.mobiker);
db.role.hasOne(db.userMobiker);
db.userMobiker.belongsTo(db.role);

db.cliente.hasMany(db.userCliente);
db.userCliente.belongsTo(db.cliente);
db.role.hasOne(db.userCliente);
db.userCliente.belongsTo(db.role);

// Relaciones Auxiliares
db.distrito.hasMany(db.codigoPostal, { as: "Código Postal" });
db.codigoPostal.belongsTo(db.distrito);

// Relaciones Destino con Distrito
db.distrito.hasOne(db.destino);
db.destino.belongsTo(db.distrito);

// Relaciones con la Tabla Clientes
db.distrito.hasOne(db.cliente);
db.cliente.belongsTo(db.distrito);

db.comprobante.hasOne(db.cliente);
db.cliente.belongsTo(db.comprobante);

db.rolCliente.hasMany(db.cliente);
db.cliente.belongsTo(db.rolCliente);

db.carga.hasMany(db.cliente);
db.cliente.belongsTo(db.carga);

db.formaDePago.hasMany(db.cliente);
db.cliente.belongsTo(db.formaDePago);

db.envio.hasOne(db.cliente);
db.cliente.belongsTo(db.envio);

db.user.hasMany(db.cliente);
db.cliente.belongsTo(db.user);

db.empresa.hasMany(db.cliente);
db.cliente.belongsTo(db.empresa);
// Fin relaciones de Clientes

// Relaciones de MoBikers
db.distrito.hasOne(db.mobiker);
db.mobiker.belongsTo(db.distrito);

db.rango.hasOne(db.mobiker);
db.mobiker.belongsTo(db.rango);
// Fin relaciones de MoBikers

// Relaciones de Pedidos
db.distrito.hasOne(db.pedido);
db.pedido.belongsTo(db.distrito);

db.mobiker.hasOne(db.pedido);
db.pedido.belongsTo(db.mobiker);

db.cliente.hasOne(db.pedido);
db.pedido.belongsTo(db.cliente);

db.modalidad.hasOne(db.pedido);
db.pedido.belongsTo(db.modalidad);

db.envio.hasOne(db.pedido);
db.pedido.belongsTo(db.envio);

db.status.hasOne(db.pedido);
db.pedido.belongsTo(db.status);

db.user.hasMany(db.pedido);
db.pedido.belongsTo(db.user);

db.ruteo.hasMany(db.pedido);
db.pedido.belongsTo(db.ruteo);
// Fin relaciones de Pedidos

db.ROLES = ["administrador", "operador", "auditor", "cliente", "mobiker"];

module.exports = db;
