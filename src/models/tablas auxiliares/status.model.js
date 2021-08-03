module.exports = (sequelize, Sequelize) => {
  const Status = sequelize.define(
    "status",
    {
      tag: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
    },
    {
      tableName: "status pedido",
      timestamps: false,
    }
  );
  return Status;
};
