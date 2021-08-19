"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("empresas", "ruc", {
      type: Sequelize.STRING(11),
      allowNull: true,
    });

    await queryInterface.addColumn("empresas", "comprobante", {
      type: Sequelize.STRING(25),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("empresas", "ruc");

    await queryInterface.removeColumn("empresas", "comprobante");
  },
};
