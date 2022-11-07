# LUDO


![Demo gif](public/imgs/dem.gif?raw=true)

## Overview

A platform that allows users to keep track of their amateur sports leagues, teams, or players stats. Sign up for the app, create as many profiles as you want, and add stats. Other users from the same team or league can access your entries as well, so everybody knows who is the MVP.

Live: https://ludo.up.railway.app/ 

Live: https://ludo.cyclic.app/

## STACKS: 
<img alt="Javascript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E"><img alt="NodeJS" src="https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white"><img alt="Express.js" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white"><img alt="Mongoose" src="https://img.shields.io/badge/-mongoose-green"><img alt="CSS3" src="https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=CSS3&logoColor=white"><img alt="SASS" src="https://img.shields.io/badge/SASS-hotpink.svg?style=flat&logo=SASS&logoColor=white"><img alt="Bootstrap" src="https://img.shields.io/badge/bootstrap-%2338B2AC.svg?style=flat&logo=bootstrap&logoColor=white"><img alt="EJS" src="https://img.shields.io/badge/-EJS-blue">


## How It Works

Built using the MVC pattern, the client is able to create their account with Passport OAuth, make CRUD requests through forms and save their data in MongoDB. The server side uses Mongoose Schemas, Express to build the server and Cloudinary/Multer to handle uploading files.

## Optimizations

* To have a more dynamic experience, I would like the users to have the option of editing the stats table header.
* Mobile version is in the works.

## Lessons

Working with Cloudinary and Multer to upload images was a new experience. As I wanted users to have the opportunity to upload profile pics, but not have it mandatory, I needed a system to have a default image and avoid a crash. By checking if a file was added before setting an upload function, I was able to add the default option.


