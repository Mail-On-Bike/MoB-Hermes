require("dotenv").config();

const express = require("express");
const cors = require("cors");

const router = require("./routes/index.routes");

// Initializations
const app = express();



// Settings
const corsOptions = {
	origin: process.env.IRIS_URL.split(','),
};

// Creating the sync to DB
const db = require("./models/index");

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

// Routes
app.use("/hermes", router);

// Set PORT and start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
	try {
		console.log(`Hermes está en línea en el puerto: ${PORT}`);
		await db.sequelize.authenticate();

		console.log("Se ha establecido la conexión con la Base de Datos");
	} catch (error) {
		console.log(`Ha ocurrido un error con la conexión:  ${error.message}`);
		console.log(error);
	}
});
