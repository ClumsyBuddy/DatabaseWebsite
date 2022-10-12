import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Sockets/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname);
    }
});  

const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('csv')){
        cb(null, true);
    } else{
        cb(null, false);

    }

};

let upload = multer({ storage:storage, fileFilter:fileFilter});

export default upload.single("file");