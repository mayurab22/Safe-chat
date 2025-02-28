import React, { useState ,useEffect} from 'react'
import '../pagestyle.css'
import RequestsView from '../components/report_dispaly';
import ProfileDisplay from '../components/profile_display';
import FindPeople from '../components/find_people';
import ProfileDisplayAdmin from '../components/profile_display_AD';

function LandingPage(props) {
    // console.log(props.ats)
    const movetkn = props.ats;
    const [checkDetails, setcheckDetails] = useState('')
    // console.log(props.ats)
    
    useEffect(() => {
        // console.log("the id has changed from previous new id in langding page", checkDetails )
    }, [checkDetails])
    

    return (
        <div id='outerBox'>
            <div id="leftContent">
            <ProfileDisplay atlp = {movetkn}/>
            <hr />
            <RequestsView atlp = {movetkn} chd = {setcheckDetails}/>
            <hr />
            <FindPeople atlp = {movetkn} chd = {setcheckDetails}/>
            </div>
            <div id="rightContent">
                {checkDetails ? <ProfileDisplayAdmin atlp = {movetkn} chkdtl = {checkDetails}/> :<></>}
            </div>
        </div>
    )
}

export default LandingPage