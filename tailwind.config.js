/** @type {import('tailwindcss').Config} */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default {
  content: ["*.{html,js,ejs}",
    path.join(__dirname, 'public', 'analyze.html'),
    path.join(__dirname, 'public', 'signIn.html'),
    path.join(__dirname, 'public', 'scriptAnalyze.js'),

  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

