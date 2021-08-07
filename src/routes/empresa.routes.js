const { authJwt } = require("../middleware/index");
const controller = require("../controller/empresa.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/empresas-registradas",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.indexEmpresas
  );
};
