import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Input, FormGroup, Label } from 'reactstrap';
import './CodeSpace.css';
const socket = io('http://localhost:5000');  // Connect to the WebSocket server

const CodeSpace = () => {
    const [projectId, setProjectId] = useState(1);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');

    const joinProject = () => {
        socket.emit('join_room', { roomId: projectId });
    };

    useEffect(() => {
        if (projectId) {
            // Join the room
            socket.emit('join_room', { roomId: projectId });

            // Listen for code updates
            socket.on('code_update', (newCode) => {
                setCode(newCode);
            });

            return () => {
                socket.off('code_update');
            };
        }

    }, [projectId]);
    const encode = (str) => {
        return Buffer.from(str, "binary").toString("base64")
    }
    const decode = (str) => {
        return Buffer.from(str, 'base64').toString()
    }

    const createNewProject = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/createProject', {
                title: 'My New Project',
                description: 'Project Description',
                collaborators: [],
            });
            setProjectId(response.data.projectId);
            alert(`Project created! Project ID: ${response.data.projectId}`);
        } catch (error) {
            alert('Error creating project');
        }
    };
    const executeCode = async () => {

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'x-rapidapi-key': '1499ef1da5msh2f69c6a0364434ap1ba126jsnea71dce8cba6',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                language_id: 54,
                source_code: encode(code),
                stdin: encode(input)
            }
        };

        try {
            const response = await axios.request(options);
            return response.data;

        } catch (error) {
            console.error(error);
        }
    }
    const handleEditorChange = (newCode) => {
        setCode(newCode);
        // socket.emit('code_change', { roomId: projectId, code: newCode });
    };
    const loop = async () => {
        let data = await executeCode();
        let token = data.token;
        let statusCode = 2;
        let result;
        while (statusCode == 2 || statusCode == 1) {
            result = await getOutput(token);
            statusCode = result.status_id;
            // console.log(result);
            // console.log(result);
        }
        // console.log(decode(result.stdout));
        if (result.stdout != null)
            setOutput(decode(result.stdout));
        else
            setOutput(result.status.description);
    }
    const getOutput = async (token) => {
        const options = {
            method: 'GET',
            url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'x-rapidapi-key': '1499ef1da5msh2f69c6a0364434ap1ba126jsnea71dce8cba6',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            // console.log(response.data);
            // response = await response.json();
            return response.data;
        } catch (error) {
            console.error(error);
        }

    }

    //     const response = await axios.post('https://ce.judge0.com/submissions/?base64_encoded=false&wait=false', {
    //         code,
    //         languageId: 63,  // 63 for JavaScript
    //         "stdin": "SnVkZ2Uw",
    //         headers: {
    //             'x-rapidapi-key': '1499ef1da5msh2f69c6a0364434ap1ba126jsnea71dce8cba6',
    //             'Content- Type': 'application/json'
    //         }
    //     });
    //   
    // }
    const handleInput = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
            />
            {/* <button onClick={joinProject}>Join Project</button> */}
            <div>
                <button onClick={loop}>Run Code</button>

            </div>
            <div className='screen'>
                <Editor
                    height="80vh"
                    width="75%"
                    language="c++"
                    value={code}
                    onChange={handleEditorChange}
                />
                <div className='box'>
                    <div className="container input">


                        <FormGroup>
                            <Label for="exampleText">
                                <h1>Input</h1>
                            </Label>
                            <Input
                                id="exampleText"
                                name="text"
                                type="textarea"
                                rows="10"
                                onChange={handleInput}
                            />
                        </FormGroup>
                    </div>
                    <div className="container output">
                        <h1>output</h1>
                        <p>{output}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeSpace;
