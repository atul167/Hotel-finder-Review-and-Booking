const express = require('express');
const bodyParser = require('body-parser');  // Add this line to include bodyParser
const path = require('path');
const zod = require('zod');
const username = zod.string();
const password = zod.string().min(8);
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://atuldwivedi1628:abcde@firstdb.evt9vsn.mongodb.net/');
const User = mongoose.model('User', {
    username: String,
    password:String,
    token   : String
});

const secretKey = "baap";
const { middlewares } = require("./middleware/verifyperson.js");

const schema = zod.object({
    username: username,
    password: password
});

const app = express();
const PORT = 3000;

// Set 'ejs' as the view engine
app.set('view engine', 'ejs');

// Define the views directory
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index');
    console.log(`Server is running on PORT ${PORT}`);
});
app.get('/login', function (req, res) {
    res.render('loginform');
});
app.post('/login', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    // Validate the input using the schema
    const result = schema.safeParse({
        "username": username,
        "password": password
    });
    const finalres = result.success;

    if (!finalres) {
        res.redirect('/login');
        return;
    }

    try {
        // Check if the user exists in the database
        const existingUser = await User.findOne({ username: username });

        if (!existingUser) {
            // User not found
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }
        console.log(password);
        console.log(existingUser.password);
        const isPasswordValid = (password == existingUser.password);
        if (!isPasswordValid) {
            // Incorrect password
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }
        console.log('User logged in successfully!');
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Could not login ' });
    }
});

app.get('/signup', function (req, res) {
    res.render('signupform');
    // res.send('User Signed Up');
 });
app.post('/signup',async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Respond with success or do further processing
    // Validate the input using the schema
    const result = schema.safeParse({
        "username": username,
        "password": password
    });
    const finalres = result.success;
    if (!finalres) {
        res.redirect('/signup');
    }
    // You can send the token to the client or store it in a secure manner
    try {
        const token = jwt.sign({ username: username }, secretKey);
        console.log('User signed up successfully!');
        console.log(token);
        // Save the user to the database using Mongoose
        const newUser = new User({
            username: username,
            password:password,
            token:  token
        });

        await newUser.save();
        // Generate and send the JWT token
        
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/about', function (req, res) {
    res.render("about");
})
app.get('/pricing', function (req, res) {
    res.render("pricing");
})
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
