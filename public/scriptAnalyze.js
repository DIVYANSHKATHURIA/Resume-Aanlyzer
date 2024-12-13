const parsedTextbox=document.querySelector('.parsedTextbox');
const fileInput = document.querySelector('.fileInput');
const logError=document.querySelector('.logError');
const atsDiv = document.querySelector('.atsDiv');
const jobsDiv = document.querySelector('.jobsDiv');
const coursesDiv = document.querySelector('.coursesDiv');
const curLabel=document.querySelector('.cur-label');

function capitalizeAndSpace(str) {
    const spaced = str.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
    return spaced;
}


function redirectToJobPage(jobTitle) {
    // Encode the job title to handle special characters in the URL
    const encodedJobTitle = encodeURIComponent(jobTitle);
    // Redirect to the new page with job title as a parameter
    window.open(`localhost:5000/search?jobTitle=${encodedJobTitle}`, '_blank');
}






// DISPLAY API RESULT

function displayAts(result) {
    result = JSON.parse(result);
    let text11=``;
    for (const key in result.Suggestions) {
        if (result.Suggestions.hasOwnProperty(key)) {
          const item = result.Suggestions[key];
          text11+=`
          <div class=" shadow-xl bg-white rounded-lg px-10 py-5 text-lg">
            <div ><span class="font-bold text-black">${capitalizeAndSpace(key)} </span> <span>${item.score}/10 </span></div>
            <p>${item.analysis}</p>
            <div><span class="font-medium text-black"> Suggestion: </span> <span> ${item.suggestion} </span></div>
          </div>
          `
        }
    }

    let text33=``;
    result.RecommendedActions.forEach(element => {
        text33+=`<li> ${element} </li>`
    });


    let text22=`
        <div class="shadow-xl bg-white rounded-lg px-10 py-5 text-lg"> <span class="font-bold text-black">ATS SCORE: </span> <span>${result.AtsScore}/100</span></div>

        <div class="shadow-xl bg-white rounded-lg px-10 py-5 text-lg">
            <p class="font-bold text-black">SUMMARY </p>
            <p> ${result.AtsSummary}</p> 
        </div>

        <div class="shadow-xl bg-white rounded-lg px-10 py-5 text-lg">
            <p class="font-bold text-black">RECOMMENDED ACTIONS </p>
            <ol class="list-disc px-10">
                ${text33}
            </ol>
        </div>

        <div class="rounded-lg px-10 py-5 flex flex-col gap-5">
            <p  class="font-bold text-black text-3xl text-center mb-5">DETAILED SUGGESTIONS :</p>
            ${text11}

        </div>

        <div class="shadow-xl bg-white rounded-lg px-10 py-5 text-lg">
            <p class="font-bold text-black text-lg">STRENGTHS </p>
            <p>${result.Strengths}</p> 
        </div>
    `
    // text-blue-800

    atsDiv.innerHTML = text22;
}


function displayJobs(result){
    result = JSON.parse(result);
    
    // console.log(result["recommendations"]);
    jobsDiv.innerHTML='';

    result.recommendations.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'duration-300');

        // Populate the job card with details
        jobCard.innerHTML = `
            
            <div class="job-title font-bold text-xl mb-2"><a href="#" onclick="redirectToJobPage('${job.JobTitle}')">${job.JobTitle}</a></div>
            <div class="company-type text-gray-600 mb-2">Company Type: ${job.CompanyType}</div>
            <div class="description text-gray-800 mb-2">${job.Description}</div>
            <div class="missing-skills text-red-500 italic">Missing Skills: ${job.MissingSkillsFromYourResume.join('  ,  ')}</div>

        `;

        // Append the job card to the container
        jobsDiv.appendChild(jobCard);
    });
}


function displayCourses(result){
    result = JSON.parse(result);
    const string = result.currentSkills.map(item => ` ${item} `).join(', ');
    let ttSkills='';
    result.missingSkills.forEach(element => {
        ttSkills+=`
               <option value="${element}">${element}</option>
        `

    });
    coursesDiv.innerHTML=`
    <div class="w-[100%] flex flex-col gap-4 p-8  rounded-lg shadow-xl bg-white">
        <p class="text-xl font-bold ">Domain: <span class="text-lg font-normal"> &nbsp; ${result.domain}</span></p>
        <p class="text-xl font-bold">Current Skills: <span class="text-lg font-normal">&nbsp; ${string}</span></p>

        <div class="flex gap-7">
            <p class="text-xl font-bold">Missing Skills:</p>
            <select class=" selectt border border-gray-300 rounded-md p-2 bg-white text-gray-700">
                ${ttSkills}
            </select>
            <button id="scrapeCoursesBtn" class="rounded-lg bg-blue-600 text-white px-8 py-2 hover:bg-blue-800 text-lg">Get Courses</button>
        </div>
        <div class="flex gap-5 items-center">
            <label for="searchInp" class="text-xl font-bold">Any Other: </label>
            <input type="text" id="searchInp" placeholder="Type here" class="text-lg px-4 py-2 border-2">
            <button id="searchScrapeCoursesBtn" class="rounded-lg bg-blue-600 text-white px-8 py-2 hover:bg-blue-800 text-lg">Search</button>
         </div>

    </div>

    <div class="coursesGrid w-[100%] grid grid-cols-1  lg:grid-cols-2 gap-6 "> </div>
`;




}

