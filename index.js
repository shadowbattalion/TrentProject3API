const express = require("express")
const hbs = require("hbs")
const wax = require("wax-on")
require("dotenv").config()

const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)


let app = express()


app.set("view engine", "hbs")


app.use(express.static("public"))


wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts")


app.use(
  express.urlencoded({
    extended: false
  })
)

app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(flash())

//middlewares
// Flash
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages")
  res.locals.error_messages = req.flash("error_messages")
  next()
})


//routes
const home_route = require('./routes/home');
const games_route = require('./routes/games')



async function main() {

    app.use('/', home_route)
    app.use('/list-games', games_route)


 
}

main();

app.listen(3002, () => {
  console.log("Server has started");
})

