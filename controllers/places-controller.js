const { v4: uuidv4 } = require('uuid');
const {validationResult} = require('express-validator');

const {getAddressCordinates} = require('../utils/location');
const {Place} = require('../schema/place-schema');

let error;

exports.getAllPlaces = async (req, res) => {
    
    try{
        let places = await Place.find();
        res.status(200).json(places);
    }
    catch(e){
        return res.status(500).json({message: "Couldn't fetch products"});
    }

}


exports.getPlaceById = async (req, res) => {

    //get id from request
    let placeId = req.params.pid;

    //validate id
    if(placeId == null || placeId.toString().length == 0)
        return res.status(400).json({message: "Bad Request. Please provide a Place ID"})

    //find place with given Id
    let place = await Place.findById(placeId);

    //no place found
    if(!place) 
        return res.status(404).json({message: "No place with the given ID was found"})

    //return place for given ID
    return res.json(place)

}

exports.getPlacesByUserId = async (req, res) => {

    // get user id
    let userId = req.params.uid;

    // validate given user id
    if(userId == null || userId.toString().length == 0)
        return res.status(400).json({message: "Bad Request. Please provide a user ID"})
    
    // get places with given user id
    let places = await Place.findOne({creator: userId});

    // no place was found
    if(!places || places.length === 0) 
        return res.status(404).json({message: "No place was found with the given user"})


    return res.json(places)

}

exports.createNewPlace = async (req, res) => {


    if(!process.env.API_KEY){
        console.log("No API KEY was provided. Set KEY as an environment variable");
        return res.status(400).json({
            message: "No API KEY was provided. Set API_KEY as an environment variable"
        }) 
    }

    const API_KEY = process.env.API_KEY;

    //validate input
    error = validationResult(req);
    if(!error.isEmpty())
        return res.status(422).json(error.array());

    //get request body
    let {title, description, creator, address} = req.body;
    
    //get coordinates from user address
    let location = await getAddressCordinates(address, API_KEY);
    console.log(location);

    //couldn't determine coordinates
    if(!location.status)
        return res.status(422).json({message: location.data});

    let cordinates = location.data;

    //create place and save new place 
    const newPlace = new Place({
        title,
        description,
        address,
        location: cordinates,
        image: 'xxxxxxxxxxx.jpg',
        creator
    })

    try{
        await newPlace.save();
    }
    catch(e){
        return res.status(500).json({message: "Creating new place failed"});
    }
    
    return res.json(newPlace);
}

exports.updateAPlace = async (req, res) => {

    //validate inputs
    error = validationResult(req);
    if(!error.isEmpty())
        return res.status(422).json(error.array());
    
    //get id
    let placeId = req.params.pid;
    if(!placeId) return res.status(400).json({message: 'Bad request. Please try again'});

  
    try{
        //find place with id
        let place = await Place.findById(placeId)
        if(!place) return res.status(422).json({message: 'No place was found for the given id'})

        let {title, description} = req.body;

        //update 
        place.title = title
        place.description = description

        //save
        let p = await place.save();
        
        return res.status(200).json(p);
    }
    catch(e){
        return res.status(500).json({message: "Update place failed"});
    }
}

exports.deleteAPlace = async (req, res) => {
    
    //get place id
    let placeId = req.params.pid;
    
    //place id is not null
    if(!placeId) return res.status(400).json({message: 'Bad request. Please try again'});

    try{

        let place = await Place.findByIdAndDelete(placeId);

        if(!place) res.status(404).json({message: "No place with given ID was found"});
        
        return res.status(200).json(place);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message: "Item couldn't be deleted"});
    }
   
}



