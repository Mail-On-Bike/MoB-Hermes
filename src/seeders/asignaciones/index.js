// Asignar Pedidos del MoBiker
const contarPedidosMoBiker = require("./pedidosMobiker");
// Asignar al Cliente
const contarPedidosCliente = require("./pedidosCliente");

const ejecutarAsignaciones = async () => {
  await contarPedidosMoBiker();
  await contarPedidosCliente();
};

ejecutarAsignaciones();
