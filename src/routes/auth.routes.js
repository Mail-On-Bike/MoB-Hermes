const { authJwt, verifySignUp } = require("../middleware/index");
const controller = require("../controller/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Crear nuevo usuario
  app.post(
    "/registro",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  // Iniciar sesión
  app.post("/login", controller.signin);

  // Cambiar la contraseña
  app.put(
    "/change-password/:id",
    authJwt.verifyToken,
    controller.changePassword
  );

  // Restablecer la contraseña
  app.post(
    "/reset-password/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.restartPassword
  );

  // Obtener los usuarios
  app.get(
    "/equipo-admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getEquipoAdmin
  );
};
