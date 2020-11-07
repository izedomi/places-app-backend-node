const express = require('express');
const {check} = require('express-validator');


const router = express.Router();

const placesController = require('../controllers/places-controller');
const l = require('../validation/places-validation');


router.get('/', placesController.getAllPlaces);
router.get('/:pid', placesController.getPlaceById);
router.get('/user/:uid', placesController.getPlacesByUserId );
router.post('/', 
[
    check('title').not().isEmpty(), 
    check('description').isLength({min:5}), 
    check('address').not().isEmpty()
],
placesController.createNewPlace);

router.put('/:pid', 
[
    check('title').not().isEmpty(), 
    check('description').isLength({min:5}), 
],

placesController.updateAPlace);

router.delete('/:pid', placesController.deleteAPlace);


module.exports.PlacesRoutes = router;