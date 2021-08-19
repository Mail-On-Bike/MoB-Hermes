module.exports = (sequelize, Sequelize) => {
  const Empresa = sequelize.define(
    "empresas",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      empresa: {
        type: Sequelize.STRING(75),
        allowNull: true,
      },
      ruc: {
        type: Sequelize.STRING(11),
        allowNull: true,
      },
      comprobante: {
        type: Sequelize.STRING(25),
        allowNull: true,
      },
    },
    {
      tableName: "empresas",
    }
  );
  return Empresa;
};
