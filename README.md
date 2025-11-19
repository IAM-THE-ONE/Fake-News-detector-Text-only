# Fake-News-detector-Text-only

*Steps for it to work*

**First phase (React setup)**

1) Go to terminal enter this command "npx create-react-app myapp"
2) Then type this "cd myapp" in terminal to change the directory
3) install dependencies , type this in terminal  "npm install lucide-react"
4) replace 
package.json - Dependencies and scripts

src/App.js - Main App component

src/App.css - App styles

src/index.js - React entry point

src/index.css - Global styles with Inter font

public/index.html - HTML template with Tailwind CDN

public/manifest.json - PWA manifest

public/robots.txt - SEO robots file

.gitignore - Git ignore rules

with files given above

5) Add the file FakeNewsDetector.jsx in src folder

**Second phase (Backend Server)**

1) Make a folder in myapp called server
2) add server.js file
3) first change directory to server put this command in terminal "cd server"
4) next this command npm init -y
5) and finally npm install express node-fetch cors

**Third Phase**

1) open two different terminals
2) host back server in one terminal - simply type cd server 
                                           then node server.js
3) host frontend in one more terminal - simply type cd myapp
                                            then npm start

**Fourth phase (Setup API)**

1) Go to this link https://openrouter.ai/sign-in?redirect_url=https%3A%2F%2Fopenrouter.ai%2Fsettings%2Fkeys
2) Sign in
3) Create a api key
4) Copy it
5) Then paste in the website
