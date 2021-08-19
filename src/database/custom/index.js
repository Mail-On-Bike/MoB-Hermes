const agregarComprobante = require("./updateEmpresa");

async function customMigration() {
  await agregarComprobante();
}

customMigration();
