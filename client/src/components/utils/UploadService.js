import axios from 'fetch';
import Papa from "papaparse";

import React from 'react'
import { useState } from "react";

const readCSV = (file) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {

        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        console.log("results.data: ", results.data);
                // // Filtered Column Names
                console.log("rowsArray[0]: ", rowsArray[0]);

                // // Filtered Values
                console.log("valuesArray: ", valuesArray);

        return rowsArray[0];


      },
    });
  };

const preprocess = (data) => {

    for (var i = 0; i < data.length; i++) {
        console.log(data[i]["speakerId"])
    }
}

const process = (file, onUploadProgress) => {

    readCSV(file)
    .then((data) => {
        console.log("callback data: ", data)
    })
    
    // console.log("data: ", data)
    // console.log("rowsArray: ", data[0])
    // console.log("valuesArray: ", data[1])

    // preprocess(data[1]);

    // const bodyFormData = new FormData();
    // // bodyFormData.append("data", JSON.stringify(data))

    // const process_url = "/api/script/process_script"

    // return axios.post(process_url, {
    //     headers: {
    //     'Content-Type': 'application/json'
    //     }
    // })

}

// const process = (file, onUploadProgress) => {

//     console.log("service process: " , file);

//     var formData = new FormData();
//     formData.append("file", file);
//     formData.append('productName', 'Node.js Stickers');

//     console.log("formData: ", serializeForm(formData));

//     const process_url = "/api/script/process_script"

//     return axios.post(process_url, formData, {
//         headers: {
//         'Content-Type': 'multipart/form-data'
//         }
//     })
// };

const getFiles = () => {
  return fetch("/files");
};

const FileUploadService = {
  process,
  getFiles,
};

export default FileUploadService; 