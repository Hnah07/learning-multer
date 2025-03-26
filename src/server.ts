// Imports
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import { PORT } from "./utils/envs";
import multer from "multer";
import path from "path";
// Variables
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("src/public"));
app.use("/uploads", express.static("uploads")); //met express.static kun je de uploads folder toegankelijk maken voor de client

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    const newName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    cb(null, newName);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 3000000 } });

// Routes
app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

app.post("/upload", upload.single("image"), (req, res) => {
  //image moet exact matchen met de name van de input field in de html file
  //geen async nodig want hij moet toch sowieso wachten op de upload
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  console.log(imageUrl);
  res.status(200).send(
    `<h1>Image uploaded successfully</h1>
    <img src="http://localhost:3000${imageUrl}" alt="Uploaded Image" width="500" />`
  );
});

// Foutafhandeling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

// Server Listening
app.listen(PORT, () => {
  console.log(
    chalk.bgBlue.bold(` 🚀 Server is up and running on port ${PORT}! 🚀 `)
  );
});
