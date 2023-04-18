# HermeSpeechRecorder
Web application for speech recording

This readme will be updated soon

Installation instructions:

First we need to clone our github repository on its alpha version branch. On your local terminal, please run

git clone -b alpha_1.0 --single-branch https://github.com/forrestpark/AtypicalSpeech.git

Now we need to install necessary packages and libraries to run the cloned repository code, one pack for server side code and another for client side. To do this, from the repository’s root folder AtypicalSpeech, please run

	npm install

	and

	cd client
npm install

Now, for our server side code and database to work, we need to have MySQL downloaded. Please download MySQL and MySQL Workbench, respectively, from the following links:

MySQL: https://dev.mysql.com/downloads/mysql/
MySQL Workbench: https://dev.mysql.com/downloads/workbench/	

While you’re downloading and installing MySQL, you will be asked to create a root account. Please create a root account using root as the ID and use a password of your choice. Make sure you update the password on line 4 of config/config.json after you create an account so that the code’s credentials match with your MySQL’s credentials.

Once you have MySQL and MySQL Workbench downloaded, open MySQL Workbench, and create a new schema named speech_db. The name has to be exactly speech_db for the program to start.

We’re done configuring! To start the program on your local environment, please run the following commands from the root folder AtypicalSpeech:

npm start

and

cd client
npm start

