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

// Helper function to decode and save base64 images
const saveEncodedImage = (base64String, folderPath, fileName) => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 image format");
  }

  const imageBuffer = Buffer.from(matches[2], "base64");
  const fullPath = path.join(folderPath, fileName);

  // Ensure the folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(fullPath, imageBuffer);
  return `/uploads/${fileName}`; // Return the relative file path
};

// Route for creating a room
RoomRouter.post(
  "/create",
  upload.fields([{ name: "image" }, { name: "imagelg" }]),
  async (req, res) => {
    try {
      console.log("req.files:", req.files);
      console.log("req.body:", req.body);

      // Handle base64 images if provided
      if (req.body.image && req.body.image.startsWith("data:")) {
        const imageName = `${Date.now()}-image.png`;
        req.body.image = saveEncodedImage(req.body.image, uploadFolder, imageName);
      }

      if (req.body.imagelg && req.body.imagelg.startsWith("data:")) {
        const largeImageName = `${Date.now()}-imagelg.png`;
        req.body.imagelg = saveEncodedImage(req.body.imagelg, uploadFolder, largeImageName);
      }

      // Handle file uploads through Multer
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

// Route for listing rooms
RoomRouter.get("/list", RoomController.list);

// Route for fetching a specific room record
RoomRouter.get("/record/:code", RoomController.roomRecord);

module.exports = RoomRouter;
