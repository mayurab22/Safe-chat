import React, { useState } from 'react';

const AuthForm = (props) => {
    const [formType, setFormType] = useState('login');
    const [userName, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const buttonElement = document.querySelector('.btn');
    // eslint-disable-next-line no-unused-vars
    const [uidAvailability, setuidAvailability] = useState(null)

    const handleFormSwitch = () => {
        setFormType((prevFormType) => (prevFormType === 'login' ? 'register' : 'login'));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log("triggered the submit function")
            try {
                let response;
                if (formType === 'login') {
                    response = await fetch("http://192.168.165.164:5010/user/login", {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            "Content-Type": "application/json",
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    });
                    const feed = await response.json();
                    // console.log("user login details", feed);
                    if (feed.userLogin === true && feed.status === true) {
                        alert("login successful");
                        setToken(feed.token)
                        localStorage.setItem('jwtToken', token);
                        try {
                            // console.log(feed.token);
                            await props.st(feed.token)
                            props.tv();
                            
                        } catch (error) {
                            console.log("the erro in updating data in login rregesteris", error)
                        }
                    }
                    else if(feed.userLogin === true &&  feed.status === false) {
                        alert("This account has been blocked under the cyber bullying policy of the terms and conditions")
                    }
                    else {
                        alert("USERNAME or PASSWORD is incorrect");
                    };
                    localStorage.setItem('jwtToken', token);
                    // props.st(token);
                    // props.sa(true);
                } else {
                    response = await fetch("http://192.168.165.164:5010/user/register", {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            "Content-Type": "application/json",
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: JSON.stringify({
                            userName: userName,
                            name: name,
                            email: email,
                            phoneNumber: phoneNumber,
                            password: password
                        })
                    })
                    const feed = await response.json();
                    // console.log("user registered details", feed);
                    if (feed.userIdExistence === true) {
                        alert("the userName is not available");
                        buttonElement.setAttribute('class', 'btn btn-danger');
                    }
                    else if (feed.userReg === true && feed.token === null  && feed.emailExistence === false) {
                        alert("unable to regester at the moment")
                    }
                    else if (feed.userReg === true && feed.token && feed.emailExistence === false) {
                        alert("registration successful");
                        setToken(feed.token)
                        localStorage.setItem('jwtToken', token);
                        await props.st(feed.token);
                        // then(()=>{
                            props.tv();
                        // });
                    }
                    else if(feed.userReg === false && feed.emailExistence === false){
                        alert("could not regester try again")
                    }
                    else {
                        alert("The email has already bee registered try again with a different email id ");
                    }
                }
                
            } catch (error) {
                console.error(error);
            }
    
    };


    function clearForm() {
        setUsername('');
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
    }

    async function availabilityChecker(event){
        event.preventDefault();
        await fetch("http://192.168.165.164:5010/user/checkUsrIDAvailability", {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Content-Type": "application/json",
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({
                        "chID": userName
                    })
                }).then(res => res.json())
                .then(data => {
                    // console.log(data);
                    if (data.usrIDAvailable === true) {
                        // alert("Username is available");
                        buttonElement.setAttribute('class', 'btn btn-success');
                        setuidAvailability(true);
                        // console.log(uidAvailability);

                    } else {
                        // alert("Username is not available");
                        buttonElement.setAttribute('class', 'btn btn-danger');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
    }

    return (
        <div id='loginForm'>
            {/* <button onClick={handleFormSwitch}>Switch to {formType === 'login' ? 'Register' : 'Login'}</button>
            <br />
            <br /> */}
            <form id='myForm' onSubmit={handleSubmit}>
                {formType === 'register' && (
                    <>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">NAME</span>
                            <input type="text" required className="form-control" id="name" placeholder="costumer" aria-label="Username" aria-describedby="basic-addon1" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">USERNAME</span>
                            <input type="tel" required className="form-control" id="username" placeholder="costumer123" aria-label="Username" aria-describedby="basic-addon1" value={userName} onChange={(e) => setUsername(e.target.value)} />
                            <button  className='btn btn-primary' onClick ={availabilityChecker} >Check Availability</button>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">PHONE NUMBER</span>
                            <input type="tel"  required  title="please enter a valid 10 digit phone number" className="form-control" id="phoneNumber" placeholder="987654****" aria-label="Username" aria-describedby="basic-addon1" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                    </>
                )}
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">EMAIL</span>
                    <input type="email" required className="form-control" placeholder="costumer@example.com"  title="enter a valid email id of the form costumer@example.come" id="email" aria-label="username" aria-describedby="basic-addon2" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">PASSWORD</span>
                    <input type="password" required className="form-control" id="password" placeholder="*****" aria-label="Username" aria-describedby="basic-addon1" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary" type="submit" id='submitter'>SUBMIT</button>
                <input type="checkbox" className="btn-check" onClick={handleFormSwitch} id="btn-check" />
                <label className="btn btn-primary" htmlFor="btn-check" id='toggler'>Switch to {formType === 'login' ? 'Register' : 'Login'}</label>
                <button className="btn btn-primary" type="button" onClick={clearForm}>CLEAR</button>
            </form>
            {/* {token && <p>You are logged in!</p>} */}
        </div>
    );
};

export default AuthForm;