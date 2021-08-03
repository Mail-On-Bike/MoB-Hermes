const db = require("../../models/index");
const Cliente = db.cliente;
const Pedido = db.pedido;

const contarPedidosCliente = async () => {
  const clientes = await Cliente.findAll();

  try {
    for (let cliente of clientes) {
      let cantidadPedidosDelCliente = await Pedido.sum("viajes", {
        where: { empresaRemitente: cliente.razonComercial },
      });

      let kilometrosAsignados = await Pedido.sum("distancia", {
        where: { empresaRemitente: cliente.razonComercial },
      });

      let CO2Asignados = await Pedido.sum("CO2Ahorrado", {
        where: { empresaRemitente: cliente.razonComercial },
      });

      let ruidoAsignados = await Pedido.sum("ruido", {
        where: { empresaRemitente: cliente.razonComercial },
      });

      await Cliente.update(
        {
          biciEnvios: cantidadPedidosDelCliente,
          kilometros: kilometrosAsignados,
          CO2Ahorrado: CO2Asignados,
          ruido: ruidoAsignados,
        },
        {
          where: { id: cliente.id },
        }
      );
    }
  } catch (error) {
    console.log(
      `Ocurrió un error al asignar los Pedidos al Cliente: ${error.message}`
    );
    console.log(error);
  }
};

// Asignar al Cliente
// contarPedidosCliente();

module.exports = contarPedidosCliente;
