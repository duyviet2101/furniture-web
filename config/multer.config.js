const multer = require('multer');

const uploadMemory = multer({
  storage: multer.memoryStorage()
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => { // điểm đến
      cb(null, __dirname + '/../uploads'); // uploads is the folder name
    },
    filename: (req, file, cb) => { // tên file
      cb(null, `${Date.now()} + ${file.originalname}`); // originalname is the name of the file on user's computer
    }
  })
});

module.exports = {
  uploadMemory,
  uploadDisk
}