function displayScrapedCourses(result){
    const coursesGrid=document.querySelector('.coursesGrid');
    // console.log(result);
    coursesGrid.innerHTML='';

    result.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'duration-300');

        // Populate the course card with details
        courseCard.innerHTML = `
            <div class="job-title font-bold text-xl mb-2">${course.title}</div>
            <div class="company-type text-gray-600 mb-2">Link: <a class="text-blue-700 underline" href="${course.link}" target="_blank">${course.link}</a></div>
            <div class="description text-gray-800 mb-2">${course.description}</div>
        `;

        // Append the course card to the container
        coursesGrid.appendChild(courseCard);
    });
}









// API CALLS TO GPT

async function gptFetchAts(textt) {
    try {
        const response = await fetch('/gptAts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify({ text: textt }) // Send as JSON

        });


        const result = await response.json();
        if (result.isError == "true") {
            throw result.errorDetails;
        }

        console.log('Sucess: Response received from servers');
        displayAts(result.message);

    }
    catch (error) {
        console.log('Error from GPT: ',error);
        throw error;

    }
}


async function gptFetchJobs(textt) {

    try {
        const response = await fetch('/gptJobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify({ text: textt }) // Send as JSON

        });

        const result = await response.json();
        if (result.isError == "true") {
            throw result.errorDetails;
        }

        console.log('Sucess: Response2 received from servers');
        displayJobs(result.message);

    }
    catch (error) {
        console.log('Error from GPT: ',error);
        throw error;

    }
}

async function gptFetchCourses(textt) {
    try {
        const response = await fetch('/gptCourses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify({ text: textt }) // Send as JSON

        });


        const result = await response.json();
        if (result.isError == "true") {
            throw result.errorDetails;
        }

        console.log('Sucess: Response received from servers');
        displayCourses(result.message);

    }
    catch (error) {
        console.log('Error from GPT: ',error);
        throw error;

    }
}

async function scrapeCourses(textt){
    try{
        const response = await fetch(`/scrapeCourses?skill=${encodeURIComponent(textt)}`);
        const result = await response.json();
        console.log(result);
        
        console.log('Sucess: Response received from servers');
        displayScrapedCourses(result);
    }
    catch (error){
        console.log('Error scraping: ',error);
        throw error;
    }
}


















// BUTTON LISTENERS

const analyzeBtn=document.querySelector('.analyze-btn');
const atsBtn=document.querySelector('.ats-btn');
const jobsBtn=document.querySelector('.jobs-btn');
const coursesBtn=document.querySelector('.courses-btn');

analyzeBtn.addEventListener('click', async () => {
    jobsBtn.click();
})

atsBtn.addEventListener('click', async () => {
    //loading
    //display none
    atsDiv.classList.remove('hidden');
    jobsDiv.classList.add('hidden');
    coursesDiv.classList.add('hidden');
    curLabel.classList.remove('hidden');
    curLabel.textContent='Resume Analysis : ';

    logError.textContent = "";
    let text = parsedTextbox.value;

    if (text.length < 30) {
        logError.textContent = "Your resume content is too small. Please add more (>30 characters)";
        return;
    }
    else {
        try{
            await gptFetchAts(text);
            jobsBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });

        }
        catch(error){
            try{
                await gptFetchAts(text);
                jobsBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            catch(error){
                logError.textContent = 'Oops. Try Again';
            }
        }
    }
    
})

