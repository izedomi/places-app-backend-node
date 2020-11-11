const express = require('express');
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
    if(!error.isEmpty())
        return res.status(422).json(error.array());

    let {name, email, password} = req.body;


    try{

        let userExists = await User.findOne({email: email});
        if(userExists) 
            return res.status(422).json({message: "User already exists. Please login"});
        
        const newUser = new User({
            name,
            email,
            password,
            image: "https://images.pexels.com/photos/744480/pexels-photo-744480.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            places: []
        });

        const result = await newUser.save();
        
        res.status(200).json({message: result});

    }
    catch(e){
        console.log(e);
        return res.status(500).json({message: "Encountered an error"});
    }

    
   

}

exports.UserLogin = async(req, res) => {

    error = validationResult(req);
    if(!error.isEmpty())
        return res.status(422).json(error.array());

    let {email, password} = req.body;

    try{

        let userExists = await User.findOne({email: email});

        if(!userExists || userExists.password != password) 
            return res.status(422).json({message: "Invalid credentials entered"});

        res.status(200).json({message: "User logged in successfully"});

    }
    catch(e){

        console.log(e);
        res.status(500).json({message: "Sorry. Server error was encountered"});
    }

}
