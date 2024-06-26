const express = require("express")
const hbs = require("hbs")
const wax = require("wax-on")
require("dotenv").config()
const cors = require('cors')

const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)
const csrf = require('csurf')


let app = express()

// cors
app.use(cors())

//HBS
app.set("view engine", "hbs")
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts")

// css
app.use(express.static(__dirname + '/public'))

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


//global middlewares
//User Profile base display
app.use(function(req,res,next){
  res.locals.user_base = req.session.user?req.session.user:""
  next();
})


//custom middlewares
// Flash
app.use(flash())
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_flash")
  res.locals.error_messages = req.flash("error_flash")
  next()
})

// CSRF
const csrfInstance = csrf()

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_flash', 'The form has expired.');
      req.session.save(function () { 
              res.redirect('back');
      })
  } else {
      next()
  }
})

app.use(function(req,res,next){

  if(req.url == "/checkout/process_payment" || req.url.slice(0,5) == '/api/'){
    next()
  }else{
    csrfInstance(req,res,next)
  }

})


app.use(function(req,res,next){
  if(req.csrfToken){
    res.locals.csrf = req.csrfToken();
    
  }

  next();
})




//routes
const website={
  "home_route" : require('./routes/website_routes/home'),
  "games_route" : require('./routes/website_routes/games'),
  "users_route" : require('./routes/website_routes/users'),
  "cloudinary_route" : require('./routes/website_routes/cloudinary'),
  "cart_route" : require('./routes/website_routes/cart'),
  "checkout_route" : require('./routes/website_routes/checkout'),
  "order_route" : require('./routes/website_routes/orders'),
}

const api = {
  'games_route': require('./routes/api_routes/games'),
  'cart_route': require('./routes/api_routes/carts'),
  'users_route': require('./routes/api_routes/users'),
  'checkout_route': require('./routes/api_routes/checkout'),
  'order_route' : require('./routes/api_routes/orders'),
}


async function main() {

    app.use('/', website.home_route)
    app.use('/list-games', website.games_route)
    app.use('/users', website.users_route)
    app.use('/cldnry', website.cloudinary_route)
    app.use('/cart', website.cart_route)
    app.use('/checkout', website.checkout_route)
    app.use('/orders', website.order_route)
    app.use('/api/list-games', express.json() ,api.games_route)
    app.use('/api/cart', express.json() ,api.cart_route)
    app.use('/api/users', express.json() ,api.users_route)
    app.use('/api/checkout', express.json() ,api.checkout_route)
    app.use('/api/order', express.json() ,api.order_route)

 
}

main()

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
})

