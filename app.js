const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Fawn = require('fawn');


const app = express();

mongoose.connect("mongodb://localhost/places-app",
{useNewUrlParser: true, useUnifiedTopology: true, retryWrites:false}).
then(() => console.log("connected to database sucessfully"))
.catch(() => console.log("error connecting to database"));

Fawn.init(mongoose);


const {PlacesRoutes} = require('./routes/places-routes');
const {UsersRoutes} = require('./routes/users-routes');



app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

//handles CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
})


//routes middleware
app.use('/api/places', PlacesRoutes);
app.use('/api/users', UsersRoutes);


//applied to unsupported routes
app.use((req, res) => {
    return res.status(404).json({message: 'Resource not found'});
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port: ${port}`));
