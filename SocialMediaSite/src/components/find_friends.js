import React, { useState } from 'react'

function FindPeople(props) {
    const [userDetails, setUserDetails] = useState(null);
    const [rectkn, setRectkn] = useState(false);
    const [serachStr, setserachStr] = useState('');
    // console.log("the receved prop is", props)
    // console.log("the receved prop is extracted", rectkn)
    // console.log("the receved token is in hook", rectkn)

    const fetchUserDetails = async (event) => {
        event.preventDefault();
        // console.log("the search string is", serachStr);
        try {
            const response = await fetch("http://192.168.165.164:5010/user/fetchFriends", {
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
            // console.log("the user data is", userData)
            if (userData.authorization) {
                setUserDetails(userData);
                setRectkn(true);
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
            await props.cht(checkId);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    return (
        <div id='findFriendsSection'>
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
                            <p>{pst.FUserName}</p>
                        </div>
                    </div>
                    <button name={pst.FUserName} onClick={handleAddRequest}>chat</button>
                </div>
            )) : <div>
                <h5>Search Friend</h5>
            </div>
            }
            </div>
        </div >
    )
}

export default FindPeople