const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/get_usr_details.js');
const router = express.Router();

// Import required modules
const fetchUser = require('../middleware/get_usr_details.js');
const User = require('../models/user_accounts.js');
const PublicPosts = require('../models/public_posts.js');
const AdminAccounts = require('../models/admin_accounts.js');
const People = require('../models/people.js');
const Reports = require('../models/reports.js');
const Requests = require('../models/requests.js');
const Friends = require('../models/friends.js');
const Chats = require('../models/chats.js')
const Admin = require('../models/admin_accounts.js')

// const { body, validationResult } = require('express-validator');
const JWT_SECRETE = "THIS@SECURE$KEY"



// Function to create a JWT token
function createJWTToken(user) {
    // Generate a token
    const token = jwt.sign({
        id: user.id,
        // name: user.name,
    }, JWT_SECRETE,
        {
            expiresIn: "1h",
        }
    );

    // Return the token
    return token;
}

// Function to check the login credentials
async function checkLoginCredentials(ADID, ADPassword, loc) {
    // Find the user in the database
    // Check the login credentials
    const user = await loc.findOne({ ADID });
    // If the user exists and the password is correct
    if (user && bcrypt.compareSync(ADPassword, user.ADPassword)) {
        token = createJWTToken(user);
        // console.log(user);
        return token;
    } else {
        return false;
    }
}

//api for the admin to register
router.post('/register', async (req, res) => {
    let adminReg = false;
    let tokenPass = true;
    const { ADID, ADname, ADProfilePic, ADPassword } = req.body;
    const adminExistence = await Admin.findOne({ ADID });
    if (adminExistence) {
        res.send({ adminReg, tokenPass, token: null, adminIDExistence: true });
    } else {
        const hashedPassword = await bcrypt.hash(ADPassword, 10);
        // const accountStatus = true;
        const user = new Admin({
            ADID, ADname, ADProfilePic, ADPassword: hashedPassword
        });
        await user.save().then(
            savedUser => {
                adminReg = true;
                console.log('User saved:');
            })
            .catch(error => {
                console.error('Error saving user:', error);
            });
        // console.log(adminReg)
        if (adminReg) {
            const token = createJWTToken(user);
            if (token) {
                res.send({ adminReg, tokenPass, token, adminIDExistence: false });
            }
            else {
                tokenPass = false;
                res.send({ adminReg, tokenPass, token, adminIDExistence: false });
            }
        }
        else {
            res.send({ adminReg });
        }
    }
})

//This peace of code is for the login of the existing user
router.post('/login', async (req, res) => {
    let adminLogin = false;
    if (!req.body.ADID || !req.body.ADPassword) {
        res.send("Please enter a username and password.");
        console.log("user has not entered the username or password");
        return;
    }
    else {
        const { ADID, ADPassword } = req.body;
        // calling the checker faction
        const token = await checkLoginCredentials(ADID, ADPassword, Admin);
        // console.log(token);
        //response section
        if (token) {
            adminLogin = true
            res.send({ adminLogin, token });
        }
        else {
            res.send(adminLogin);
        }
    }
}
);

//API to fetch the user details  using jwt token 
router.post('/adminProfile', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await Admin.findById(userID).select("-ADPassword -_id");
        // console.log('profile :>> ', user);
        res.send(user);
    } catch (error) {
        console.log(error);
        res.send("internal server error");
    }
});

//api for the admin to disable the user
router.post('/disableUser', fetchUser, async (req, res) => {
    try {
        const Nsta = req.body.da;
        const disablerUserName = req.body.dUserName;
        const userID = req.user.id;
        const adAuthenticate = await Admin.findById(userID);
        if (adAuthenticate) {
            const userToDisable = await User.findOne({ userName: disablerUserName })
            const disablerUserId = userToDisable.id;
            if (userToDisable) {
                //disable the user
                // console.log("the changin staus is", Nsta)
                User.findByIdAndUpdate(
                    disablerUserId,
                    { accountStatus: Nsta },
                    { new: true }
                )
                    .then((user) => {
                        console.log(`User account status updated to ${Nsta}`);
                        // console.log(user);
                        // res.send({accountStatus:user.accountStatus});
                        res.send({ user, accesses: true });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        }
        else {
            res.send({ accesses: false })
        }
    } catch (error) {
        console.log(error);
        res.send("internal server error");
    }
});

//api to fetch the user profile by the admin
router.post('/usrProfile', async (req, res) => {
    try {
        const userID = req.body.id;
        // console.log("user name is", userID);
        const user = await User.findOne({userName : userID}).select("-password")
        // console.log('profile :>> ', user);
        res.send({ user, success: true });
    } catch (error) {
        console.log(error);
        res.send({ success: false })
    }
});

router.post('/allUsers', fetchUser ,async (req, res) => {
    try {
        // console.log("the requested user is", req.user.id);
        const userID = req.user.id;
    const adAuthenticate = await Admin.findById(userID);
    // console.log("the authenticated user is" , adAuthenticate);
    if (adAuthenticate) {
        // console.log("the recived body is", req.body);
        searchString = req.body.searchString;
        // Query the userAccounts collection to retrieve usernames and names
        const users = await User.find({ userName: { $regex: searchString, $options: 'i' } }, 'userName name _id');
        // Send the retrieved user information as the response
        res.json({users, authorization : true});
    }
    else{
        res.json({authorization : false});
    }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.json({ error: 'Internal server error' });
    }
});

router.post('/reportes', fetchUser ,async (req, res) => {
    try {
        // console.log("the requested user is", req.user.id);
        const userID = req.user.id;
    const adAuthenticate = await Admin.findById(userID);
    // console.log("the authenticated user is" , adAuthenticate);
    if (adAuthenticate) {
        // console.log("the recived body is", req.body);
        searchString = req.body.searchString;
        // Query the userAccounts collection to retrieve usernames and names
        const users = await User.find({}, 'userName name goodTexts badTexts');
        const repUsers = users.filter(obj => ((obj.goodTexts / ((obj.goodTexts + obj.badTexts))) * 100).toFixed(2) <= 30)
        // Send the retrieved user information as the response
        res.json({repUsers, authorization : true});
    }
    else{
        res.json({authorization : false});
    }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.json({ error: 'Internal server error' });
    }
});







module.exports = router;

