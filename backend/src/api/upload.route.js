import express from "express";
import * as uploadController from "./upload.controller.js";

const router = express.Router();

router.route("/upload").post(uploadController.upload);
router.route("/files").get(uploadController.getListFiles);

export default router;
