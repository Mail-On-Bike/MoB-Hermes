const db = require("../../models/index");
const Mobiker = db.mobiker;
const Distrito = db.distrito;
const Rango = db.rango;

const Op = db.Sequelize.Op;

// Para tener referencia
// const mobikerBase = require("../mobikers.seed");

// Nuevo csv
const mobikersPorAgregar = require("./mobikerPorAsignar.seed");

// Funcion para capitalizar las primeras letras
const capitalizar = (nombres) => {
  const capitalizado = nombres
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

  return capitalizado;
};

const agregarMoBikers = () => {
  try {
    for (let mobiker of mobikersPorAgregar) {
      mobiker.fullName = capitalizar(mobiker.MoBiker);
      mobiker.nombres = mobiker.fullName.split(" ")[0];
      mobiker.apellidos = mobiker.fullName.split(" ")[1];

      mobiker.telegram = "pendiente";
      mobiker.direccion = "pendiente";
      mobiker.tipoDocumento = "DNI";
      mobiker.numeroDocumento = "pendiente";
      mobiker.email = "pendiente@mob.com";
      mobiker.equipo = "Mochila";
      mobiker.tipoBicicleta = "MTB";
      mobiker.status = "Activo";
      mobiker.fechaNacimiento = "2013-04-12";
      mobiker.fechaIngreso = "2013-04-12";

      const distritoDelMoBiker = await Distrito.findOne({
        where: { distrito: { [Op.like]: `%${mobiker.Distrito}%` } },
      });

      let nivelMoB = await Rango.findOne({
        where: { rangoMoBiker: { [Op.like]: `%${mobiker.NivelMoB}%` } },
      });
      if (!nivelMoB) {
        nivelMoB = await Rango.findOne({
          where: { rangoMoBiker: "Pre-MoBiker" },
        });
      }

      const revisarMobiker = await Mobiker.findOne({
        where: { fullName: { [Op.like]: `%${mobiker.fullName}%` } },
      });

      if (!revisarMobiker) {
        console.log(
          `Creando al nuevo MoBiker: ${mobiker.fullName} que sale del distrito ${distritoDelMoBiker.distrito} con el Rango ${nivelMoB.rangoMoBiker}`
        );
        const nuevoMobiker = await Mobiker.create(mobiker);

        await nuevoMobiker.setDistrito(distritoDelMoBiker);
        await nuevoMobiker.setRango(nivelMoB);
      }
    }
  } catch (error) {
    console.log(`Ocurrió un error al añadir MoBikers: ${error.message}`);
    console.log(error);
  }
};

// Se ejecuta la función
agregarMoBikers();

// node src/seeders/funciones/agregarMoBikers.js
