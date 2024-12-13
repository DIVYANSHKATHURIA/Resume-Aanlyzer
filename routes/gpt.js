import Groq from "groq-sdk";
import express from 'express'


const router = express.Router()

async function gptFetch(prompt){
    try{
      const groq = new Groq({ apiKey: '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' });
      
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
  let prompt = `Perform a thorough ATS (Applicant Tracking System) check on the provided resume content. Analyze each aspect carefully and provide a detailed, accurate assessment. Your response should be in JSON format as follows:

  {
    "AtsScore": "",  // Provide an honest, well-calculated score out of 100.
    "AtsSummary": "", // Summarize the overall assessment of the resume, highlighting key strengths and areas for improvement.
    "Suggestions": {
      "Keywords": { 
        "score": , // Score out of 10
        "analysis": "", // Detailed analysis of keyword usage
        "suggestion": "" // Specific keywords to add or remove
      },
      "ResumeLength": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of current length and its appropriateness
        "suggestion": "" // Specific suggestion to increase, decrease, or maintain length
      },
      "Skills": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of skills presented
        "suggestion": "" // Specific skills to add, remove, or emphasize
      },
      "WorkExperience": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of work experience presentation
        "suggestion": "" // Specific improvements for work experience section
      },
      "Projects": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of project descriptions
        "suggestion": "" // Specific improvements for project section
      },
      "Education": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of education section
        "suggestion": "" // Specific improvements for education section
      },
      "ContactDetails": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of contact information provided
        "suggestion": "" // Specific improvements for contact details
      },
      "BulletPoints": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of bullet point usage
        "suggestion": "" // Specific improvements for bullet points
      },
      "Grammar": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of grammar and language use
        "suggestion": "" // Specific grammar and language improvements
      },
      "RepetitiveWords": { 
        "score": , // Score out of 10
        "analysis": "", // Analysis of word repetition
        "suggestion": "" // Specific words to vary or reduce
      }
    },
    "Strengths": "", // List of the resume's strong points
    "RecommendedActions": [ , , ,....] // Prioritized list of top 3-4 actions in detail to improve ATS compatibility
  }
  
  Important Guidelines:
  1. Provide highly specific and actionable feedback for each category.
  2. Base your analysis on the actual content provided, not on general assumptions.
  3. For keywords, skills, and other specific suggestions, use examples directly relevant to the resume's content and apparent industry.
  4. Be accurate in your length assessment - if the resume is too short, recommend adding more details instead of condensing.
  5. Ensure your suggestions are consistent across all sections.
  6. In the RecommendedActions, prioritize the most impactful changes the applicant can make.
  
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
    console.log(`${currentDateTime} Server: Gpt Ats Fetch Request Received`);

    let prompt=  makePrompt(req.body.text);

    try{
      let result= await gptFetch(prompt);
      currentDateTime = new Date().toLocaleString();
      console.log(`${currentDateTime} Server: Gpt Ats Fetch Completed`)
      
      // console.log(result);
      res.json({ message: result, isError:"false",errorDetails:"" })
    }
    catch (error){
      currentDateTime = new Date().toLocaleString();
      console.log(`${currentDateTime} Server: Gpt Ats Fetch Failed`)
      
      res.json({ message: "", isError:"true",errorDetails: error.toString()})
    }
})


export default router;