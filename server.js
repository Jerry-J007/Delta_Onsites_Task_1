import express from 'express';
import  multer from 'multer' ;
import path from  'path';
import fs from 'fs';

const app = express();
const PORT = 5000;


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });


app.use(express.static(__dirname));


app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.json({ message: `File uploaded successfully: ${req.file.filename}` });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
