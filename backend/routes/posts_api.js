const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/get_usr_details.js');
const router = express.Router();
const censorVulgarity = require("../middleware/core.js");
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');

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
const Posts = require('../models/public_posts.js')
const apiKey = 'be0afa28b06c7e3e239fa7c6847ba084';


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
async function checkLoginCredentials(email, password, loc) {
    // Find the user in the database
    // Check the login credentials
    const user = await loc.findOne({ email });
    // If the user exists and the password is correct
    if (user && bcrypt.compareSync(password, user.password)) {
        token = createJWTToken(user);
        // console.log(user);
        return token;
    } else {
        return false;
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Keep the original filename
    }
});

const upload = multer({ storage: storage });


//API to add a new post
router.post('/addPost', upload.single('file'), fetchUser, async (req, res) => {
    //code to get the all the the entries using mongoose
    const usrName1 = req.user.uname;
    const user1 = await User.findOne({ userName: usrName1 });
    console.log("the ", usrName1, "is willing to add a post");
    // const psAuthenticate = await User.findById(posterID);
    if (user1) {
        try {
            // console.log("the content sent from the user is", req.body.json_data)
            const receivedData = req.body.json_data;
            const jsObjectReceivedData = JSON.parse(receivedData);
            // console.log("the parced data is", jsObjectReceivedData);
            const fileData = req.file.originalname ;
            const post = new Posts({
                PSTName: jsObjectReceivedData.PSTName,
                PSTPic: fileData,
                PSTUname: usrName1,
                description: jsObjectReceivedData.description,
            })
            const savedPost = await post.save();
            res.json({ Posted: true, authentication: true });
            console.log("the post has been added successfully");
        } catch (error) {
            res.json({ Posted: false, authentication: true });
            console.log(error);
        }
    } else {
        res.json({ Posted: true, authentication: false });
    }
});

//API to add a new comment to the post
router.post('/updateComments', fetchUser, async (req, res) => {
    //code to add a new comment to the post 
    const { postID, commentSent } = req.body;
    const commentext = commentSent.comment;
    const comid = req.user.id;
    let newText;
    await censorVulgarity(commentext)
        .then(censoredText => {
            // console.log('Censored message:', censoredText);
            newText = censoredText;
        });
    const safeText = newText;
    if (safeText.valgNumber === 0) {
        User.findOneAndUpdate(
            { _id: comid }, // Filter criteria to find the user by ID
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
            { _id: comid }, // Filter criteria to find the user by ID
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

    const post = await Posts.find({ PSTId: postID });
    const commentsArr = post[0] ? post[0].comments : [];
    // console.log(commentsArr);
    // console.log(commentSent);
    if (post) {
        const index = post.findIndex(p => p.PSTId === postID);
        // console.log("the safetext is", safeText);
        // console.log("the new text", newText)
        if (index !== -1) {
            post[index].comments.push({
                commenterUname: commentSent.commenterUname,
                comment: safeText.extractedText
            });
            const updatedPost = await Posts.findOneAndUpdate(
                { PSTId: postID },
                post[index],
                { new: true }
            );
            res.send({ status: true });
        }
    }
    else {
        res.send({ status: false });
        throw new Error({ error: 'Post not found', status: false });
    }
    // res.send({updatedComment: true})
});


//API to retrieve the comments of the posts
const getPosts = async () => {
    try {
        const posts = await Posts.find();
        // console.log(posts);
        return { posts };
    }
    catch (err) {
        console.error(err);
    }
}
router.post('/getComments', async (req, res) => {
    //code to get the all the the entries using mongoose
    const postAndComments = await getPosts();
    // console.log("its returnung the posts proprely\n", postAndComments)
    res.send(postAndComments)
});


router.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        // Find the post in MongoDB by its ID
        const post = await PublicPosts.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        // Send the post data as a response
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving post');
    }
});

module.exports = router;




module.exports = router;

