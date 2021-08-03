// Store Files
const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'src/files')
	},
	filename:(req, file, cb) => {
		cb(null, file.fieldname)
	}
});

const upload = multer({ storage });

module.exports = upload;