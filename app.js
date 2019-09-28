const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const port = 3000;

// Init app
const app = express()


// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {        
        // null as first argument means no error
        cb(null, Date.now() + '-' + file.originalname )
    }
})

// Init upload
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1000000
    },

    fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }

}).single('files')



// Set view engine
app.set('view engine', 'ejs')

// Set static folder
app.use(express.static('./public'));


// Set the initial route
app.get('/', (req, res) => {
    res.render('index');
})


// Handle the upload route
app.post('/upload', (req, res) => {
    // res.send('done');
    upload(req, res, (err) => {
        if (err){ 
            res.render('index', { msg: err})
        }else{
            // If file is not selected
            if (req.file == undefined) {
                res.render('index', { msg: 'No file selected!' })
            
            }
            else{
                res.render('index', { msg: 'File uploaded successfully!' })
            }

        }
    
    })
})

function sanitizeFile(file, cb) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif']

    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = file.mimetype.startsWith("image/")

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }
}

app.listen(port, () => console.log('Server started at port : ' + port))