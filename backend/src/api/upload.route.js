import express from "express";
import * as fileController from "./file.controller.js";

const router = express.Router();

router.route("/upload").post(fileController.upload);
router.route("/files").get(fileController.getListFiles);
router.route("/files/:name").get(fileController.download);

export default router;
