const express = require('express');
const mysql = require('mysql2');
const db = require('./models');
const bodyParser = require('body-parser');
const cors = require('cors');

class App {

    constructor () {
        console.log("app.js");

        this.app = express();

        this.dbConnection();

        this.setMiddleWare();

        this.getRouting();
    }

    dbConnection() {
        // db.sequelize.sync({force: true})
        db.sequelize.sync()
        // db.sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .then(() => {
            console.log('DB sync complete.')
        })
        .catch(err => {
            console.log("Unable to connect to the database: ", err);
        });
    }

    setMiddleWare() {
        this.app.use(express.json());

        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({ extended: false }));
        
        this.app.use(cors());
    }

    getRouting() {
        this.app.use(require('./controllers'));
    }

}

module.exports = new App().app;