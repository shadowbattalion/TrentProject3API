const express = require("express")
const hbs = require("hbs")
const wax = require("wax-on")
require("dotenv").config()
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)


let app = express()

//HBS
app.set("view engine", "hbs")
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts")


//middlewares
//Static Files
app.use(express.static("public"))

//Encoding
app.use(
  express.urlencoded({
    extended: false
  })
)

//Sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))



//custom middlewares
// Flash
app.use(flash())
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_flash")
  res.locals.error_messages = req.flash("error_flash")
  next()
})


//global middlewares
//User Profile base display
app.use(function(req,res,next){
  res.locals.user_base = req.session.user?req.session.user:""
  next();
})


//routes
const home_route = require('./routes/website_routes/home');
const games_route = require('./routes/website_routes/games')
const users_route = require('./routes/website_routes/users')



async function main() {

    app.use('/', home_route)
    app.use('/list-games', games_route)
    app.use('/users', users_route)

 
}

main()

app.listen(3004, () => {
  console.log("Server has started");
})

