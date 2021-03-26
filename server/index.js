// require all the packages we install at the top.
require('dotenv').config
const express = require('express');
const massive = require('massive');
const products_controller = require('./products_controller');

// We'll begin by saving express() to a variable called app.
const app = express();
//Next we will destructure the SERVER_PORT variable off of process.env.
const {SERVER_PORT, CONNECTION_STRING} = process.env;

//Then, we'll want to use our express.json middleware.
app.use(express.json())

app.post('/api/products/', products_controller.create);
app.get('/api/products', products_controller.getAll);
app.get('/api/products/:id', products_controller.getOne);
app.put('/api/products/:id', products_controller.update);
app.delete('/api/products/:id', products_controller.delete);


//Then destructure CONNECTION_STRING off of process.env in the server. Using the CONNECTION_STRING, we can invoke massive and pass it in as the first argument inside of an object. This will return a promise. Add ssl: {rejectUnauthorized: false} to the passed in object.
massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
})
//We'll want to execute some logic when the promise is fulfilled, so let's chain a .then to it. Be sure to capture the database instance in the first parameter.
.then(dbInstance => {
    // Let's have our function return app.set('db', dbInstance).
    app.set('db', dbInstance)

//Finally, we'll want to tell the server to listen on port 3000 using the variable from our .env and use a console.log to tell us when it is listening.
app.listen(SERVER_PORT, () => {
    console.log(`Listing with all of my heart on port: ${SERVER_PORT}`);
});    

})
.catch(err => console.log(err))

