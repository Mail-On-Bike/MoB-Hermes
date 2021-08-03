module.exports = (sequelize, Sequelize) => {
  const Franquicia = sequelize.define(
    "franquicias MoB",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "franquicias MoB",
    }
  );
  return Franquicia;
};
