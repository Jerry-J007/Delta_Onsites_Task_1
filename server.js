import express from 'express';
import  multer from 'multer' ;
import path from  'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
//fixed for es module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;


app.use(express.static(__dirname));

const UploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(UploadDir)) {
    fs.mkdirSync(UploadDir,{ recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subFolder = req.body.folder ? req.body.folder.trim() : '';
        const targetDir = path.join(UploadDir, subFolder);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
//added file restrictions for executable files
const fileFilter = (req, file, cb) => {
    const forbiddenExts = ['.exe', '.bat', '.sh', '.bin', '.cmd', '.msi', '.vbs', '.com'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (forbiddenExts.includes(ext)) {
        return cb(new Error(`Rejected: Executable files (${ext}) are not allowed!`), false);
    }
    cb(null, true);
};

const upload = multer({ storage,fileFilter,limits: { fileSize: 10 * 1024 * 1024 } })//only 10 MB files;





app.post('/upload', (req, res) => {
    upload.array('files', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        }

        const uploadedFiles = req.files.map(f => ({
            filename: f.filename,
            originalname: f.originalname,
            size: f.size,
            path: path.relative(UploadDir, f.path)
        }));

        res.json({
            message: 'Files uploaded successfully!',
            files: uploadedFiles
        });
    });
});

function indexDirectory(dirPath, relativeDir = '') {
    let results = [];
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        const relPath = path.join(relativeDir, item.name);

        if (item.isDirectory()) {
            results = results.concat(indexDirectory(fullPath, relPath));
        } else {
            const stats = fs.statSync(fullPath);
            results.push({
                filename: item.name,
                folder: relativeDir || 'Root',
                size: stats.size,
                createdAt: stats.birthtime,
                relativePath: relPath.replace(/\\/g, '/')
            });
        }
    }
    return results;
}

app.get('/files', (req, res) => {
    try {
        const fileList = indexDirectory(UploadDir);
        res.json(fileList);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving file metadata.' });
    }
});

//Download Endpoint
app.get('/download/*file', (req, res) => {
    const filePath = path.join(UploadDir, ...req.params.file);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
