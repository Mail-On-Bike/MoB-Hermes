const { authJwt, verifySignUp } = require("../middleware/index");
const controller = require("../controller/auth-clientes.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/login-cliente", controller.signinCliente);

  app.put("/update-user-cliente/:id",[authJwt.verifyToken], controller.updateUserCliente);

  app.post("/change-password/:id",[authJwt.verifyToken], controller.changePasswordUserCliente);
};
