import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import uploadFileMiddleware from "../middleware/multer.js";
import client from "../configs/mongo.js";
import firebaseApp from "../configs/firebase.config.js";

const uploadToFirebase = async (file, studentId, studentName) => {
  try {
    const storageFB = getStorage();
    const originalFileName = file.originalname;
    const lastDot = originalFileName.lastIndexOf(".");
    const ext = originalFileName.substring(lastDot + 1);
    const dateTime = Date.now();
    const newFileName = `images/${studentId}-${studentName}-${dateTime}.${ext}`;

    const storageRef = ref(storageFB, newFileName);

    const metadata = {
      contentTypes: ["image/jpeg", "image/png", "image/jpeg", "image/gif"],
    };

    await uploadBytesResumable(storageRef, file.buffer, metadata);
    return newFileName;
  } catch (error) {
    throw new Error(`(24) Error uploading to Firebase: ${error.message}`);
  }
};

const saveToMongoDB = async (dataImg) => {
  try {
    await client.connect();
    await client.db("its_uploads").collection("Images").insertOne(dataImg);
  } catch (error) {
    throw new Error(`Error saving to MongoDB: ${error.message}`);
  } finally {
    await client.close();
  }
};

const upload = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file === undefined) {
      return res.status(400).json({ message: "Please upload a file!" });
    }

    const buildImage = await uploadToFirebase(
      req.file,
      req.body.id,
      req.body.studentName
    );
    const dataImg = {
      studentId: req.body.id,
      studentName: req.body.studentName,
      imageUrl: buildImage,
    };

    await saveToMongoDB(dataImg);

    res.status(200).json({
      message: "Uploaded the file successfully: " + req.file.originalname,
      dataOfImage: dataImg,
    });
  } catch (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        message: "File size cannot be larger than 11MB!",
      });
    }
    res.status(500).json({
      message: `Could not upload the file: ${err.message}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    await client.connect();
    const result = await client
      .db("its_uploads")
      .collection("Images")
      .find({})
      .toArray();

    if (result.length > 0) {
      const userImages = result.map((image) => ({
        studentId: image.studentId,
        studentName: image.studentName,
        imageUrl: image.imageUrl,
      }));

      res.status(200).json({
        userImages: userImages,
      });
    } else {
      res.status(200).json({
        message: "No images found in the database!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error fetching images from MongoDB: ${error.message}`,
    });
  } finally {
    await client.close();
  }
};

export { upload, getListFiles };
