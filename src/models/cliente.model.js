module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define(
    "clientes",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      contacto: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      razonSocial: {
        type: Sequelize.STRING(75),
        allowNull: true,
      },
      razonComercial: {
        // Empresa
        type: Sequelize.STRING(75),
        allowNull: false,
      },
      direccion: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      telefono: {
        type: Sequelize.STRING(35),
        allowNull: false,
      },
      otroDato: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          isEmail: {
            msg: "El email tiene que ser un correo válido",
          },
        },
      },
      ruc: {
        type: Sequelize.STRING(11),
        allowNull: true,
      },
      biciEnvios: {
        type: Sequelize.INTEGER(6),
        defaultValue: 0,
      },
      kilometros: {
        type: Sequelize.FLOAT(8),
        defaultValue: 0,
      },
      CO2Ahorrado: {
        type: Sequelize.FLOAT(6),
        defaultValue: 0,
      },
      ruido: {
        type: Sequelize.FLOAT(5),
        defaultValue: 0,
      },
      banco: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      tipoCuenta: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      numeroCuentaBancaria: {
        type: Sequelize.STRING(14),
        allowNull: true,
      },
    },
    {
      tableName: "clientes",
    }
  );
  return Cliente;
};
