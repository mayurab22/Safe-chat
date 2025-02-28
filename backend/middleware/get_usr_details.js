// Import the JWT library
const jwt = require("jsonwebtoken");
const JWT_SECRETE = "THIS@SECURE$KEY"
// Function to authenticate a user
function fetchUser(req, res, next) {
    // console.log(req.headers);
    // Get the JWT token from the request
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send("Unauthorized");
    }
    // Verify the JWT token
    try {
        const decoded = jwt.verify(token,JWT_SECRETE);

        // If the token is valid, set the user property on the request
        // console.log("the extracted content in the auth token is",decoded);
        req.user = decoded;
        // Continue to the next middleware function
        next();
    } catch (err) {
        console.log("error in the fetch request",err);
        // If the token is invalid, return a 401 error
        res.status(401).send("Unauthorized");
    }
    // console.log("stsge1");
}

module.exports = fetchUser;
