const { authJwt } = require("../middleware/index");
const controller = require("../controller/destino.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Ruta para crear un nuevo destino Recurrente
  app.post(
    "/crear-destino-recurrente",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.storageDestino
  );

  // Ruta para editar un destino Recurrente
  app.put(
    "/destinos-recurrentes/:id",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.updateDestino
  );

  // Ruta para obtener un destino Recurrente por su Id
  app.get(
    "/destinos-recurrentes/:id",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.getDestinoById
  );

  // Ruta para obtener todos los Destinos Recurrentes
  app.get(
    "/destinos-recurrentes",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.indexDestino
  );

  // Ruta para buscar Destinos recurrentes por su nombre o empresa
  app.get(
    "/destinos",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.searchDestino
  );
};
