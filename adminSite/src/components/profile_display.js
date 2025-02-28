import React from 'react'
import { useState, useEffect } from "react";

function ProfileDisplay(props) {

    const [adminDetails, setUserDetails] = useState(null);
    // const [rectkn, setRectkn] = useState(null);
    // setRectkn(props.atlp) 
    // setfirst(true);
    // console.log("the receved prop is", props)
    // console.log("the receved prop is extracted", rectkn)
    // console.log("the receved token is in hook", rectkn)


    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch("http://192.168.165.164:5010/admin/adminProfile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": props.atlp,
                    },
                });
                const userData = await response.json();
                // console.log("the obtained user data", userData)
                setUserDetails(userData);
                localStorage.setItem('name', userData.ADname);
            } catch (error) {
                // console.error("Error fetching user details:", error);
            }
        };

        if (props) {
            fetchUserDetails();
        }
    }, [props]);

    if (!adminDetails) {
        return <div>Loading admin details...</div>;
    }

    return (
        <div className='profileSection' id='profileDetails'>
            <div id="profileData">
                <div className="profileSplits">
                    <img src="./images/image.png" alt="profile_picture" />
                    <div id="adminDetails">
                        <ul>
                            <li><b>name :</b> {adminDetails.ADname}</li>
                            <li><b>AD Id :</b> {adminDetails.ADID}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileDisplay