const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const mime = require("mime");

exports.upload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Please upload at least one file" });
  }
  console.log(process.env.PRIVATE_KEY); 
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: { 
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
  });
  const bucketName = process.env.BUCKET_NAME;
  const bucket = storage.bucket(bucketName);
  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      const extension = mime.getExtension(file.mimetype);
      const uniqueFilename = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${extension}`;
      const blob = bucket.file(uniqueFilename);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });
      blobStream.on("error", (err) => {
        console.error(err);
        reject(new Error("Error uploading file"));
      });

      blobStream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        file.publicUrl = publicUrl;
        resolve();
      });

      blobStream.end(file.buffer);
    });
  });
  Promise.all(uploadPromises)
    .then(() => {
      const photos = req.files.map((file) => file.publicUrl);
      console.log(req.body);
      const {location, cost, agentFee, numberOfRooms, distance} = req.body;
      if (!location || !cost || !agentFee || !numberOfRooms || !distance) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const responseData = {
        photos,
        cost,
        location,
        agentFee,
        numberOfRooms,
        distance,
      };
      req.body = responseData;
      next();
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); 
    } else {
      cb(new Error('Only image files are allowed!'), false); 
    }
  }
}).array("files");
exports.uploadMiddleware = uploadMiddleware;
