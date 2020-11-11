
const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Fawn = require('fawn');

mongoose.connect("mongodb://localhost/places-app", 
{useNewUrlParser: true, useUnifiedTopology: true, retryWrites:false}).
then(() => console.log("connected to database sucessfully"))
.catch(() => console.log("error connecting to database"));

Fawn.init(mongoose);


const {PlacesRoutes} = require('./routes/places-routes');
const {UsersRoutes} = require('./routes/users-routes');


app.use(bodyParser.json());


//routes middleware
app.use('/api/places', PlacesRoutes);
app.use('/api/users', UsersRoutes);

//applied to unsupported routes
app.use((req, res) => {
    return res.status(404).json({message: 'Resource not found'});
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port: ${port}`));