const db = require("../../models/index");
const Empresa = db.empresa;
const Cliente = db.cliente;
const Comprobante = db.comprobante;

const agregarComprobante = async () => {
  try {
    const empresas = await Empresa.findAll();

    for (let empresa of empresas) {
      let cliente = await Cliente.findOne({
        where: { razonComercial: empresa.empresa },
        include: { model: Comprobante, attributes: ["tipo"] },
      });

      if (cliente) {
        await Empresa.update(
          {
            ruc: cliente.ruc ? cliente.ruc : "",
            comprobante: cliente.tipoDeComprobante.tipo,
          },
          { where: { id: empresa.id } }
        );
      }
    }
  } catch (error) {
    console.log(
      `Algo salió mal al agregar el Comprobante a las Empresas: ${error.message}`
    );
    console.log(error);
  } finally {
    console.log("Proceso terminado");
  }
};

module.exports = agregarComprobante;
