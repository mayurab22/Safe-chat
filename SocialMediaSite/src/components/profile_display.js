import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);


function ProfileDisplay(props) {
    const [userDetails, setUserDetails] = useState(null);
    const [fresh, setfresh] = useState(1)
    // console.log("the received prop is", props)
    // console.log("the received prop is extracted", props.atlp)
    // console.log("the received token is in hook", props.atlp)



    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch("http://192.168.165.164:5010/user/usrProfile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": props.atlp,
                    },
                })
                const userData = await response.json();
                // console.log("User data:", userData);
                setUserDetails(userData);
                localStorage.setItem('name', userData.name);
                localStorage.setItem('email', userData.email);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        if (props) {
            fetchUserDetails()
        }
    }, [props, fresh]);

    function refresh() {
        setfresh(fresh + 1);
    }

    if (!userDetails) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <div className='profileSection' id='profileDetails'>
                <div id='refBtn'>
                    <p>PROFILE</p>
                    <button onClick={refresh}>
                        <span class="material-symbols-outlined" >
                            refresh
                        </span>
                    </button>
                </div>
                <div id="profileData">

                    <div className="profileSplits">
                        <img src="./images/image.png" alt="profile_picture" />
                        <div id="userDetails">
                            <ul>
                                <li><b>Name : </b>{userDetails.name}</li>
                                <li><b>Username : </b>{userDetails.userName}</li>
                                <li><b>Email : </b>{userDetails.email}</li>
                                <li><b>Phone number : </b>{userDetails.phoneNumber}</li>
                            </ul>
                        </div>
                    </div>
                    <hr />
                    <div className="profileSplits">
                        <div id="userStatus">
                            <p>Status :  ACTIVE</p>
                            <p>good texts :  {userDetails.goodTexts}</p>
                            <p>bad texts :  {userDetails.badTexts}</p>
                            <p>score:  {userDetails.badTexts ? ((userDetails.goodTexts / ((userDetails.goodTexts + userDetails.badTexts))) * 100).toFixed(2) : <>100%</>}</p>
                        </div>
                        <div id='graph'>
                            <Doughnut data={{
                                labels: ['Good', 'Bad'],
                                datasets: [
                                    {
                                        label: 'No.',
                                        data: [userDetails.goodTexts, userDetails.badTexts],
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.5)',
                                            'rgba(54, 162, 235, 0.5)',
                                        ],
                                        borderColor: [
                                            'rgba(255, 99, 132, 1)',
                                            'rgba(54, 162, 235, 1)',
                                        ],
                                        borderWidth: 1,
                                    },
                                ],
                            }} />
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}


export default ProfileDisplay