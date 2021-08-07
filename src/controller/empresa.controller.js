const db = require("../models/index");
const Empresa = db.empresa;
const Cliente = db.cliente;

module.exports = {
  indexEmpresas: async (req, res) => {
    try {
      const empresas = await Empresa.findAll({
        order: [["empresa", "ASC"]],
        limit: 20,
      });

      res.json(empresas);
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(
        `Error al buscar TODOS los Destinos Recurrentes: ${error.message}`
      );
    }
  },
};
