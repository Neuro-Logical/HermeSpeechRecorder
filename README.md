# Project Title

HermeSpeech Recorder is a user-friendly and
open-source platform designed to record speech from a
large cohort of participants.

## Description

HermeSpeech Recorder is a user-friendly and
open-source platform designed to record speech from a
large cohort of participants. The platform allows users
to easily initiate, pause, and stop recordings of their
assigned scripts or speech tasks. The completed speech
recordings are encrypted and stored in a cloud service,
complying with HIPAA regulations for data privacy, if
needed. The resulting files are uploaded asynchronously
to enable recordings in areas with low connectivity. The
platform also provides features for administrators to
easily create new participants, load and manage many scripts at once and assign tasks to participants, simpli-
fying the management of large cohorts, and making it a streamlined solution for remote speech recording in
a HIPAA compliant and efficient manner. Finally, we
describe our experience recording a group of participants
with atypical speech using this open-source tool.

## Getting Started

### Dependencies

**archiver**
* https://github.com/maxzinkus/AtypicalSpeech/blob/fe6c70558e2afa3cd0259508f57fbd17d74ef078/controllers/audios/audios.ctrl.js#L68
* [docs](https://github.com/archiverjs/node-archiver)
* used for downloading audio files in .zip

**axios**: Promise based HTTP client for the browser and node.js
* [docs](https://www.npmjs.com/package/axios)

**bcryptjs**: A library for hashing and verifying passwords
* https://github.com/maxzinkus/AtypicalSpeech/blob/fe6c70558e2afa3cd0259508f57fbd17d74ef078/controllers/auth/auth.ctrl.js#L22

**cookie-parser**: A library for parsing and setting cookies

**cors**: A library for enabling cross-origin resource sharing (CORS)

**csv-parse**: A library for parsing CSV files

**dotenv**: A library for loading environment variables from a .env file

**express**: A popular web framework for Node.js

**file-type**: A library for detecting the file type of a file

**fs**: The built-in file system module in Node.js

**jsonwebtoken**: A library for creating and verifying JSON Web Tokens (JWTs)
* https://github.com/maxzinkus/AtypicalSpeech/blob/fe6c70558e2afa3cd0259508f57fbd17d74ef078/middleware/auth.js#L9

**list-files**: A library for listing the files in a directory

**list-react-files**: A library for listing the React components in a directory

**multer**: A library for handling multipart/form-data requests
* https://github.com/maxzinkus/AtypicalSpeech/blob/fe6c70558e2afa3cd0259508f57fbd17d74ef078/controllers/media/index.js#L15
* https://github.com/maxzinkus/AtypicalSpeech/blob/fe6c70558e2afa3cd0259508f57fbd17d74ef078/controllers/upload/index.js#L13

**mysql2**: A library for connecting to and interacting with MySQL databases

**papaparse**: A library for parsing CSV and TSV files
* https://github.com/maxzinkus/AtypicalSpeech/blob/fe6c70558e2afa3cd0259508f57fbd17d74ef078/client/src/components/admin/AddScriptButton.js#L27C31-L27C31

**path**: The built-in path module in Node.js

**pm2**: A process manager for Node.js applications

**React**
* bootstrap: A popular CSS framework for creating responsive and mobile-friendly web applications.
* bootstrap-icons: A collection of over 1,500 free and open source icons for use with Bootstrap.
* react-bootstrap: A library for using Bootstrap components in React applications.
* react-csv-reader: A library for reading CSV files in React applications.
* react-router-dom: A library for routing in React applications.
* react-uploader: A library for uploading files in React applications.
* semantic-ui-css: A popular CSS framework for creating responsive and mobile-friendly web applications.
* semantic-ui-react: A library for using Semantic UI components in React applications.
  
**Sequelize ORM**
* sequelize: A library for object-relational mapping (ORM) in Node.js.
* sequelize-cli: A command-line interface for Sequelize.

### Installing

* For local installations, please follow the instructions below:
  1. Clone your desired version of this AtypicalSpeech repository. On your local terminal, please run something along the lines of ```git clone https://github.com/forrestpark/AtypicalSpeech.git```
  2. Install necessary packages and libraries to run the cloned repository, one pack for server side code and another for client side. To do this, from the repository’s root folder AtypicalSpeech, please run `npm install` and `cd client && npm install`.
  3. Download and install MySQL for our server side code and database to work. Please download MySQL and MySQL Workbench, respectively, from the following links:
     * MySQL: https://dev.mysql.com/downloads/mysql/
     * MySQL Workbench: https://dev.mysql.com/downloads/workbench/
     While you’re downloading and installing MySQL, you will be asked to create a root account. Please create a root account using root as the ID and use a password of your choice. Make sure you update the password on line 4 of [config/config.json](https://github.com/maxzinkus/AtypicalSpeech/blob/master/config/config.json) after you create an account so that the code’s credentials match with your MySQL’s credentials.
  4. Once you have MySQL and MySQL Workbench downloaded, open MySQL Workbench, and create a new schema named `speech_db`. The name has to be exactly `speech_db` for the program to start.
  5. We’re done configuring! To start the program on your local environment, please run the following commands from the root folder `AtypicalSpeech`:
     * `npm start`
     * `cd client && npm start`
  6. You should now be able to open the main entry point and dashboard via http://localhost:3001 and the admin dashboard via http://localhost:3001/admin

## Help

Please contact our team at jpark278@jhu.edu, jhuan185@jhu.edu, or laureano@jhu.edu.

## Authors

Jang Woo Park 
[@forrestpark](https://github.com/forrestpark)

Jim Huang
[@ameriania](https://github.com/ameriania)

Laureano Moro Velazquez

Max Zinkus
[@maxzinkus](https://github.com/maxzinkus)

## Version History

* 0.1
    * Initial Release

## License

MIT License

Copyright (c) 2023 HermeSpeech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
