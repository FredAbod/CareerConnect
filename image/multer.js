const multer = require('multer');
const path = require('path');

// multer config
const storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext != '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  }
  // destination: function (req, file, cb) {
  //   cb(null, 'uploads/'); // Set the destination folder for uploaded files
  // },
  // filename: function (req, file, cb) {
  //   cb(null, file.originalname); // Set the filename for uploaded files
  // }
});

const upload = multer({ storage });

module.exports = upload;
