import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Input, FormGroup, Label } from 'reactstrap';
import './CodeSpace.css';
const socket = io(process.env.REACT_APP_SOCKET);   // Connect to the WebSocket server

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
            // Join the room on the server
            socket.emit('join_room', { roomId: projectId });

            // Listen for code updates
            socket.on('code_update', (newCode) => {
                setCode(newCode); // Update the code for all clients in the room
            });

            return () => {
                socket.off('code_update'); // Clean up on component unmount
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
            const response = await axios.post(`${process.env.REACT_HOST}/api/createProject`, {
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
                'x-rapidapi-key': process.env.REACT_APP_JUDGE0_API,
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
        // Emit the code change to the room
        socket.emit('code_change', { roomId: projectId, code: newCode });
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
                'x-rapidapi-key': process.env.REACT_APP_JUDGE0_API,
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
