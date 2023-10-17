const express = require('express');
const data = [];
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path'); //Inbuilt package
app.use(express.static(path.join(__dirname, 'assets')));
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
var admin = require("firebase-admin");

var serviceAccount = require("./le.json");
admin.initializeApp({
    credential: cert(serviceAccount)
});
// Initialize Firestore (you've already done this)




// Create a new Firestore collection for carts
//const cartCollection = collection(db, 'carts');






const db = getFirestore();

app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/welcome', function (req, res) {
    res.sendFile(__dirname + "/public/" + "welcome.html");
});
// Add an item to the cart



app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/public/" + "signup.html");
});

app.get('/welcome', function (req, res) {
    res.sendFile(__dirname + "/public/" + "welcome.html");
});
app.get('/loginSubmit', function (req, res) {
    res.sendFile(__dirname + "/public/" + "loginSubmit.html");
});
app.get('/mocktest', function (req, res) {
    res.sendFile(__dirname + "/public/" + "mocktest.html");
});


// v.js
// Assuming you have already initialized Firestore and Express

// Handle form submission


// Sample data to store in Firestore
app.post('/storeStudentAnswers', function (req, res) {
    const studentAnswers = req.body;

    // Assuming you have a way to identify the currently logged-in student
    const studentIdentifier = "student123"; // Replace with actual student identifier

    // Store the student's answers in Firestore
    const studentAnswersCollection = db.collection("answers");

    studentAnswers.forEach((answerObj) => {
        answerObj.userIdentifier = studentIdentifier; // Associate answers with the student
        studentAnswersCollection.add(answerObj)
            .then((docRef) => {
                console.log("Student answer added with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding student answer: ", error);
            });
    });

    // Send a success response
    res.json({ message: "Student answers submitted successfully" });
});

app.post("/signupSubmit", async function (req, res) {
    const user = {
        Fullname: req.body.Fullname,
        Email: req.body.Email,
        phoneno: req.body.Phoneno,
        Password: req.body.Password,
    }
    try {
        // Check if user already exists
        const userRef = db.collection('user');

        const userDoc = await userRef.where('Email', '==', user.Email).get();
        if (!userDoc.empty) {
            const alertmessage = encodeURIComponent('User already exists. please Login');
            return res.redirect(`/signup?alertmessage=${alertmessage}`);
        }

        // Create user in Firestore
        await userRef.add(user);
        const alertmessage = encodeURIComponent('User created Successfully');
        return res.redirect(`/login?alertmessage=${alertmessage}`);
    } catch (error) {
        console.error('Error creating user:', error);
        const alertmessage = encodeURIComponent('An error occured');
        return res.redirect(`/signup?alertmessage=${alertmessage}`);
    }
});

app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/public/" + "login.html");
});



app.post('/loginSubmit', async function (req, res) {
    try {
        const userRef = db.collection('user');
        const querySnapshot = await userRef.where('Email', '==', req.body.Email).get();

        if (querySnapshot.empty) {
            const alertmessage = 'User not found. Please register.';
            return res.redirect(`/login?alertmessage=${encodeURIComponent(alertmessage)}`);
        }

        const userDoc = querySnapshot.docs[0]; // Get the first document from the query
        const storedEmail = userDoc.data().Email; // Assuming your Firestore field name is 'email'
        const enteredEmail = req.body.Email;

        if (storedEmail === enteredEmail) {
            // Now you can proceed with password validation logic
            const userPassword = userDoc.data().Password;
            const enteredPassword = req.body.Password;

            if (userPassword === enteredPassword) {
                const alertmessage = 'Login successful';
                return res.sendFile(__dirname + "/public/" + "mocktest.html");
            } else {
                const alertmessage = 'Incorrect password.';
                return res.redirect(`/login?alertmessage=${encodeURIComponent(alertmessage)}`);
            }
        } else {
            const alertmessage = 'Please check your email ID.';
            return res.redirect(`/login?alertmessage=${encodeURIComponent(alertmessage)}`);
        }
    } catch (error) {
        console.error('Error checking user:', error);
        const alertmessage = 'An error occurred';
        return res.redirect(`/login?alertmessage=${encodeURIComponent(alertmessage)}`);
    }
});


// parse request to body parser
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: true }))









// Routes
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.post('/signupSubmit', async (req, res) => {
    const user = {
        Fullname: req.body.Fullname,
        Email: req.body.Email,
        phoneno: req.body.Phoneno,
        Password: req.body.Password,
    };

    try {
        // Check if user already exists
        const userRef = db.collection('users');
        const userDoc = await userRef.where('Email', '==', user.Email).get();

        if (!userDoc.empty) {
            const alertmessage = encodeURIComponent('User already exists. Please log in.');
            return res.redirect(`/login?alertmessage=${alertmessage}`);
        }

        // Create user in Firestore
        await userRef.add(user);
        const alertmessage = encodeURIComponent('User created successfully. Please log in.');
        return res.redirect(`/login?alertmessage=${alertmessage}`);
    } catch (error) {
        console.error('Error creating user:', error);
        const alertmessage = encodeURIComponent('An error occurred.');
        return res.redirect(`/signup?alertmessage=${alertmessage}`);
    }
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/loginSubmit', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    try {
        // Check if the user exists
        const userRef = db.collection('users');
        const userDoc = await userRef.where('Email', '==', email).get();

        if (userDoc.empty) {
            const alertmessage = encodeURIComponent('User not found. Please sign up.');
            return res.redirect(`/signup?alertmessage=${alertmessage}`);
        }

        // Check if the password matches (In a real application, use proper authentication)
        // For simplicity, we are assuming the password matches here
        const alertmessage = encodeURIComponent('Login successful.');
        return res.redirect(`/dashboard?alertmessage=${alertmessage}`);
    } catch (error) {
        console.error('Error logging in:', error);
        const alertmessage = encodeURIComponent('An error occurred.');
        return res.redirect(`/login?alertmessage=${alertmessage}`);
    }
});
// Add this route to your server code



dotenv.config({ path: 'config.env' })
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The server is running on: http://localhost:${port}`);
});
