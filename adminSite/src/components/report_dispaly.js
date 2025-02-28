import React from 'react'
import { useState,useEffect } from "react"

function RequestsView(props) {
    const [fecRequests, setfecRequests] = useState(null)
    const [recresp, setrecresp] = useState(false)
    const [fresh, setfresh] = useState(1)
    useEffect(() => {
        const fetchUserDetails = async () => {
            // console.log("started fetching the user details");
            // console.log("the recevd prop is", props)
            try {
                const response = await fetch("http://192.168.165.164:5010/admin/reportes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": props.atlp
                    },
                });
                const userData = await response.json();
                if (userData.authorization) {
                    setfecRequests(userData);
                    setrecresp(true);
                    // console.log("the fetched requests", userData);
                }
                else {
                    alert("unauthorized user")
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        if (props) {
            fetchUserDetails();
        }
        // console.log("the request details are",fecRequests )
        // return () => {
        //     setfecRequests(null)
        //     }
    }, [props, fresh])

    function refresh() {
        setfresh(fresh + 1);
    }

    const handleClick = (event) => {
        const checkId = event.target.getAttribute('name');
        // console.log('Post ID:', checkId);
        // You can use the postId value here or pass it to another function
        props.chd(checkId)
    };


    return (
        <div id='requestsArea'>
            {/* {console.log("the fetched requests", fecRequests)} */}
            <div id='refBtn'>
                <p>REPORTS</p>
                <button onClick={refresh}>
                    <span class="material-symbols-outlined" >
                        refresh
                    </span>
                </button>
            </div>
            <div id="requestsHolder">
            {recresp ? fecRequests.repUsers.map(pst => (
                <div className='displayTemplate'>
                    <div className="userinfo">
                        <img src="./images/image.png" alt="profileImage" />
                        <div className="requestersDetails">
                            <h1>{pst.name}</h1>
                            <p>{pst.userName}</p>
                        </div>
                    </div>
                    <button name={pst.userName} onClick={handleClick}>Check</button>
                </div>
            )) : <div>unable to fetch teh requests</div>
            }
            </div>
        </div>
    )
}

export default RequestsView