import React, { useState, useEffect } from 'react';

function ChatComponent(props) {
    // eslint-disable-next-line no-unused-vars
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [log, setLog] = useState('');
    // const name = props.nm;
    // console.log(name)
    const item = localStorage.getItem('name');
    const eitem = localStorage.getItem('email');
    const [isListening, setIsListening] = useState(false);
    const [rectkn, setRectkn] = useState(null);
    const [userList, setUserList] = useState([]);
    // Connect to WebSocket server on component mount
    useEffect(() => {
        const newSocket = new WebSocket('ws://192.168.120.164:5006'); // Replace with your WebSocket server address

        newSocket.onopen = () => {
            // console.log('WebSocket connected');
        };

        newSocket.onmessage = event => {
            handleIncomingMessage(event.data);
        };

        setSocket(newSocket);

        // Clean up WebSocket connection on component unmount
        return () => {
            newSocket.close();
        };
        

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[rectkn]);
    useEffect(() => {
        setRectkn(props.atlp);
    }, [props.atlp]);

    if (!userList) {
        return <div>Loading...</div>;
    }
    // console.log(userList);

    // Function to handle incoming messages
    const handleIncomingMessage = jsonData => {
        try {
            const receivedMessage = JSON.parse(jsonData);
            setMessages(prevMessages => [...prevMessages, receivedMessage]);
            updateLog(receivedMessage);
            // console.log(messages, "the received message");
            // console.log(receivedMessage, "the received message");
        } catch (error) {
            // console.error('Error parsing JSON:', error);
        }
    };

    // Function to send message
    const sendMessage = () => {
        const newMessage = {
            email: eitem,
            author: item, // Replace with the user's name or ID
            message: inputMessage
        };
        // console.log(newMessage);
        socket.send(JSON.stringify(newMessage));
        setInputMessage('');
        // updateLog(newMessage);
    };

    // Function to update the log
    const updateLog = message => {
        // console.log(message, " has enterd the message adding function");
        // if(message.author !== item){
            // console.log(message.author,message.message.extractedText);
            setLog(prevLog => prevLog + `${message.author}: ${message.message.extractedText}\n`);
        // }
    };

        const handleClick = () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            if (!isListening) {
                setIsListening(true);
                setInputMessage('');
                recognition.start();

                recognition.onresult = (event) => {
                    const current = event.resultIndex;
                    const transcript = event.results[current][0].transcript;
                    setInputMessage(transcript);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };
            } else {
                recognition.stop();
                setIsListening(false);
            }
        }


    return (
        <div id='chatArena'>
            <h3>class room chat</h3>
            {/* <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.author}: </strong>
                        {message.message}
                    </div>
                ))}
            </div> */}
            <textarea id='chatArea' value={log} readOnly rows={15} cols={50} />
            <div id="searchBarArea">
                <input type="text" name="find" id="peopleSearch" placeholder='text here' value={inputMessage} onChange={e => setInputMessage(e.target.value)}/>
                <div className="sendMic" id="SMbtns">
                    <span className="material-symbols-outlined" onClick={sendMessage}>send</span>
                    <span className="material-symbols-outlined" id="SMbtns" onClick={handleClick}>{isListening ? 'graphic_eq' : 'mic'}</span>
                    {/* <span class="material-symbols-outlined">graphic_eq</span> */}
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
