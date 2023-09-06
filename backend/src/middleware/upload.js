// initializes Multer Storage engine and defines middleware function to save uploaded files in uploads folder.
import util from "util";
import multer from "multer";

const maxSize = 11 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__basedir}/uploads/`);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).single("file");

const uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;
