import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'fetch';

import { Link, useNavigate } from 'react-router-dom'

import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';

import { Button, Table, Modal } from 'react-bootstrap';

function ScriptTabbedList() {

    const get_all_script_ids_URL = "/api/script/get_all_scripts";
    const delete_script_URL = "/api/script/delete_script";
    const get_script_URL = "/api/script/findScriptID";
    const edit_script_line_URL = "/api/script/update_script_line";
    const generic_fields = ["field1","field2","field3","field4","field5","field6","field7"]

    const [currentState, setCurrentState] = useState({all_scripts: null, tabbedlist: null});
    const [overlayScript, setOverlayScript] = useState({overlay_script: null, overlay_data: {utterances: [], details: []}, line_number: null});
    const [show, setShow] = useState(false);
    const [newDetails, setNewDetails] = useState({text: "", field1: "", field2: "", field3: "", field4: "", field5: "", field6: "", field7: ""})

    const handleClose = () => {
        setOverlayScript({...overlayScript, overlay_script: null})
        setShow(false)
    };

    const handleShow = async (script_id, line_number) => {
        console.log("handleShow")

        await axios.post(
            get_script_URL,
            {
                "script_id": script_id
            }
        )
        .then((response) => {
            console.log("fetch script data: ", response.data.utterances)
            setOverlayScript({...overlayScript, overlay_script: script_id, overlay_data: response.data.utterances, line_number: line_number})
            const utterances = response.data.utterances.utterances;
            const details = response.data.utterances.details;
            console.log("Details: ", details)
            setNewDetails({
                ...newDetails, 
                text: utterances[line_number], 
                field1: details[line_number].field1, 
                field2: details[line_number].field2, 
                field3: details[line_number].field3, 
                field4: details[line_number].field4,
                field5: details[line_number].field5, 
                field6: details[line_number].field6, 
                field7: details[line_number].field7
            })
        })
        .then(() => {
            setShow(true)
        })

    };

    const zip = (...arr) => {
        const zipped = [];
        arr.forEach((element, ind) => {
           element.forEach((el, index) => {
              if(!zipped[index]){
                 zipped[index] = [];
              };
              if(!zipped[index][ind]){
                 zipped[index][ind] = [];
              }
              zipped[index][ind] = el || '';
           })
        });
        return zipped;
     };

    const navigate = useNavigate();

    const handleClickAssignScript = (script_id) => {
        navigate('/assign-script-multiple-users', {
            state: {
                script_id : script_id
            }
        })
    }

    useEffect(() => {

        const handleTextChange = (event) => {
            setNewDetails({
                ...newDetails,
                text: event.target.value
            })
        }

        const handleDetailChange = (event, field) => {
            console.log("handle detail change ")
            switch (field) {
                case "field1" :
                    setNewDetails({
                        ...newDetails,
                        field1: event.target.value
                    })
                    break;
                case "field2" :
                    setNewDetails({
                        ...newDetails,
                        field2: event.target.value
                    })
                    break;
                case "field3" :
                    setNewDetails({
                        ...newDetails,
                        field3: event.target.value
                    })
                    break;
                case "field4" :
                    setNewDetails({
                        ...newDetails,
                        field4: event.target.value
                    })
                    break;
                case "field5" :
                    setNewDetails({
                        ...newDetails,
                        field5: event.target.value
                    })
                    break;
                case "field6" :
                    setNewDetails({
                        ...newDetails,
                        field6: event.target.value
                    })
                    break;
                case "field7" :
                    setNewDetails({
                        ...newDetails,
                        field7: event.target.value
                    })
                    break;
                default:
                    console.log("field: ", field);
                    console.log(event.target.value);
                    break;
            }
        }

        const renderDetailFieldForm = () => {
            const forms = generic_fields.map((field) => {
                return (
                    <Form.Group className="mb-3" controlId={field}>
                          <Form.Label>{field}</Form.Label>
                          <Form.Control
                            type={field}
                            placeholder={overlayScript.overlay_data.details[overlayScript.line_number] === undefined ? "" : overlayScript.overlay_data.details[overlayScript.line_number][field] }
                            defaultValue={overlayScript.overlay_data.details[overlayScript.line_number] === undefined ? "" : overlayScript.overlay_data.details[overlayScript.line_number][field] }
                            // value={overlayScript.overlay_data.details[overlayScript.line_number] === undefined ? "" : overlayScript.overlay_data.details[overlayScript.line_number][field] }
                            onChange={(event) => {
                                handleDetailChange(event, field)
                            }}
                            autoFocus
                          />
                        </Form.Group>
                )
            })
            return forms;
        }

        const renderEditLineModal = () => {
            // console.log("detail: ", overlayScript.overlay_data.details[overlayScript.line_number]);
            return (
                <>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Edit line; script #{overlayScript.overlay_script} line #{overlayScript.line_number}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group className="mb-3" controlId="text">
                          <Form.Label>text</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={overlayScript.line_number === null ? "" : overlayScript.overlay_data.utterances[overlayScript.line_number] }
                            defaultValue={overlayScript.line_number === null ? "" : overlayScript.overlay_data.utterances[overlayScript.line_number] }
                            onChange={handleTextChange}
                            autoFocus
                          />
                        </Form.Group>
                        {renderDetailFieldForm()}
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleEditScriptLine}>
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              );
        }

        const handleEditScriptLine = async () => {
            if (window.confirm('Are you sure you wish to edit this line?')) {
                fetch(edit_script_line_URL, {
                    method: 'PUT',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        "script_id": overlayScript.overlay_script,
                        "line_number": overlayScript.line_number,
                        "new_utterance": newDetails.text,
                        "new_details": {
                            "field1": newDetails.field1,
                            "field2": newDetails.field2,
                            "field3": newDetails.field3,
                            "field4": newDetails.field4,
                            "field5": newDetails.field5,
                            "field6": newDetails.field6,
                            "field7": newDetails.field7
                        }
                    })
                })
                .then(() => {
                    handleClose();
                })
            }
        }

        const handleClickDeleteScript = async (script_id) => {
            if (window.confirm('Are you sure you wish to delete this script?')) {
                fetch(delete_script_URL, {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        'script_id': script_id
                    })
                })
                .then(() => {
    
    
                    // var new_scripts = currentState.all_scripts;
                    // var script_idx = 0;
                    // for (var i = 0; i < new_scripts.size(); i++) {
                    //     if (new_scripts[i]["id"] === script_id) {
                    //         script_idx = i;
                    //     }
                    // }
                    // delete new_scripts[script_idx];
                    // setCurrentState({...currentState, all_scripts: new_scripts})
                })
            }
        }

        function renderScriptModalButton(script_id) {
            return (
                <Button onClick={() => {handleClickAssignScript(script_id)}}>
                    Assign this script to users
                </Button>
            )
        }

        function renderEditScriptButton(script_id) {
            return (
                <Button onClick={() => {handleClickAssignScript(script_id)}}>
                    Edit this script
                </Button>
            )
        }

        function renderDeleteScriptButton(script_id) {
            return (
                <Button variant="outline-danger" onClick={() => {handleClickDeleteScript(script_id)}}>
                    Delete
                </Button>
            )
        }

        function handleClickScriptLine(script_id, line_number, text, details) {
            console.log("handleClickScriptLine")

            // handleShow()

            // navigate('/edit_script_line', {
            //     state: {
            //         script_id : script_id,
            //         line_number: line_number,
            //         text: text,
            //         details: details
            //     }
            // })
        }

        function renderScriptDetailsTable(script) {
            var action_type_script = script.utterances.details[1].hasOwnProperty("action")
            if (action_type_script) {
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                        <th>Line #</th>
                        <th>Utterance</th>
                        <th>Action</th>
                        <th>Object</th>
                        <th>Location</th>
                        </tr>
                    </thead>

                    <tbody>
                        {zip(script.utterances.utterances, script.utterances.details).map((utterance, index) => {
                            if (index === 0) {
                                return;
                            }

                            var text = utterance[0];
                            var details = utterance[1];

                            return (
                                // <tr onClick={() => handleClickScriptLine(text, details)}>

                                (<tr onClick={() => handleShow(script.id, index)}>
                                    <td>{index}</td>
                                    <td>{text}</td>
                                    <td>{details.action}</td>
                                    <td>{details.object}</td>
                                    <td>{details.location}</td>
                                </tr>)
                            )
                        })}
                        
                    </tbody>
                    </Table>
                );
            }

            else {
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                        <th>Line #</th>
                        <th>Utterance</th>
                        <th>field1</th>
                        <th>field2</th>
                        <th>field3</th>
                        <th>field4</th>
                        <th>field5</th>
                        <th>field6</th>
                        <th>field7</th>
                        </tr>
                    </thead>

                    <tbody>
                        {zip(script.utterances.utterances, script.utterances.details).map((utterance, index) => {
                            if (index === 0) {
                                return;
                            }

                            var text = utterance[0];
                            var details = utterance[1];

                            // {renderEditLineModal(script.id, index, text, details)}

                            return (
                                <tr onClick={() => handleShow(script.id, index)}>
                                {/* <tr onClick={() => handleClickScriptLine(text, details)}> */}
                                    <td>{index}</td>
                                    <td>{text}</td>
                                    <td>{details.field1}</td>
                                    <td>{details.field2}</td>
                                    <td>{details.field3}</td>
                                    <td>{details.field4}</td>
                                    <td>{details.field5}</td>
                                    <td>{details.field6}</td>
                                    <td>{details.field7}</td>
                                </tr>
                            )
                        })}
                        
                    </tbody>
                    </Table>
                );
            }
        }

        function renderScriptsTabbedList(all_scripts) {

            console.log("all_scripts: ", all_scripts)
            return (
                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                  <Row>

                    <Col sm={2}>
                      <ListGroup>
                        {all_scripts.map((script) => {
                            var href = "#" + script.id
                            return (
                                <ListGroup.Item action href={href}>
                                    {script.id}
                                </ListGroup.Item>
                            )
                        })}
                        </ListGroup>
                    </Col>

                    <Col sm={8}>
                      <Tab.Content>
                        {all_scripts.map((script) => {
                            var href = "#" + script.id
                            return (
                                <Tab.Pane eventKey={href}>
                                    <div className='large_font_blue_left'>
                                        Script #{script.id}
                                    </div>

                                    <div className='padding_bottom_20'>
                                        {renderScriptModalButton(script.id)} {renderDeleteScriptButton(script.id)}
                                    </div>

                                    {renderScriptDetailsTable(script)}

                                {renderEditLineModal(script.id)}

                                </Tab.Pane>
                            )
                        })}
                      </Tab.Content>
                    </Col>

                  </Row>
                </Tab.Container>
              );
        }

        async function fetchData() {
            // fetch all users to display all users on admin page
            const fetched_scripts = (await axios.get(get_all_script_ids_URL));

            const all_scripts = fetched_scripts.data.map((script) => {
                return script;
            })

            const renderedTabbedList = renderScriptsTabbedList(all_scripts);

            setCurrentState({...currentState, all_scripts: all_scripts, tabbedlist: renderedTabbedList});
        }

        fetchData();
    }, [show, newDetails])

    return (
        <div>
            {currentState.tabbedlist}
        </div>
    )
        
}

export default ScriptTabbedList