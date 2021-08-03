const { authJwt } = require("../middleware/index");
const controller = require("../controller/mobiker.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Ruta para crear nuevo MoBiker
  app.post(
    "/mobikers/crear-nuevo-mobiker",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.storageMobiker
  );

  // Ruta para mostrar todos los MoBikers
  app.get(
    "/mobikers/equipo-mobiker",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.equipoMobiker
  );

  // Ruta para filtrar los MoBikers por status
  app.get(
    "/mobikers/filter-mobiker",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.filterMobiker
  );

  // Ruta para mostrar UN MoBiker
  app.get(
    "/mobikers/equipo-mobiker/:id",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.getMobikerById
  );

  // Ruta para mostrar los Pedidos Asignados al MoBiker
  app.get(
    "/mobikers/pedidos",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.getPedidosDelMobiker
  );

  app.get(
    "/mobikers/pedidos-del-mobiker/:id",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.getPedidosDelMobikerById
  );

  app.get(
    "/mobikers/cantidad-pedidos",
    [authJwt.verifyToken],
    controller.getCantidadPedidosMobiker
  );

  // Ruta para editar un MoBiker
  app.put(
    "/mobikers/equipo-mobiker/:id",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.updateMobiker
  );

  // Ruta para buscar mobikers por su nombre
  app.get(
    "/mobikers",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.searchMobiker
  );

  // Ruta para obtener MoBikers con pedidos en las fechas seleccionadas
  app.get(
    "/mobikers-con-pedidos",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.getMobikerConPedidos
  );
};