jobsBtn.addEventListener('click', async () => {
    //loading

    atsDiv.classList.add('hidden');
    jobsDiv.classList.remove('hidden');
    coursesDiv.classList.add('hidden');
    curLabel.classList.remove('hidden');
    curLabel.textContent='Job Recommendations : ';

    logError.textContent = "";
    let text = parsedTextbox.value;

    if (text.length < 30) {
        logError.textContent = "Your resume content is too small. Please add more (>30 characters)";
        return;
    }
    else {
        try{
            await gptFetchJobs(text);
            jobsBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        catch(error){
            try{
                await gptFetchJobs(text);
                jobsBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            catch(error){
                logError.textContent = 'Oops. Try Again';
            }
        }
    }
    
})

coursesBtn.addEventListener('click', async () => {
    //loading
    atsDiv.classList.add('hidden');
    jobsDiv.classList.add('hidden');
    coursesDiv.classList.remove('hidden');
    curLabel.classList.remove('hidden');
    curLabel.textContent='Course Recommendations : ';

    logError.textContent = "";
    let text = parsedTextbox.value;

    if (text.length < 30) {
        logError.textContent = "Your resume content is too small. Please add more (>30 characters)";
        return;
    }
    else {
        try{
            await gptFetchCourses(text);
            jobsBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });

        }
        catch(error){
            try{
                await gptFetchCourses(text);
                jobsBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            catch(error){
                logError.textContent = 'Oops. Try Again';
            }
        }
    }
    
})


coursesDiv.addEventListener('click', async (event) => {
    if (event.target && event.target.id === 'scrapeCoursesBtn') {
        
      let text = document.querySelector('.selectt').value;
      
      if (text) {
          try {
              await scrapeCourses(text);
              document.querySelector('#scrapeCoursesBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
          } 
          catch (error) {
            logError.textContent = 'Oops. Try Again';
          }
      }
    }
    else if (event.target && event.target.id === 'searchScrapeCoursesBtn') {
        
        let text = document.querySelector('#searchInp').value;
        
        if (text) {
            try {
                await scrapeCourses(text);
                document.querySelector('#searchScrapeCoursesBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
            } 
            catch (error) {
              logError.textContent = 'Oops. Try Again';
            }
        }
      }
  });
























// EXTRACT RESUME CONTENT

async function convertToText(file) {
    try {
        throw new Error("haha");

        if ((file.size) / 1048576 > 1) {
            throw new Error(`File size > 1 MB`)
        }

        const myHeaders = new Headers();
        myHeaders.append("apikey", "K86754839888957");
        // myHeaders.append("apikey", "helloworld");
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("language", "eng");
        formdata.append("isOverlayRequired", "false");
        formdata.append("detectOrientation", "true");
        formdata.append("scale", "true");
        formdata.append("iscreatesearchablepdf", "false");
        formdata.append("issearchablepdfhidetextlayer", "false");
        formdata.append("filetype", "pdf");
        formdata.append("OCREngine", 2);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };

        const response = await fetch("https://api.ocr.space/parse/image", requestOptions);
        const result = await response.json();

        // console.log(result);

        if (result.IsErroredOnProcessing) throw new Error('Server sent an Error');
        else {
            let extractedText = result.ParsedResults[0].ParsedText;
            parsedTextbox.value = extractedText;
        }

    }

    catch (error) {
        console.log('Error from OCR API: ', error)

        try {
            const formdata = new FormData();
            formdata.append("file", file);

            const response = await fetch('/convert', {
                method: 'POST',
                body: formdata
            });

            const result = await response.json();
            // console.log(result);
            if (result.isError == "true") throw new Error(result.errorDetails);
            let extractedText = result.parsedText;
            parsedTextbox.value = extractedText;

        }
        catch (internalError) {
            console.log('Error from Internal OCR: ', internalError)
        }

    }

}



const fileInputLabel=document.querySelector(".fileInputLabel");

fileInput.addEventListener('click', () => {
    fileInput.value = '';
});

fileInput.addEventListener('change', (event) => {
    logError.textContent = '';
    atsDiv.innerHTML='';
    const files = event.target.files;


    if (files.length > 0) {
        const file = files[0];
        fileInputLabel.textContent= `${file.name}  ${(file.size/1024).toFixed(0)} KB`;

        if ((file.size) / 1048576 > 10) {
            console.log(file.size);
            alert('Please Select a smaller file . Less than 10MB');
            fileInput.value = '';
        }

        // Check if the file is a PDF by verifying the MIME type or file extension
        else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            convertToText(file);
        }

        else {
            alert('The selected file is not a PDF. Please select a PDF file.');
            fileInput.value = '';
        }
    }
    else{
        fileInputLabel.textContent='No file Choosen';
    }

});


parsedTextbox.addEventListener('click',(event)=>{
    logError.textContent = '';
})

const uFileDiv=document.querySelector(".uFileDiv");
uFileDiv.addEventListener('click', () =>{
    fileInput.click();

    
});


