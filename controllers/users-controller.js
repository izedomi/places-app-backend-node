const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const {validationResult} = require('express-validator');

let error;

let DUMMY_USERS = [

    {
        'id': 'u1',
        'name': "izedomi emmanuel",
        'email': "izedomi@gmail.com",
        'password': "izedomi"
    },
    {
        'id': 'u2',
        'name': "Salmi Kalux",
        'email': "kalux@gmail.com",
        'password': "salmi"
    },
    {
        'id': 'u3',
        'name': "Vicky Golden",
        'email': "vg@gmail.com",
        'password': 'vicky'
    }
];


exports.GetAllUsers = (req, res) => {

    return res.status(200).json(DUMMY_USERS);
}


exports.UserSignup = (req, res) => {
    
    error = validationResult(req);
    if(!error.isEmpty())
        return res.status(422).json(error.array());


    let {name, email, password} = req.body;

    let hasUser = DUMMY_USERS.find((user) => {
        return email === user.email;
    });

    if(hasUser)
        return res.status(422).json({message: "Unable to create user. Email already exists."});

    let newUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(newUser);

    return res.json(newUser);

};

exports.UserLogin = (req, res) => {

    error = validationResult(req);
    if(!error.isEmpty())
        return res.status(422).json(error.array());

    let {email, password} = req.body;

    let user = DUMMY_USERS.find((user) => {
        return email === user.email;
    });

    if(!user)
        return res.status(404).json({message: "This user was not found. Verify email and try again."});

    if(user.password !== password)
        return res.status(404).json({message: "Invalid password"});

    
    return res.status(200).json({status: 200, message: "Logged in successfully"});

}
