import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the directory where the file will be saved
        cb(null, './uploads/'); // `uploads` folder should be created in your root directory
    },
    filename: (req, file, cb) => {
        // Set the file name as a timestamp + the original file name
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage});

export default upload;