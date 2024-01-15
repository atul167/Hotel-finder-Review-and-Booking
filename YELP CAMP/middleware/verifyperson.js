const zod = require('zod');
const bodyParser = require('body-parser');  // Add this line to include bodyParser
const username = zod.string();
const password = zod.string().min(8);
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');


// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));

// const schema = zod.object({
//     username: username,
//     password: password
// });

// module.exports = { middlewares }    