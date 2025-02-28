import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
// import { toBeChecked } from '@testing-library/jest-dom/matchers';
ChartJS.register(ArcElement, Tooltip, Legend);

function ProfileDisplayAdmin(props) {
    const [isChecked, setChecked] = useState(true);
    const [rec, setRec] = useState(false)
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch("http://192.168.165.164:5010/admin/usrProfile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",

                    },
                    body: JSON.stringify({
                        id: props.chkdtl,
                    })
                });
                const userData = await response.json();
                if (userData.success) {
                    setUserDetails(userData);
                    // console.log("the user details are in admin profile display", userData);
                    setChecked(userData.user.accountStatus);
                    setRec(true);

                }
                else {
                    alert("unauthorized user");
                }
            } catch (error) {
                // console.error("Error fetching user details:", error);
            }
        };


        if (props) {
            fetchUserDetails();
        }
    }, [props]);

    const handleChange = (event) => {
        event.preventDefault();
        const nc = event.target.checked;
        // setChecked(nc);
        // console.log("the new state is", nc);
        changeAccesses(nc)
    };

    async function changeAccesses(nc) {
        
        // console.log("enterd teh access changer initiator");
        setChecked((prevState) => !prevState);
        // const newSt =  userDetails.user.isChecked ? false :true;
        // console.log(isChecked);
        try {
            const response = await fetch("http://192.168.165.164:5010/admin/disableUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": props.atlp
                },
                body: JSON.stringify({
                    dUserName: props.chkdtl,
                    da: nc
                })
            });
            const userData = await response.json();
            if (userData.accesses) {
                setUserDetails(userData);
                // console.log("the user details are in admin profile display", userData);
                setChecked(userData.user.accountStatus);

            }
            else {
                alert("unauthorized user");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };


    // if (!userDetails) {
    //     return <div>Loading...</div>;
    // }

    return (<>
        {rec ? <div className='profileSectionAd' id='profileDetailsAd'>
            <div className="profileSplitsAd">
                <img src="./images/image.png" alt="profile_picture" />
                <div id="userDetailsAd">
                    <ul>
                        <li><b>name : </b> {userDetails.user.name}</li>
                        <li><b>username : </b> {userDetails.user.userName}</li>
                        <li><b>email : </b> {userDetails.user.email}</li>
                        <li><b>phone number : </b> {userDetails.user.phoneNumber}</li>
                    </ul>
                </div>
            </div>
            <hr />
            <div className="profileSplitsAd" id='graphStat'>
                <div id="userStatusAd">
                    <p>Status :  {userDetails.user.accountStatus? 'ACTIVE' : 'DISASBLED'}</p>
                    <p>Good Texts :  {userDetails.user.goodTexts}</p>
                    <p>Bad Texts :  {userDetails.user.badTexts}</p>
                    <p>Average Score :  {userDetails.user.badTexts?((userDetails.user.goodTexts/((userDetails.user.goodTexts+userDetails.user.badTexts)))*100).toFixed(2):<>100%</>}</p>
                </div>
                <div id='graphAd'>
                    <Doughnut data={{
                        labels: ['Good', 'Bad'],
                        datasets: [
                            {
                                label: 'No.',
                                data: [userDetails.user.goodTexts, userDetails.user.badTexts],
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
            <div id="control">
                <p>DISABLED</p>
                <label class="switch">
                    <input
                        type="checkbox"
                        // defaultChecked = {true}
                        checked={isChecked}
                        onChange={handleChange}
                    />
                    <span className="slider round" ></span>
                </label>
                <p>ACTIVE</p>
            </div>
        </div> : <div>Loading...</div>}
    </>
    )
}

export default ProfileDisplayAdmin