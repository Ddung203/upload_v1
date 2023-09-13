import util from "util";
import multer from "multer";
import { extname } from "path";

const MAX_FILE_SIZE = 11 * 1024 * 1024;

const storage = multer.memoryStorage();

// const storageDisk = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `${__basedir}/uploads/`);
//   },
//   filename: (req, file, cb) => {
//     console.log(">>> (14) file:: ", file);
//     cb(null, file.originalname);
//   },
// });

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: async function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file");

//  Check file Type
function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extName = fileTypes.test(extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error (multer.js:37): Images Only !!!");
  }
}

const uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;
