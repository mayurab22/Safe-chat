const { addUser, removeUser, getUsersList, isUserConnected, sendMessageToClient, broadcastMessage } = require('../middleware/websocket_and_userMap.js');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files
const fs = require('fs');
const mongoose = require('mongoose');
const { addNameIP, getIP } = require('../middleware/websocket_and_userMap.js');
const censorVulgarity = require("../middleware/core.js");


// importing mongoose models and middle ware
const fetchUser = require('../middleware/get_usr_details.js');
const User = require('../models/user_accounts.js');
const PublicPosts = require('../models/public_posts.js');
const AdminAccounts = require('../models/admin_accounts.js');
const People = require('../models/people.js');
const Reports = require('../models/reports.js');
const Requests = require('../models/requests.js');
const Friends = require('../models/friends.js');
const Chats = require('../models/chats.js');

//global declaration
const JWT_SECRETE = "THIS@SECURE$KEY"

// Function to create a JWT token
function createJWTToken(user) {
    const token = jwt.sign({
        id: user.id,
        uname: user.userName,
    }, JWT_SECRETE,
        {
            expiresIn: "1h",
        }
    );
    return token;
}

//Function to verify teh login credentials
async function checkLoginCredentials(email, password, loc) {
    const user = await loc.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
        token = createJWTToken(user);
        // console.log(token);
        const status = user.accountStatus;
        return { token, status };
    } else {
        return false;
    }
}

//API to check th availability of the ID
router.post('/checkUsrIDAvailability', async (req, res) => {
    const chkID = req.body.chID;
    const userFoundWithID = await User.findOne({ userName: chkID });
    if (userFoundWithID) {
        res.send({ usrIDAvailable: false });
    } else {
        res.send({ usrIDAvailable: true });
    }
});


//registration of new users
router.post('/register', async (req, res) => {
    let userReg = false;
    let tokenPass = true;
    const { userName, name, email, phoneNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExistence = await User.findOne({ email });
    const userIdExistence = await User.findOne({ userName });
    if (userExistence) {
        res.send({ userReg, token: null, emailExistence: true, userIdExistence: false });
    }
    else if (userIdExistence) {
        res.send({ userReg, token: null, emailExistence: true, userIdExistence: true });
    } else {
        const user = new User({
            userName, name, email, phoneNumber, password: hashedPassword
        });
        const friends = new Friends({
            userName
        });
        const requests = new Requests({
            userName
        })
        const chat = new Chats({
            userName
        })
        await chat.save();
        await friends.save();
        await requests.save();
        await user.save().then(
            savedUser => {
                userReg = true;
                console.log(savedUser.userName, "has been successfully saved to database");
            })
            .catch(error => {
                console.log(savedUser.userName, "the user could not be saved to database the following error occurred", error)
            });
        if (userReg) {
            const token = createJWTToken(user);
            if (token) {
                res.send({ userReg, token, emailExistence: false, userIdExistence: false });
            }
            else {
                tokenPass = false;
                res.send({ userReg, token: null, emailExistence: false, userIdExistence: false });
                addNameIP(userName, req.ip);
            }
        }
        else {
            res.send({ userReg });
        }
    }
})

//API for user to search for people
router.post('/allUsers', fetchUser, async (req, res) => {
    try {
        const usrName1 = req.user.uname;
        const user1 = await User.findOne({ userName: usrName1 });
        if (user1) {
            const searchString = req.body.searchString;
            const users = await User.find({ userName: { $regex: searchString, $options: 'i' } }, 'userName name');
            const filteredUsers = users.filter(obj => obj.userName != usrName1);
            res.json({ users: filteredUsers, authorization: true });
        }
        else {
            res.json({ authorization: false });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.json({ error: 'Internal server error' });
    }
});

//API for the user to login
router.post('/login', async (req, res) => {
    let userLogin = false;
    let accountStatus = true;
    if (!req.body.email || !req.body.password) {
        return res.send(userLogin, "Invalid username or password.");
    }
    else {
        const { email, password } = req.body;
        // console.log(email, password)
        const tok = await checkLoginCredentials(email, password, User);
        const user1 = await User.findOne({ email });
        // console.log(tok);
        if (tok) {
            const token = tok.token;
            const status = tok.status;
            userLogin = true
            res.send({ userLogin, token, status });
            // console.log("the deteils at the time of regestration",user1, req.ip)
            addNameIP(user1.userName, req.ip);
        }
        else {
            res.send({ userLogin });
        }
    }
}
);

//API to fetch the user details  using jwt token 
router.post('/usrProfile', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await User.findById(userID).select("-password -id")
        // console.log('profile :>> ', user);
        res.send(user);
    } catch (error) {
        console.log("an error occurred while fetching the details");
    }
});


