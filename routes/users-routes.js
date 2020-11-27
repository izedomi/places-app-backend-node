const express = require('express');
const router = express.Router();
const {check, body} = require('express-validator');
const ImageUpload = require('../middlewares/file-upload.js')




const usersController = require('../controllers/users-controller');


router.get('/', usersController.GetAllUsers);

//signup
router.post('/signup', ImageUpload.single('image'), [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty().isLength({min:5})
], usersController.UserSignup);

//login
router.post('/login', [
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty().isLength({min:3})
], usersController.UserLogin);


module.exports.UsersRoutes = router;
