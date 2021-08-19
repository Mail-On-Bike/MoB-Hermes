const controller = require("../controller/auxiliares.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Ruta para obtener los roles de los usuarios
  app.get("/auxiliares/roles-usuarios", controller.sendRolesUsuarios);

  // Ruta para obtener los distritos
  app.get("/auxiliares/distritos", controller.sendDistritos);

  // Ruta para obtener la Zona de Cobertura
  app.get("/auxiliares/zona-cobertura", controller.sendZonaCobertura);

  // Ruta para obtener los tipo de carga
  app.get("/auxiliares/tipos-de-carga", controller.sendTipoCarga);

  // Ruta para obtener los tipo de comprobante
  app.get(
    "/auxiliares/tipos-de-comprobantes",
    controller.sendTiposComprobantes
  );

  // Ruta para obtener los tipos de envios
  app.get("/auxiliares/tipos-de-envios", controller.sendTipoEnvio);

  // Ruta para obtener las formas de pago
  app.get("/auxiliares/formas-de-pago", controller.sendFormaPago);

  // Ruta para obtener la modalidad
  app.get("/auxiliares/modalidad", controller.sendTipoModalidad);

  // Ruta para obtener los rangos de MoBikers
  app.get("/auxiliares/rangos-MoBiker", controller.sendRangosMoB);

  // Ruta para obtener los roles de los clientes
  app.get("/auxiliares/roles-clientes", controller.sendRolCliente);

  // Ruta para obtener las Entidades Bancarias
  app.get("/auxiliares/entidades-financieras", controller.sendBancos);

  // Ruta para obtener los estados del Pedido
  app.get("/auxiliares/status", controller.sendStatus);
};
