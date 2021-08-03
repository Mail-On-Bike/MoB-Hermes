const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const Op = db.Sequelize.Op;

// No duplicates usernames or Emails
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username or Email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (user) {
      res.status(400).send({
        message: "¡Espera! Este Usuario ya está en uso...",
      });
      return;
    }

    next();
  } catch (error) {
    console.log(
      `Error al verificar si el usuario está verificado: ${error.message}`
    );
    console.log(req.body.username);

    console.log(error);
    res.status(400).send({
      message: "¡Espera! Este Usuario ya está en uso...",
    });
  }
};

// Check for existed roles
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `¡Error! Ese rol '${req.body.roles[i]}' no existe...`,
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
