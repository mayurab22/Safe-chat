import React, { useState } from 'react'

function FindPeople(props) {
    const [userDetails, setUserDetails] = useState(null);
    const [rectkn, setRectkn] = useState(false);
    const [serachStr, setserachStr] = useState('');

    const fetchUserDetails = async (event) => {
        try {
            const response = await fetch("http://192.168.165.164:5010/user/allUsers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": props.atlp
                },
                body: JSON.stringify({
                    searchString: serachStr
                })
            });
            const userData = await response.json();
            // console.log("the user data of people is", userData)
            if (userData.authorization) {
                setUserDetails(userData);
                setRectkn(true)
            }
            else {
                alert("unauthorized user")
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };



    const handleAddRequest = async (event) => {
        // console.log("enterd the requesting funciton")
        const checkId = event.target.getAttribute('name');
        // console.log('Post ID:', checkId);
        // You can use the postId value here or pass it to another function
        try {
            const response = await fetch("http://192.168.165.164:5010/user/addRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": props.atlp
                },
                body: JSON.stringify({
                    addeeUname: checkId
                })
            })
            // .then(res => {
            const userData = await response.json();
            if (userData.friendExistence && userData.authorization) {
                alert("the user is already your friend or you have already requested him");
            }
            else if (userData.authorization && !userData.friendExistence) {
                alert("friend request sent successfully");
            }
            else {
                alert("unauthorized user when requested")
            }
            // });

        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    return (
        <div id='findPeopleSection'>
            <div id="searchBarAreal">
                <input type="text" name="find" id="peopleSearch" placeholder='Find People' value={serachStr} onChange={(e) => setserachStr(e.target.value)} />
                <span className="material-symbols-outlined" onClick={fetchUserDetails}>search</span>
            </div>
            <div id="requestsHolder">
            {rectkn ? userDetails.users.map(pst => (
                <div className='displayTemplate'>
                    <div className="userinfo">
                        <img src="./images/image.png" alt="profileImage" />
                        <div className="requestersDetails">
                            <h1>{pst.name}</h1>
                            <p>{pst.userName}</p>
                        </div>
                    </div>
                    <button name={pst.userName} onClick={handleAddRequest}>request</button>
                </div>
            )) : <div>
                <h5>Search People</h5>
            </div>
            }
            </div>
        </div >
    )
}

export default FindPeople