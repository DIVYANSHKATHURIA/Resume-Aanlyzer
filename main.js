import express from 'express'
import gpt from "./routes/gpt.js"
import ocr from "./routes/ocr.js"
import job from "./routes/job.js"
import courses from "./routes/courses.js"
import scrapeCourses from "./routes/scrapeCourses.js"


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = 5000


app.use(express.static('public'));

app.use('/convert',ocr);
app.use('/gptAts',gpt);
app.use('/gptJobs',job);
app.use('/gptCourses',courses);
app.use('/scrapeCourses', scrapeCourses);



app.get('/analyze', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'analyze.html'));
})

app.get('/signIn',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'signIn.html'));
})
app.get('/signUp',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'signUp.html'));
})
app.get('/community',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'community.html'));
})
app.get('/aboutUs',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'aboutUs.html'));
})
app.get('/contactUs',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'contactUs.html'));
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
