module.exports = (sequelize, Sequelize) => {
  const ZonaCobertura = sequelize.define(
    "zonaCobertura",
    {
      id: {
        type: Sequelize.INTEGER(2),
        primaryKey: true,
        allowNull: false,
      },
      distrito: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
    },
    {
      tableName: "zona de cobertura",
      timestamps: false,
    }
  );
  return ZonaCobertura;
};
