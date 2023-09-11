import React, { useEffect, useState, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'

import UploadService from "../utils/UploadService";

import axios from 'fetch';

import Papa from "papaparse";

function AddScriptButton() {

    const [selectedFiles, setSelectedFiles] = useState(null);
    const [progressInfos, setProgressInfos] = useState({ val: [] });
    const [message, setMessage] = useState([]);
    const [fileInfos, setFileInfos] = useState([]);
    const progressInfosRef = useRef(null)
    const [onetime, setOnetime] = useState(false);

    const selectFiles = (event) => {
        setSelectedFiles(event.target.files);
        setProgressInfos({ val: [] });
    };

    const readCSV = (file) => {
        let data;
        return new Promise((resolve) => {
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
                  
                  data = results.data;
                  resolve(data);
                },
              });
        })
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        
    };

    const process_file = (file, onUploadProgress) => {
        return readCSV(file)
        .then(async (data) => {

            console.log("promise data 1: ", data)
            // dict (key : scriptID, value : dict( utterances : List[str], details : List[dict] ) )
            var scriptID2utterances = {}

            // preprocessing
            for (var i = 0; i < data.length; i++) {
                var scriptID = data[i]['scriptID'];

                if (!(scriptID in scriptID2utterances)) {
                    scriptID2utterances[scriptID] = {"utterances" : [""], "details": [{}]}
                }

                // console.log("scriptID2utterances[scriptID][utterances]: ", scriptID2utterances[scriptID]["utterances"])

                // var utterance_detail = {
                //   "action": data[i]['action'], 
                //   "object": data[i]['object'], 
                //   "location": data[i]['location']
                // }

                var utterance_detail = {
                  "field1": data[i]['field1'], 
                  "field2": data[i]['field2'], 
                  "field3": data[i]['field3'],
                  "field4": data[i]['field4'],
                  "field5": data[i]['field5'],
                  "field6": data[i]['field6'],
                  "field7": data[i]['field7'],
                }

                // eslint-disable-next-line no-unused-expressions
                scriptID2utterances[scriptID]["utterances"].push(data[i]["transcription"]);
                // eslint-disable-next-line no-unused-expressions
                scriptID2utterances[scriptID]["details"].push(utterance_detail);

            }

            console.log("scriptID2utterances: ", scriptID2utterances)

            for (const scriptID in scriptID2utterances) {
              var params = {"script_id": scriptID, "utterances": {"utterances": scriptID2utterances[scriptID]["utterances"], "details": scriptID2utterances[scriptID]["details"]}}

              await axios.put("/api/script/add_utterances", params);
            }

            return data;
        })
        .then((data) => {
            
            // return fetch("/api/script/process_script", {
            // method: 'POST',
            // headers: {'Content-Type':'application/json'},
            // body: JSON.stringify({
            //     'data': data
            // })
        // })
        });
    }

    const process = (idx, file) => {
        let _progressInfos = [...progressInfosRef.current.val];

        return process_file(file, (event) => {
          _progressInfos[idx].percentage = Math.round(
            (100 * event.loaded) / event.total
          );
          setProgressInfos({ val: _progressInfos });
        })
          .then(() => {
            setMessage((prevMessage) => ([
              ...prevMessage,
              "Processed the file successfully: " + file.name,
            ]));
            setOnetime(true);
          })
          .catch(() => {
            _progressInfos[idx].percentage = 0;
            setProgressInfos({ val: _progressInfos });
    
            setMessage((prevMessage) => ([
              ...prevMessage,
              "Could not upload the file: " + file.name,
            ]));
          });
    };

    const uploadFiles = () => {
        const files = Array.from(selectedFiles);
    
        let _progressInfos = files.map(file => ({ percentage: 0, fileName: file.name }));
    
        progressInfosRef.current = {
            val: _progressInfos,
        }

        console.log("files: ", files);
    
        const uploadPromises = files.map((file, i) => {
            console.log("uploadPromises file: ", file)
            console.log("uploadPromises i: ", i)
            process(i, file)
        });
    
        Promise.all(uploadPromises)
          .then(() => UploadService.getFiles())
          .then((files) => {
            setFileInfos(files.data);
          });
    
        setMessage([]);
    };

    return (
        <div>
          {progressInfos && progressInfos.val.length > 0 &&
            progressInfos.val.map((progressInfo, index) => (
              <div className="mb-2" key={index}>
                <span>{progressInfo.fileName}</span>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-info"
                    role="progressbar"
                    aria-valuenow={progressInfo.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: progressInfo.percentage + "%" }}
                  >
                    {progressInfo.percentage}%
                  </div>
                </div>
              </div>
            ))}
    
          <div className="row my-3">
            <div className="col-8">
              <label className="btn btn-default p-0">
                <input type="file" multiple onChange={selectFiles} accept=".csv"/>
              </label>
            </div>
    
            <div className="col-4">
              <button
                className="btn btn-success btm-lg"
                disabled={!selectedFiles || onetime}
                onClick={uploadFiles}
              >
                Generate
              </button>
            </div>
          </div>
    
          {message.length > 0 && (
            <div className="alert alert-secondary" role="alert">
              <ul>
                {message.map((item, i) => {
                  return <li key={i}>{item}</li>;
                })}
              </ul>
            </div>
          )}
    
          <div className="card">
            <div className="card-header">List of Files</div>
            <ul className="list-group list-group-flush">
              {fileInfos &&
                fileInfos.map((file, index) => (
                  <li className="list-group-item" key={index}>
                    <a href={file.url}>{file.name}</a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      );

}

export default AddScriptButton