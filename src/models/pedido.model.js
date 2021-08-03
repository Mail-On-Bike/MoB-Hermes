module.exports = (sequelize, Sequelize) => {
  const Pedido = sequelize.define(
    "pedidos",
    {
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        get() {
          return this.getDataValue("fecha");
        },
        set(fecha) {
          this.setDataValue("fecha", fecha);
        },
      },
      contactoRemitente: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      empresaRemitente: {
        type: Sequelize.STRING(75),
        allowNull: true,
      },
      direccionRemitente: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      distritoRemitente: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      telefonoRemitente: {
        type: Sequelize.STRING(35),
        allowNull: false,
      },
      otroDatoRemitente: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      contactoConsignado: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      empresaConsignado: {
        type: Sequelize.STRING(75),
        allowNull: true,
      },
      direccionConsignado: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      telefonoConsignado: {
        type: Sequelize.STRING(35),
        allowNull: false,
      },
      otroDatoConsignado: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      tarifa: {
        type: Sequelize.FLOAT(5),
        allowNull: false,
      },
      tarifaSugerida: {
        type: Sequelize.FLOAT(5),
        allowNull: false,
        defaultValue: 0,
      },
      recaudo: {
        type: Sequelize.FLOAT(5),
        allowNull: false,
      },
      tramite: {
        type: Sequelize.FLOAT(5),
        allowNull: false,
      },
      comision: {
        type: Sequelize.FLOAT(5),
        allowNull: false,
      },
      tipoCarga: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      formaPago: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      distancia: {
        type: Sequelize.FLOAT(6),
        allowNull: false,
      },
      CO2Ahorrado: {
        type: Sequelize.FLOAT(4),
        allowNull: false,
      },
      ruido: {
        type: Sequelize.FLOAT(3),
        allowNull: false,
      },
      compensado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      facturado: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      rolCliente: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      comentario: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      viajes: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
      },
      isRuteo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "pedidos",
    }
  );
  return Pedido;
};
