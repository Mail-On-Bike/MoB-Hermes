module.exports = (sequelize, Sequelize) => {
  const Ruteo = sequelize.define(
    "ruteos",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: "ruteos",
      timestamps: true,
    }
  );
  return Ruteo;
};
