import React, { useEffect, useState } from 'react'

function RequestsView(props) {
    const [fecRequests, setfecRequests] = useState(null)
    const [recresp, setrecresp] = useState(false)
    const [fresh, setfresh] = useState(1)
    useEffect(() => {
        const fetchUserDetails = async () => {
            // console.log("started fetching the user details");
            // console.log("the recevd prop is", props)
            try {
                const response = await fetch("http://192.168.165.164:5010/user/fetchRequests", {
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
    // if (fecRequests) {
    //     return(
    //         <div>fetching the requests</div>
    //     )
    // }

    async function friendAccepter(event) {
        // console.log("enterd the requesting funciton")
        const checkId = event.target.getAttribute('name');
        // console.log('Post ID:', checkId);
        // You can use the postId value here or pass it to another function
        try {
            // console.log("started adding friend")
            const response = await fetch("http://192.168.165.164:5010/user/addFriend", {
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
            // if (userData.friendExistence) {
            //     alert("the user is already your friend");
            // }
            if (userData.authorization) {
                // console.log("the response of friend accepcetor", userData);
                alert("friend added")
                refresh();
            }
            else {
                // console.log("the response of friend accepcetor", userData);
                alert("unauthorized user")
            }
            // });
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }
    // console.log("teh fetch requests", fecRequests)
    // if (fecRequests) {
    //     return(
    //         <div>fetching the requests</div>
    //     )
    // }


    return (
        <div id='requestsArea'>
            {/* {console.log("the fetched requests", fecRequests)} */}
            <div id='refBtn'>
                <p>REQUESTS</p>
                <button onClick={refresh}>
                    <span class="material-symbols-outlined" >
                        refresh
                    </span>
                </button>
            </div>
            <div id="requestsHolder">
            {recresp ? fecRequests.requestDetails.map(pst => (
                <div className='displayTemplate'>
                    <div className="userinfo">
                        <img src="./images/image.png" alt="profileImage" />
                        <div className="requestersDetails">
                            <h1>{pst.name}</h1>
                            <p>{pst.RUserName}</p>
                        </div>
                    </div>
                    <button name={pst.RUserName} onClick={friendAccepter}>accept</button>
                </div>
            )) : <div>unable to fetch teh requests</div>
            }
            </div>
        </div>
    )
}
export default RequestsView