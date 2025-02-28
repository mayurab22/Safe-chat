import React, { useState, useEffect } from 'react';

const AuthForm = (props) => {
    const [formType, setFormType] = useState('login');
    const [ADID, setUsername] = useState('');
    const [ADname, setName] = useState('');
    const [ADPassword, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const handleFormSwitch = () => {
        setFormType((prevFormType) => (prevFormType === 'login' ? 'register' : 'login'));
    };

    const handleSubmit = async (props) => {
        // event.preventDefault();
        try {
            let response;
            if (formType === 'login') {
                response = await fetch("http://192.168.165.164:5010/admin/login", {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Content-Type": "application/json",
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({
                        ADID,
                        ADPassword
                    })
                });
                const feed = await response.json();
                // console.log("user login details", feed);
                if (feed.adminLogin === true) {
                    setToken(feed.token)
                }
                else {
                    alert("USERNAME or PASSWORD is incorrect");
                }

            } else {
                response = await fetch("http://192.168.165.164:5010/admin/register", {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Content-Type": "application/json",
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({
                        ADID,
                        ADname,
                        ADPassword
                    })
                });
                const feed = await response.json();
                // console.log("user registered details", feed);
                if (feed.adminReg === true) {
                    setToken(feed.token)
                }
                else {
                    alert("unable to regester try again");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (token) {
            // console.log("changed the params");
            // console.log(props.setTokenMain());
            localStorage.setItem('jwtToken', token);
            props.st(token);
            props.sa(true);
            props.tv();
        }
    }, [props,token])

    function clearForm() {
        setUsername('');
        setName('');
        setPassword('');
    }

    return (
        <div id='loginForm'>
            <form id='myForm' onSubmit={handleSubmit}>
                {formType === 'register' && (
                    <>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">ADname</span>
                            <input type="text" className="form-control" id="name" placeholder="SPF**" aria-label="Username" aria-describedby="basic-addon1" value={ADname} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </>
                )}
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">ADID</span>
                    <input type="text" className="form-control" placeholder="costumer@example.come" id="email" aria-label="username" aria-describedby="basic-addon2" value={ADID} onChange={(e) => setUsername(e.target.value)} />
                    <span className="input-group-text" id="basic-addon2">@example.com</span>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">PASSWORD</span>
                    <input type="tel" className="form-control" id="password" placeholder="*****" aria-label="Username" aria-describedby="basic-addon1" value={ADPassword} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary" type="button" id='submitter' onClick={handleSubmit}>SUBMIT</button>
                <input type="checkbox" className="btn-check" onClick={handleFormSwitch} id="btn-check" />
                <label className="btn btn-primary" htmlFor="btn-check" id='toggler'>Switch to {formType === 'login' ? 'Register' : 'Login'}</label>
                <button className="btn btn-primary" type="button" onClick={clearForm}>CLEAR</button>
            </form>
            {/* {token && <p>You are logged in!</p>} */}
        </div>
    );
};

export default AuthForm;