//*************the below code used for the further modification in future***************

//API to fetch all the friend requests
router.post('/fetchRequests', fetchUser, async (req, res) => {
    const usrName1 = req.user.uname;
    const user1 = await Requests.findOne({ userName: usrName1 });
    if (!user1) {
        return res.send(JSON.stringify({ authorization: false }));
    }
    res.send(JSON.stringify({ usrName: user1.userName, requestDetails: user1.FRequests, authorization: true }));
})

//API to add a friend requests to a  particular user
router.post('/addRequest', fetchUser, async (req, res) => {

    const usrName1 = req.body.addeeUname;
    const usrName2 = req.user.uname;
    console.log(usrName2 + ' is adding the request');
    // Check if the user ID exists
    const user1 = await User.findOne({ userName: usrName2 });
    const user2 = await Requests.findOne({ userName: usrName1 });
    const user2FriendsList = await Friends.findOne({ userName: usrName2 }, 'userFriends');
    const arraySearch = user2FriendsList.userFriends.filter(obj => obj.FUserName == usrName1);
    // console.log("the requestee name is", usrName1)
    const user1RequestsList = await Requests.findOne({ userName: usrName1 }, 'FRequests');
    // console.log("obtied data from requests database", user1RequestsList);
    const arraySearchR = user1RequestsList.FRequests.filter(obj => obj.RUserName == usrName2);
    // console.log(arraySearch, "and", arraySearchR);
    if (!user1) {
        return res.send(JSON.stringify({ authorization: false, friendExistence: false }));
    }
    // console.log("testing the thing1", arraySearch == []);
    // console.log("testing the thing1", arraySearchR == []);
    if (arraySearch.length == 0 && arraySearchR.length != 0) {
        // console.log("enterd an pre return");
        return res.send(JSON.stringify({ authorization: true, friendExistence: true }));
    }
    else if (arraySearch.length != 0 && arraySearchR.length == 0) {
        // console.log("enterd an pre return");
        return res.send(JSON.stringify({ authorization: true, friendExistence: true }));
    }
    else {

        user2.FRequests.push({ name: user1.name, RUserName: user1.userName, profilePicPAth: user1.profilePic });
        await user2.save();
        console.log("friend request added successfully");
        res.send(JSON.stringify({ authorization: true, friendExistence: false }));
    }
});

//API to add a friend to user's friend list
router.post('/addFriend', fetchUser, async (req, res) => {
    // console.log(userName + ' is requesting a friend to be added into his friends list');
    // Check if the user ID exists
    const usrName1 = req.user.uname;
    const usrName2 = req.body.addeeUname;
    const userFriend1 = await Friends.findOne({ userName: usrName1 });
    const userFriend2 = await Friends.findOne({ userName: usrName2 });
    const user1 = await User.findOne({ userName: usrName1 });
    const user2 = await User.findOne({ userName: usrName2 });
    // const user3 = await Requests.find({userName: usrName1})
    if (!user1) {
        return res.send(JSON.stringify({ authorization: false }));
    }
    // console.log("the deaills of the user is", user1);
    userFriend1.userFriends.push({ name: user2.name, FUserName: user2.userName, profilePicPAth: user2.propic });
    await userFriend1.save();
    userFriend2.userFriends.push({ name: user1.name, FUserName: user1.userName, profilePicPAth: user1.propic });
    await userFriend2.save();
    await Requests.findOneAndUpdate({ userName: usrName1 }, { $pull: { FRequests: { RUserName: usrName2 } } });
    const user3 = await Requests.find({ userName: usrName1 });
    // console.log("the update datase is", user3)
    res.send(JSON.stringify({ authorization: true }));
});

//API to fetch all the requests from the user's database
router.post('/fetchFriends', fetchUser, async (req, res) => {
    const usrName1 = req.user.uname;
    console.log(usrName1 + ' is looking for friends');
    const user1 = await Friends.findOne({ userName: usrName1 });
    // console.log("the user requesting to finf friend is", user1);
    if (user1) {
        searchString = req.body.searchString;
        // const users = await Friends.find({ userName: { $regex: searchString, $options: 'i' } }, 'userName name');
        const regex = new RegExp('^' + searchString, 'i');
        const filteredUsers = user1.userFriends.filter(obj => regex.test(obj.FUserName));
        // console.log("the filterd array of usersis", filteredUsers);
        res.json({ users: filteredUsers, authorization: true });
    }
    else {
        res.json({ authorization: false });
    }
})

