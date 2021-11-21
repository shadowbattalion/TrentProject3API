const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

//routes
const home_route = require('./routes/home');
const games_route = require('./routes/games')



async function main() {

    app.use('/', home_route)
    app.use('/list-games', games_route)


 
}

main();

app.listen(3001, () => {
  console.log("Server has started");
});

