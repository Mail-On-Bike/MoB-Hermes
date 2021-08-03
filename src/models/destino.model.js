module.exports = (sequelize, Sequelize) => {
  const Destino = sequelize.define(
    "destinos",
    {
      contacto: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      empresa: {
        type: Sequelize.STRING(75),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      telefono: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      otroDato: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
    },
    {
      tableName: "destinos_Recurrentes",
    }
  );
  return Destino;
};