//Api to handel the users new post



//API user requesting to connect himself to the chat.
//fixing the parameter TRUE : received | texts FALSE : sent texts
router.post('/addChat', fetchUser, async (req, res) => {
    const senderName = req.user.uname;
    const receiverName = req.body.userName;
    // console.log(senderName);
    // console.log(receiverName);
    const senderData = await Chats.findOne({ userName: senderName });
    const receiverData = await Chats.findOne({ userName: receiverName });
    // console.log("the receiver data is", receiverData);
    const senderVerifying = senderData.message.filter(obj => obj.friendName == receiverName);
    const receiverVerifying = receiverData.message.filter(obj => obj.friendName == senderName);
    // console.log("the sender is", senderName);
    //the code to detect teh  vulgarity starts here.
    let newText;
    await censorVulgarity(req.body.text)
        .then(censoredText => {
            // console.log('Censored message:', censoredText);
            newText = censoredText;
        });
    const safeTextUe = newText;
    const safeText = safeTextUe.extractedText;

    if (safeTextUe.valgNumber === 0) {
        User.findOneAndUpdate(
            { userName: senderName }, // Filter criteria to find the user by ID
            { $inc: { goodTexts: 1 } }, // Update operation to increment goodTexts by 1
            { new: true } // Option to return the updated document
        )
            .then(updatedUser => {
                if (updatedUser) {
                    console.log('GoodTexts incremented successfully:');
                } else {
                    console.log('User not found');
                }
            })
            .catch(error => {
                console.error('Error incrementing GoodTexts:', error);
            });
    }
    else {
        User.findOneAndUpdate(
            { userName : senderName }, // Filter criteria to find the user by ID
            { $inc: { badTexts: 1 } }, // Update operation to increment goodTexts by 1
            { new: true } // Option to return the updated document
        )
            .then(updatedUser => {
                if (updatedUser) {
                    console.log('GoodTexts incremented successfully:');
                } else {
                    console.log('User not found');
                }
            })
            .catch(error => {
                console.error('Error incrementing GoodTexts:', error);
            });
    }
    //code to detect the vulgarity ends here.
    
    try{
        if (senderVerifying.length > 0) {
            // receiverData.message.filter(obj => obj.friendName == senderName).then(usr => usr[0].chats.push({ direction: true, message: req.body.text }));
            // senderData.message.filter(obj => obj.friendName == receiverName).then(usr => usr[0].chats.push({ direction: false, message: req.body.text }));
            receiverData.message.filter(obj => obj.friendName == senderName)[0].chats.push({ direction: true, message: safeText });
            senderData.message.filter(obj => obj.friendName == receiverName)[0].chats.push({ direction: false, message: safeText });
            await receiverData.save();
            await senderData.save();
            res.send({succ : true, safeText});
        }
        else {
            receiverData.message.push({ friendName: senderName, chats: [{ direction: true, message: safeText }] });
            senderData.message.push({ friendName: receiverName, chats: [{ direction: false, message: safeText }] });
            // res.send({user1, user2});
            await receiverData.save();
            await senderData.save();
            res.send({succ : true,safeText});
            
        }
        const receiverIp = getIP(receiverName);
        // console.log("the reciverIP is", receiverIp);
        if(receiverIp){
            const checkStatus =  isUserConnected(receiverIp);
            if (checkStatus) {

                sendMessageToClient(receiverIp, safeText);
            }
        }
    }catch(error){
        console.log(error);
        res.send({succ : false});
    }

})


router.post('/fetchChats', fetchUser, async (req, res) => {
    const requesterName = req.user.uname;
    const requestee = req.body.reqeeName;
    const requesterDetails = await Chats.findOne({userName: requesterName});
    console.log(requesterDetails);
    const userDetails = await User.findOne({userName: requesterName});
    if(requesterDetails){
        // const chatArr = requesterDetails.message.filter()
        const chatArr = requesterDetails.message.filter(obj => obj.friendName == requestee);
        console.log(chatArr);
        res.send({name: userDetails.name,chatArr, authorization: true});
    }
    else{
        res.send({authorization: false})
    }
})

//*************the above code to be used for further modification*******************



module.exports = router;

