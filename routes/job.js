import Groq from "groq-sdk";
import express from 'express'
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.GROQ_API_KEY;

const router = express.Router()

async function gptFetch(prompt){
    try{
      const groq = new Groq({ apiKey: apiKey });
      
      async function getGroqChatCompletion() {
        return groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content:"JSON"
            },
            {
              role: "user",
              content: prompt
            },
          ],
          model: "llama3-70b-8192",
          // model:"llama3-8b-8192",
          response_format: {"type": "json_object" },
        });
      }
      
      const chatCompletion = await getGroqChatCompletion();
      return chatCompletion.choices[0]?.message?.content || "";
    }

    catch (error) {
      console.log("Server Error: ",error);
      
      throw error;
    }
    
}


function makePrompt(text){
  // return text;
  let prompt = `Give me priortized list of 10-12 Job recommendations that align with skills and experience of the provided resume content. Your response should be in JSON format as follows:
  { 
    "recommendations":[
      { "JobTitle":"",
        "CompanyType":"",
        "Description":"",
        "MissingSkillsFromYourResume":[]
      }   
    ] 
  }

  Resume Content: 
  ${text}
  
  Before analyzing, carefully read through the entire resume to understand its context, industry, and the applicant's experience level.
  `
 // console.log(prompt);
    return prompt;

}

router.use(express.json());

router.post('/', async (req,res)=>{
    // console.log(req.body);
    let currentDateTime = new Date().toLocaleString();
    console.log(`${currentDateTime} Server: Gpt Job Fetch Request Received`);

    let prompt=  makePrompt(req.body.text);

    try{
      let result= await gptFetch(prompt);
      currentDateTime = new Date().toLocaleString();
      console.log(`${currentDateTime} Server: Gpt Job Fetch Completed`)
      
      // console.log(result);
      res.json({ message: result, isError:"false",errorDetails:"" })
    }
    catch (error){
      currentDateTime = new Date().toLocaleString();
      console.log(`${currentDateTime} Server: Gpt Job Fetch Failed`)
      
      res.json({ message: "", isError:"true",errorDetails: error.toString()})
    }
})


export default router;