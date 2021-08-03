const router = require("express").Router();

// Home
router.get("/", (req, res) => {
  res.json({ bienvenida: "¡Bienvenidos! Soy Hermes" });
});

// Auth Route
require("./auth.routes")(router);

// Auth Cliente
require("./auth-clientes.routes")(router);

// User Route
require("./user.routes")(router);

// MoBikers Route
require("./mobiker.routes")(router);

// Pedidos Route
require("./pedido.routes")(router);

// Clientes Route
require("./cliente.routes")(router);

// Tablas Auxiliares
require("./auxiliares.routes")(router);

require("./testing.routes")(router);
// Destinos Recurrentes
require("./destino.routes")(router);

module.exports = router;
