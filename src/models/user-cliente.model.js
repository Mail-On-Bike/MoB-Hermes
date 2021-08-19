module.exports = (sequelize, Sequelize) => {
  const UserCliente = sequelize.define(
    "usuariosClientes",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      contacto: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
          len: {
            args: [4, 25],
            msg: "El usuario tiene que ser al menos 2 caracteres",
          },
        },
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isEmail: {
            msg: "El email tiene que ser un correo válido",
          },
        },
      },
      telefono: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 255],
            msg: "La contraseña tiene que tener al menos 6 caracteres",
          },
        },
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "usuarios-clientes",
    }
  );
  return UserCliente;
};
