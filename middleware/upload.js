// middleware/upload.js
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "public/uploads"; // Store in public so files can be accessed by browser
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Reusable storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// ✅ Export both middlewares
export const doctorUpload = multer({ storage });
export const patientUpload = multer({ storage }); // Add this for patient file uploads
