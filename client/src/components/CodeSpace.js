import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Input, FormGroup, Label, Button, Spinner } from 'reactstrap';
import './CodeSpace.css';
import { useLocation } from 'react-router-dom';

const socket = io(process.env.REACT_APP_SOCKET); // Connect to the WebSocket server

const CodeSpace = () => {
    const location = useLocation();
    const { projectData } = location.state || {};
    const [projectId, setProjectId] = useState(projectData?.projectId || '');
    const [code, setCode] = useState(projectData?.projectCode || '');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [isRunning, setIsRunning] = useState(false); // For showing loading state
    const [isSaving, setIsSaving] = useState(false); // For saving state feedback

    // Join the room and set up socket listeners
    useEffect(() => {
        if (projectId) {
            socket.emit('join_room', { roomId: projectId });

            socket.on('code_update', (newCode) => {
                setCode(newCode); // Update code when receiving updates from other collaborators
            });

            return () => {
                socket.off('code_update'); // Clean up event listeners on unmount
            };
        }
    }, [projectId]);

    // Encode and decode functions for API requests
    const encode = (str) => Buffer.from(str, "binary").toString("base64");
    const decode = (str) => Buffer.from(str, 'base64').toString();

    // Function to execute code by sending it to the Judge0 API
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
                language_id: 54, // Set language_id dynamically if needed
                source_code: encode(code),
                stdin: encode(input)
            }
        };

        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Code execution error:", error);
            alert("Failed to execute the code.");
            setIsRunning(false); // Set loading state to false if there's an error
        }
    };

    // Polling function to get code output after submission
    const loop = async () => {
        setIsRunning(true); // Set loading state
        const data = await executeCode();

        if (!data?.token) {
            alert('Submission failed. Please try again.');
            setIsRunning(false);
            return;
        }

        const token = data.token;
        let result;
        let statusCode = 2; // Judge0 uses 1 (In Queue) and 2 (Processing) for ongoing submissions

        // Poll until the code execution is finished
        while (statusCode === 1 || statusCode === 2) {
            result = await getOutput(token);
            statusCode = result.status_id;
        }

        setIsRunning(false); // Stop loading spinner once done

        if (result?.stdout) {
            setOutput(decode(result.stdout)); // Set decoded output
        } else {
            setOutput(result?.status?.description || 'Error during code execution');
        }
    };

    // Fetch output using the token
    const getOutput = async (token) => {
        const options = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'x-rapidapi-key': process.env.REACT_APP_JUDGE0_API,
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Fetching output error:", error);
            alert("Failed to fetch the output.");
        }
    };

    // Handle code changes and broadcast them via WebSocket
    const handleEditorChange = (newCode) => {
        setCode(newCode);
        socket.emit('code_change', { roomId: projectId, code: newCode }); // Emit code changes
    };

    // Handle input changes in the input box
    const handleInput = (e) => {
        setInput(e.target.value);
    };

    // Save code to the database
    const saveCode = async () => {
        setIsSaving(true); // Show saving spinner

        try {
            const response = await fetch(`${process.env.REACT_APP_HOST}/api/addCodeToProject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token'), // Assumes token is stored in localStorage
                },
                body: JSON.stringify({
                    projectId: projectId,
                    code: code
                })
            });

            if (response.status === 200) {
                alert('Code saved successfully!');
            } else {
                alert('Failed to save code.');
            }
        } catch (error) {
            console.error('Error saving code:', error);
            alert('Error saving code.');
        } finally {
            setIsSaving(false); // Hide saving spinner
        }
    };

    return (
        <div>
            <div className="header">
                <h1>CodeSpace - Project ID: {projectId}</h1>
                <div className="button-container">
                    <button className="run-code-btn" onClick={loop} disabled={isRunning}>
                        {isRunning ? <Spinner size="sm" /> : 'Run Code'}
                    </button>
                    <button className="save-code-btn" onClick={saveCode} disabled={isSaving}>
                        {isSaving ? <Spinner size="sm" /> : 'Save Code'}
                    </button>
                </div>
            </div>
            <div className='screen'>
                <Editor
                    height="80vh"
                    width="75%"
                    language="c++" // Change this dynamically based on project or user selection
                    value={code}
                    onChange={handleEditorChange}
                />
                <div className='box'>
                    <div className="container input">
                        <FormGroup>
                            <Label for="exampleText"><h2>Input</h2></Label>
                            <Input
                                id="exampleText"
                                name="text"
                                type="textarea"
                                rows="10"
                                onChange={handleInput}
                                value={input}
                            />
                        </FormGroup>
                    </div>
                    <div className="container output">
                        <h2>Output</h2>
                        <p>{output}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeSpace;
