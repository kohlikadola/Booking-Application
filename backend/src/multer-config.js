import multer from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error('File size exceeds 5 MB'), false);
  }
  cb(null, true);
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

export default upload;

