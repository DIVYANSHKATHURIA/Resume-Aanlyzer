
import express from 'express'
import multer from 'multer'
import pdf from 'pdf-parse'


const router = express.Router()

const storage = multer.memoryStorage(); // use ram memory
const upload = multer({ storage });


router.post('/', upload.single('file'), async (req, res) => {
    // Access the uploaded file in memory
    const file = req.file;
    
    if (file) {
        try{
            const pdfData= await pdf(file.buffer)
            // console.log('PDF Text Content:', pdfData.text);
            res.json({parsedText: pdfData.text ,isError:"false", errorDetails:""});
    
        }

        catch (error) {
            console.log("Server: Internal OCR error", error);
            
            res.json({parsedText:"", isError:"true",errorDetails: error.toString()});
        }
    } 
    else {
        res.json({parsedText:"", isError:"true", errorDetails:'No file uploaded'});
    }
});


export default router;
