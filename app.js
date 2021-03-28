require('dotenv').config()
const path = require('path')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const router = express.Router();
const session = require('express-session')
const passport = require('passport')


const app = express();
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'));

////Passport config

const Auth = require('./Authentication/Auth');
Auth(passport)

////Body Parser

app.use(express.urlencoded({ extended : false }))
////Express Session


app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

///Initialised and session should be below the session
///Passport MiddleWare

app.use(passport.initialize());
app.use(passport.session());

////Connect flash

app.use(flash())

////Global vars

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    next();
})


const PORT = process.env.PORT

const DB_Connection = process.env.MONGODB_URI;

mongoose.connect(DB_Connection, { useNewUrlParser : true, useUnifiedTopology: true }).then(()=> console.log('Connection is established')).catch((error) => console.log(error))

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(PORT, () => {
    console.log('Server is up on '+ PORT);
})