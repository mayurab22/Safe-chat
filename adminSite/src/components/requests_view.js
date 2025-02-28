import React from 'react'




function RequestsView() {
    return (
        <div id='requestsArea'>
            <p>REPORTS</p>
            <div className='displayTemplate'>
                <div className="userinfo">
                <img src="./images/image.png" alt="profileImage" />
                <div className="requestersDetails">
                <h3><b>Ajay</b></h3>
                <p>4MC16CS002</p>
                </div>
                </div>
                <button>Check</button>
            </div>
            <div className='displayTemplate'>
                <div className="userinfo">
                <img src="./images/image.png" alt="profileImage" />
                <div className="requestersDetails">
                <h3><b>Madhusudhan</b></h3>
                <p>4MC20CS077</p>
                </div>
                </div>
                <button>Check</button>
            </div>
            <div className='displayTemplate'>
            <div className="userinfo">
                <img src="./images/image.png" alt="profileImage" />
                <div className="requestersDetails">
                <h3><b>Mayur</b></h3>
                <p>4MC20CS084</p>
                </div>
                </div>
                <button>Check</button>
            </div>
        </div>
    )
}
export default RequestsView