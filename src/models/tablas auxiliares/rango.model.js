module.exports = (sequelize, Sequelize) => {
	const Rango = sequelize.define(
		"rangos",
		{
			id: {
				type: Sequelize.INTEGER(1),
				primaryKey: true,
				allowNull: false,
			},
			rangoMoBiker: {
				type: Sequelize.STRING(16),
				allowNull: false,
			},
			comision: {
				type: Sequelize.FLOAT(3),
				allowNull: false,
			},
		},
		{
			tableName: "rangos",
			timestamps: false,
		}
	);
	return Rango;
};
