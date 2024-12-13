import express from 'express'
import axios from 'axios'
import {load} from 'cheerio'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router()

// Function to create the search URL
function createSearchUrl(skill, page = 1) {
  const baseUrl = 'https://www.coursera.org/search';
  return `${baseUrl}?query=${encodeURIComponent(skill)}&page=${page}`;
}

// Function to extract courses from HTML
async function extractCourses(url) {
  try {
    const { data } = await axios.get(url);
    const $ = load(data);
    const courses = [];

    $('a.cds-CommonCard-titleLink').each((index, element) => {
      const title = $(element).text().trim();
      const link = `https://www.coursera.org${$(element).attr('href')}`;
      courses.push({ title, link });
    });

    return courses;
  } 
  catch (error) {
    console.log(`Error fetching courses from ${url}:`, error);
    return [];
  }
}

// Function to fetch course descriptions
async function fetchCourseDescription(link) {
  try {
    const { data } = await axios.get(link);
    const $ = load(data);
    let description = $('div.content').text().trim();
    description= description.slice(0, 300);
    return description || 'No description available';
  } 
  catch (error) {
    console.log(`Error fetching description for ${link}:`, error);
    return 'No description available';
  }
}

// Integrate course details with descriptions
async function integrateCourseDetails(courses) {
  return Promise.all(
    courses.map(async (course) => {
      const description = await fetchCourseDescription(course.link);
      return { ...course, description };
    })
  );
}


router.use(express.json());

// Search route to fetch and integrate course data
router.get('/', async (req, res) => {
    
  const skill = req.query.skill || '';
  if (!skill) {
    return res.json([]);
  }

  let page = 1;
  let allCourses = [];

  while (allCourses.length < 5) {
    const url = createSearchUrl(skill, page);
    const courses = await extractCourses(url);

    if (courses.length === 0) break; // Stop if no more courses are found

    allCourses = allCourses.concat(courses);
    page++;
  }

  const topCourses = allCourses.slice(0, 5);
  const integratedCourses = await integrateCourseDetails(topCourses);

  res.json(integratedCourses);
});

export default router;
