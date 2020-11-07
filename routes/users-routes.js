const express = require('express');
const router = express.Router();
const {check, body} = require('express-validator');



const usersController = require('../controllers/users-controller');


router.get('/', usersController.GetAllUsers);

//signup
router.post('/signup', [
    check('name').not().isEmpty(), 
    check('email').normalizeEmail().isEmail(), 
    check('password').not().isEmpty().isLength({min:5})
], usersController.UserSignup);

//login
router.post('/login', [
    check('email').normalizeEmail().isEmail(), 
    check('password').not().isEmpty().isLength({min:5})
], usersController.UserLogin);


module.exports.UsersRoutes = router;