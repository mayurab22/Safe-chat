import React, { useState } from 'react'

function FindPeople(props) {
    const [userDetails, setUserDetails] = useState(null);
    const [searchWord, setSearchWord] = useState('');
    const [recv, setRecv] = useState(false)
    // useEffect(() => {
    const fetchUserDetails = async () => {
        // console.log("started fetching hhe details of the user");
        try {
            const response = await fetch("http://192.168.165.164:5010/admin/allUsers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": props.atlp
                },
                body: JSON.stringify({
                    searchString: searchWord
                })
            });
            const userData = await response.json();
            // console.log("the user data is", userData)
            if (userData.authorization) {
                setUserDetails(userData);
                setRecv(true);
            }
            else {
                alert("error fetching data");
            }

        } catch (error) {
            // console.error("Error fetching user details:", error);
        }
    };

    // if (props) {
    //     fetchUserDetails();
    // }

    // }, [props]);


    // if (!userDetails) {
    //     return <div>Loading find people...</div>;
    // }




    const handleClick = (event) => {
        const checkId = event.target.getAttribute('name');
        // console.log('Post ID:', checkId);
        // You can use the postId value here or pass it to another function
        props.chd(checkId)
    };

    return (
        <div id='findPeopleSection'>
            <div id="searchBarAreal">
                <input type="text" name="find" id="peopleSearch" placeholder='Find People' value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
                <span className="material-symbols-outlined" onClick={fetchUserDetails}>search</span>
            </div>
            <div id="requestsHolder">
            {recv ? userDetails.users.map(pst => (
                <div className='displayTemplate'>
                    <div className="userinfo">
                        <img src="./images/image.png" alt="profileImage" />
                        <div className="requestersDetails">
                            <h1>{pst.name}</h1>
                            <p>{pst.userName}</p>
                        </div>
                    </div>
                    <button name={pst.userName} onClick={handleClick}>Profile</button>
                </div>
            )) : <div>Loading find people...</div>
            }
            </div>
        </div >
    )
}

export default FindPeople