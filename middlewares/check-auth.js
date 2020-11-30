const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {

    if(req.method === "OPTIONS")
        return next()

    if(!process.env.JWT_KEY){
        console.log("No JWT_KEY was provided. Set KEY as an environment variable");
        return res.status(400).json({message: "JWT PRIVATE KEY not found. set key as an env variable(JWT_KEY)"})
    }

    try{
        if(!req.headers.authorization)
            return res.status(401).json({message: "unauthorized action...Authorization token not found!"});

        const token = req.headers.authorization.split(" ")[1];
        if(!token)
            return res.status(401).json({message: "unauthorized action..."});

        const decodedToken = jwt.verify(token, 'jwt_places_app');
        req.userData = {userId: decodedToken.userId}
        next()
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }

}
