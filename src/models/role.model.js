module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "roles",
    {
      id: {
        type: Sequelize.INTEGER(1),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    },
    {
      tableName: "roles",
      timestamps: false,
    }
  );
  return Role;
};
