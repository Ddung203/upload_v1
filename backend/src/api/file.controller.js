import fs from "fs";
import uploadFile from "../middleware/upload.js";

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 11MB!",
      });
    }
    res.status(500).send({
      // message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      message: `Could not upload the file (22): ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Không tìm thấy file!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: "/uploads/" + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Không thể tải xuống file. " + err,
      });
    }
  });
};

export { upload, getListFiles, download };
