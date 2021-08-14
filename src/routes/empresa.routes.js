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

  // Ruta para crear una nueva Empresa
  app.post(
    "/nueva-empresa",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.storageEmpresa
  );

  // Ruta para obtener TODAS las empresas
  app.get(
    "/empresas-registradas",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.indexEmpresas
  );

  // Ruta para obtener UNA empresa por Id
  app.get(
    "/empresas-registradas/:id",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.getEmpresaById
  );

  // Ruta para editar una empresa
  app.put(
    "/empresas-registradas/:id",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.updateEmpresa
  );

  // Ruta para buscar Empresas por su nombre
  app.get(
    "/empresas",
    [authJwt.verifyToken, authJwt.isEquipoAdmin],
    controller.searchEmpresa
  );
};
