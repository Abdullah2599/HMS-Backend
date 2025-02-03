const express = require("express");
const RoomController = require("../controllers/RoomController");
const RoomRouter = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const RoomService = require("../service/RoomService");

// Ensure the uploads directory exists
const uploadFolder = path.join(__dirname, "../public/uploads"); // Fixed path to ensure it aligns properly
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


const saveEncodedImage = (base64String, folderPath, fileName) => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 image format");
  }

  const imageBuffer = Buffer.from(matches[2], "base64");
  const fullPath = path.join(folderPath, fileName);


  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(fullPath, imageBuffer);
  return `/uploads/${fileName}`; 
};


RoomRouter.post(
  "/create",
  upload.fields([{ name: "image" }, { name: "imagelg" }]),
  async (req, res) => {
    try {
      console.log("req.files:", req.files);
      console.log("req.body:", req.body);


      if (req.body.image && req.body.image.startsWith("data:")) {
        const imageName = `${Date.now()}-image.png`;
        req.body.image = saveEncodedImage(req.body.image, uploadFolder, imageName);
      }

      if (req.body.imagelg && req.body.imagelg.startsWith("data:")) {
        const largeImageName = `${Date.now()}-imagelg.png`;
        req.body.imagelg = saveEncodedImage(req.body.imagelg, uploadFolder, largeImageName);
      }


      if (req.files?.image) {
        req.body.image = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files?.imagelg) {
        req.body.imagelg = `/uploads/${req.files.imagelg[0].filename}`;
      }

      // Call the RoomService
      await RoomService.create(req, res);
    } catch (err) {
      console.error("Error creating room:", err);
      res.status(500).json({ message: `Error: ${err.message}` });
    }
  }
);


RoomRouter.get("/list", RoomController.list);
RoomRouter.get("/availableroomlist", RoomController.availableRoomslist);
RoomRouter.post("/listbyfilter", RoomController.listbyfilter);
RoomRouter.post("/status/:id", RoomController.status);
RoomRouter.get("/record/:code", RoomController.roomRecord);
RoomRouter.get("/recordbyid/:id", RoomController.RoomRecordsbyid);
RoomRouter.put("/update/:id", RoomController.update);
module.exports = RoomRouter;
