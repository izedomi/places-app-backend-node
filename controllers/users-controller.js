const fs = require('fs');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {validationResult} = require('express-validator');
const {User} = require('../schema/user-schema');


let error;


exports.GetAllUsers = async(req, res) => {


    try{
        const users = await User.find({}, "-password");
        res.status(200).json({users: users});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: "An error occured!"})
    }
}


exports.UserSignup = async (req, res) => {


    error = validationResult(req);

    if(!error.isEmpty()){

        if(req.file)
            fs.unlink(req.file.path, err => {
              console.log(err)
            });
        return res.status(422).json({message: error.errors[0].msg});
    }

    let {name, email, password} = req.body;


    try{

        let userExists = await User.findOne({email: email});
        if(userExists){
            if(req.file){
              fs.unlink(req.file.path, err => {
                console.log(err)
              });
            }
            return res.status(422).json({message: "User already exists. Please login"});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image: req.file.path,
            places: []
        });


        const result = await newUser.save();

        res.status(200).json({message: result});

    }
    catch(e){
        console.log(e);
        if(req.file)
            fs.unlink(req.file.path, err => {
              console.log(err)
            });
        return res.status(500).json({message: "Encountered an error. Operation couldn't be completed"});
    }
}

exports.UserLogin = async(req, res) => {

    if(!process.env.JWT_KEY){
        console.log("No JWT_KEY was provided. Set KEY as an environment variable");
        return res.status(400).json({message: "JWT PRIVATE KEY not found. set key as an env variable(JWT_KEY)"})
    }

    error = validationResult(req);

    if(!error.isEmpty())
        return res.status(422).json({message: error.errors[0].msg});

    let {email, password} = req.body;

    try{

        let userExists = await User.findOne({email: email});
        console.log(userExists);
        console.log(password)

        const isValidPassword = await bcrypt.compare(password, userExists.password);

        if(!userExists || !isValidPassword)
            return res.status(422).json({message: "Invalid credentials entered"});

        //return res.status(200).send(userExists);


        const token = jwt.sign({userId: userExists._id, userEmail: userExists.email},'jwt_places_app',{expiresIn: '1h'})

        res.status(200).json({user: userExists, token: token});

    }
    catch(e){

        console.log(e);
        res.status(500).json({message: "Sorry. Server error was encountered"});
    }

}
