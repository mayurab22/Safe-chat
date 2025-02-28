import React,{useState} from 'react'
import '../pagestyle.css'
import ChatArea from '../components/chat_area';
import RequestsView from '../components/requests_view';
import ProfileDisplay from '../components/profile_display';
import FindPeople from '../components/find_people';
import FindFriends from '../components/find_friends';
import PostView from '../components/post_view';
// import ChatComponent from '../components/chat_test';



function LandingPage(props) {
    // console.log(props.ats)
    const movetkn = props.ats;
    // const [postViewKey, setPostViewKey] = useState(0); // State for the key prop
    // eslint-disable-next-line no-unused-vars
    const [name, setname] = useState('')
    const [chatter, setchatter] = useState(null)
    // console.log(props.ats)
    // function reloadPostView() {
    //     setPostViewKey(prevKey => prevKey + 1); // Increment the key to reload PostView
    // }
    return (
        <div id='outerBox'>
            <div id="leftContent">
            <ProfileDisplay atlp = {movetkn} stnm ={setname}/>
            {/* <hr /> */}
            <RequestsView atlp = {movetkn}/>
            {/* <hr /> */}
            <FindPeople atlp = {movetkn} />
            </div>
            <div id="centerContent">
            <PostView atlp = {movetkn} />
            </div>
            <div id="rightContent" >
            <FindFriends atlp = {movetkn} cht={setchatter} />
            {chatter ? <ChatArea  atlp = {movetkn} chprom={chatter} /> : <p>chat here</p>}
            {/* {console.log(name)} */}
            {/* <ChatComponent atlp = {movetkn} nm={name}/> */}
            </div>
        </div>
    )
}

export default LandingPage