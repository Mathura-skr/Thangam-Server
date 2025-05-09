const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const path = require("path");

// POST /api/upload
router.post("/", upload.single("image_url"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Return image_url URL
  const imageUrl = `${req.protocol}://${req.get("host")}/src/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });

  console.log("Uploaded file:", req.file);

  
});

module.exports = router;


