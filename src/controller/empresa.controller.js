const db = require("../models/index");
const Empresa = db.empresa;
const Cliente = db.cliente;

const Op = db.Sequelize.Op;

module.exports = {
  // Guardar una Empresa nueva
  storageEmpresa: async (req, res) => {
    try {
      let clientesAsociados = [...req.body.clientes];

      const nuevaEmpresa = await Empresa.create({ empresa: req.body.empresa });

      if (nuevaEmpresa) {
        for (let cliente of clientesAsociados) {
          let clienteAsociado = await Cliente.findOne({
            where: { id: cliente.id },
            attributes: ["id", "razonComercial"],
          });

          await clienteAsociado.setEmpresa(nuevaEmpresa);

          await Cliente.update(
            { razonComercial: nuevaEmpresa.dataValues.empresa },
            {
              where: { id: clienteAsociado.dataValues.id },
            }
          );
        }

        res.json({ message: "¡Se ha creado la Empresa con éxito!" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(`Error al crear la nueva Empresa: ${error.message}`);
    }
  },

  // Obtener TODAS las empresas
  indexEmpresas: async (req, res) => {
    try {
      const empresas = await Empresa.findAll({
        order: [["empresa", "ASC"]],
        limit: 30,
        attributes: ["id", "empresa"],
        include: { model: Cliente, attributes: ["contacto", "razonComercial"] },
      });

      res.json(empresas);
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(`Error al buscar TODAS las Empresas: ${error.message}`);
    }
  },

  // Obtener UNA empresa por id
  getEmpresaById: async (req, res) => {
    try {
      const id = req.params.id;

      let dataEmpresa = await Empresa.findByPk(id, {
        attributes: ["id", "empresa"],
        include: {
          model: Cliente,
          attributes: ["id", "contacto", "razonComercial"],
        },
      });

      if (dataEmpresa) {
        res.json(dataEmpresa);
      } else {
        res.status(404).json({ message: "No se ha encontrado la Empresa" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(`Error al buscar una Empresa por Id: ${error.message}`);
    }
  },

  // Actualizar una Empresa por Id
  updateEmpresa: async (req, res) => {
    try {
      const id = req.params.id;

      let clientesAsociados = [...req.body.clientes];

      let empresaActualizada = await Empresa.update(
        { empresa: req.body.empresa },
        { where: { id } }
      );

      if (empresaActualizada) {
        await empresaActualizada.removeClientes();

        for (let cliente of clientesAsociados) {
          let clienteAsociado = await Cliente.findOne({
            where: { id: cliente.id },
            attributes: ["id", "razonComercial"],
          });

          await clienteAsociado.setEmpresa(empresaActualizada);

          await Cliente.update(
            { razonComercial: empresaActualizada.dataValues.empresa },
            {
              where: { id: clienteAsociado.id },
            }
          );
        }

        res.json({ message: "¡Se ha actualizado la Empresa con éxito!" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(`Error al editar la nueva Empresa: ${error.message}`);
    }
  },

  // Buscador de empresas
  searchEmpresa: async (req, res) => {
    try {
      const query = req.query.q;

      let empresa = await Empresa.findAll({
        order: [["empresa", "ASC"]],
        where: { empresa: { [Op.like]: `%${query}%` } },
        limit: 10,
        attributes: ["id", "empresa"],
        include: { model: Cliente, attributes: ["contacto", "razonComercial"] },
      });

      res.json(empresa);
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(`Error al buscar una Empresa: ${error.message}`);
    }
  },
};
