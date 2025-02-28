import React from 'react';
import { useState, useEffect } from 'react';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
// let buttonType = 'mic';


function ChatArea(props) {

    // const messageInputRef = useRef(null);
    // clean useState definitions
    const [userDetails, setUserDetails] = useState(null);
    // const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState('');
    // const [webSocMsg, setWebSocMsg] = useState('')
    // const [inputMessage, setInputMessage] = useState('')
    const [audioMessage, setAudioMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [dataReceived, setdataReceved] = useState(false)
    const [showToast, setShowToast] = useState(false);
    const [chatted, setChatted] = useState(false)

    // false code starts here
    useEffect(() => {
        async function getUserDetails() {
            const response = await fetch("http://192.168.165.164:5010/user/fetchChats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": props.atlp
                },
                body: JSON.stringify({
                    reqeeName: props.chprom
                })
            })
            const userData = await response.json();
            console.log("the obatined chat details is", userData);
            setUserDetails(userData);
            if (userData) {
                if(userData.chatArr.length !== 0){
                    setChatted(true);
                    if(userData.chatArr[0].chats){
                        setMessages(userData.chatArr[0].chats);
                        setdataReceved(true);
                    }
                    else{
                        console.log("no chats done yet")
                    }
                }
            }
                else{
                    console.log("error fetching chats")
                }
            
            //*********need to handel the respose from the server */
            handleIncomingMessage(userData)

            const newSocket = new WebSocket('ws://192.168.165.164:5006'); // Replace with your WebSocket server address
            newSocket.onopen = () => {
                console.log('WebSocket connected');
            };

            newSocket.onmessage = event => {
                handleIncomingMessage(event.data);
            };
            // setSocket(newSocket);
        }
        if (props) {
            getUserDetails();
        }
        return () => {
            setUserDetails(null);
            setMessages('');
            // setSocket(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    const handleIncomingMessage = jsonData => {
        try {
            const receivedMessage = JSON.parse(jsonData);
            // console.log("the received message from ewb socket is", receivedMessage);
            setMessages(prevMessages => [...prevMessages, { direction: true, message: receivedMessage.text }]);
            if(!chatted){
                setChatted(true);
            }
            if(!dataReceived){
                setdataReceved(true);
            }
            triggerToast();
        } catch (error) {
            console.error('Error parsing JSON:', {error});
        }
    };

    const sendMessage = async () => {
        // console.log("enterd the text sending function");
        const response = await fetch("http://192.168.165.164:5010/user/addChat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": props.atlp
            },
            body: JSON.stringify({
                userName: props.chprom,
                text: audioMessage
            })
        })
        const resData = await response.json();
        // console.log("the obtained data afer adding the rext is", resData);
        if (resData.succ) {
            setMessages(prevMessages => [...prevMessages, { direction: false, message: resData.safeText }]);
            setAudioMessage("");
        }
    };

    const handleClick = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        if (!isListening) {
            setIsListening(true);

            recognition.start();

            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                setAudioMessage(transcript);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        } else {
            recognition.stop();
            setIsListening(false);
        }
    }

    const triggerToast = () => {
        // console.log("tost launcher initiated")
        setShowToast(true);
        // console.log("launched toast")
        // Hide the toast after some time (e.g., 3 seconds)
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };
    //need to handel the message yet to be done after apis are ready

    return (
        <>

            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                <div id="liveToast" className={`toast ${showToast ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">new message</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
                    </div>
                    <div className="toast-body">
                        <p>{props.chprom}</p>
                    </div>
                </div>
            </div>
            <div id='chatSection'>
                <div id="namstatsec">
                    <img src="./images/image.png" alt="" />
                    <div className='requestersDetails'>
                        {userDetails ?
                            <>
                                <h1>{props.chprom}</h1>
                                <p>{userDetails.chatArr.friendName}</p></> : <p>fetching details</p>
                        }
                    </div>
                </div>
                {/* <div id="displayChats">
                    <div className="chatDisplayTemplate">
                        <p>hello</p>
                    </div>
                </div> */}
                <div id="chatDisplaySection">
                    {dataReceived ? messages.map(pst => (
                        <div className={pst.direction?'displayChatsL': 'displayChatsR'}>
                            <div className="chatDisplayTemplate">
                                <p>{pst.message}</p>
                            </div>
                        </div>
                    )) : <div>{chatted?<h4>no chats yet</h4>:<h4>fetching chats</h4>}
                    
                    </div>
                    }
                </div>

                <div id="searchBarArea">
                    <input type="text" name="find" id="peopleSearch" placeholder='text here' value={audioMessage} onChange={(e) => setAudioMessage(e.target.value)} />
                    <div className="sendMic" id="SMbtns">
                        <span className="material-symbols-outlined" onClick={sendMessage}>send</span>
                        <span className="material-symbols-outlined" id="SMbtns" onClick={handleClick}>{isListening ? 'graphic_eq' : 'mic'}</span>
                        {/* <span class="material-symbols-outlined">graphic_eq</span> */}
                    </div>
                </div>
            </div>
        </>
    )

}

export default ChatArea;