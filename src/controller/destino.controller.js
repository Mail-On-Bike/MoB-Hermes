const db = require("../models/index");
const Destino = db.destino;
const Distrito = db.distrito;

const Op = db.Sequelize.Op;

module.exports = {
  storageDestino: async (req, res) => {
    try {
      const destino = {
        contacto: req.body.contacto,
        empresa: req.body.empresa,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        otroDato: req.body.otroDato,
      };

      const distrito = await Distrito.findOne({
        where: {
          distrito: req.body.distrito,
        },
      });

      if (destino && distrito) {
        const nuevoDestino = await Destino.create(destino);

        await nuevoDestino.setDistrito(distrito);

        res.json({ message: "¡Se ha creado el Destino con éxito!" });
      } else {
        res.json({ message: "¡Error! No se ha podido crear el cliente..." });
      }
    } catch (error) {
      console.log(`Error al crear un Destino Recurrente: ${error.message}`);
      res.status(500).send({ message: error.message });
    }
  },

  updateDestino: async (req, res) => {
    try {
      const id = req.params.id;

      const distrito = await Distrito.findOne({
        where: {
          distrito: req.body.distrito,
        },
      });

      const editDestino = {
        contacto: req.body.contacto,
        empresa: req.body.empresa,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        otroDato: req.body.otroDato,
        distritoId: distrito.id,
      };

      let destinoActualizado = await Destino.update(editDestino, {
        where: { id },
      });

      if (destinoActualizado) {
        res.json({ message: "¡Se ha actualizado el Destino con éxito!" });
      } else {
        res.json({
          message: "¡Error! No se ha podido actualizar el destino...",
        });
      }
    } catch (error) {
      console.log(`Error al editar un Destino Recurrente: ${error.message}`);
      res.status(500).send({ message: error.message });
    }
  },

  indexDestino: async (req, res) => {
    try {
      const destinos = await Destino.findAll({
        order: [["empresa", "ASC"]],
        limit: 20,
        include: [
          {
            model: Distrito,
          },
        ],
      });

      res.json(destinos);
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(
        `Error al buscar TODOS los Destinos Recurrentes: ${error.message}`
      );
    }
  },

  searchDestino: async (req, res) => {
    try {
      const query = req.query.q;

      const destinos = await Destino.findAll({
        order: [["empresa", "ASC"]],
        where: {
          [Op.or]: [
            { contacto: { [Op.like]: `%${query}%` } },
            { empresa: { [Op.like]: `%${query}%` } },
          ],
        },
        limit: 10,
        include: [
          {
            model: Distrito,
          },
        ],
      });

      res.json(destinos);
    } catch (error) {
      res.status(500).send({ message: error.message });
      console.log(`Error al buscar los Destinos Recurrentes: ${error.message}`);
    }
  },
};
