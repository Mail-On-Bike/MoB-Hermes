const db = require("../../models/index");
const Mobiker = db.mobiker;
const Pedido = db.pedido;
const Rango = db.rango;

const Op = db.Sequelize.Op;

const contarPedidosMoBiker = async () => {
  const mobikers = await Mobiker.findAll();

  try {
    for (let mobiker of mobikers) {
      let cantidadPedidosDelMoBiker = await Pedido.sum("viajes", {
        where: {
          [Op.and]: [
            { mobikerId: mobiker.id },
            { statusId: { [Op.between]: [4, 5] } },
          ],
        },
      });

      let kilometrosAsignadosMobiker = await Pedido.sum("distancia", {
        where: {
          [Op.and]: [
            { mobikerId: mobiker.id },
            { statusId: { [Op.between]: [4, 5] } },
          ],
        },
      });

      let CO2AsignadosMobiker = await Pedido.sum("CO2Ahorrado", {
        where: {
          [Op.and]: [
            { mobikerId: mobiker.id },
            { statusId: { [Op.between]: [4, 5] } },
          ],
        },
      });

      let ruidoAsignadosMobiker = await Pedido.sum("ruido", {
        where: {
          [Op.and]: [
            { mobikerId: mobiker.id },
            { statusId: { [Op.between]: [4, 5] } },
          ],
        },
      });

      // Actualizando el Nivel MoB
      const mobikerConNuevoRango = await Mobiker.findOne({
        where: { id: mobiker.id },
        include: [
          {
            model: Rango,
          },
        ],
      });

      let nuevoRango = mobikerConNuevoRango.rango.rangoMoBiker;

      // Caso para subir a MoBiker
      if (
        cantidadPedidosDelMoBiker > 100 &&
        mobikerConNuevoRango.rango.id !== 5 &&
        mobikerConNuevoRango.rango.id !== 6
      ) {
        nuevoRango = 2;
      }

      // Caso para subir a MoBiker Pro
      if (
        cantidadPedidosDelMoBiker > 500 &&
        mobikerConNuevoRango.rango.id !== 5 &&
        mobikerConNuevoRango.rango.id !== 6
      ) {
        nuevoRango = 3;
      }

      // Caso para subir a MoBiker Élite
      if (
        cantidadPedidosDelMoBiker > 1000 &&
        mobikerConNuevoRango.rango.id !== 5 &&
        mobikerConNuevoRango.rango.id !== 6
      ) {
        nuevoRango = 4;
      }

      await Mobiker.update(
        {
          biciEnvios: cantidadPedidosDelMoBiker,
          kilometros: kilometrosAsignadosMobiker,
          CO2Ahorrado: CO2AsignadosMobiker,
          ruido: ruidoAsignadosMobiker,
          rangoId: nuevoRango,
        },
        {
          where: { id: mobiker.id },
        }
      );
    }
  } catch (error) {
    console.log(
      `Ocurrió un error al asignar los Pedidos al MoBiker: ${error.message}`
    );
    console.log(error);
  }
};

// Función local Asignar al MoBiker
// contarPedidosMoBiker();

module.exports = contarPedidosMoBiker;
