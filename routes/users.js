const express = require('express')
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport')

const router = express.Router();



router.get('/login', (req, res) => {
     res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

//Register Handler 

router.post('/register', (req, res) => {
    console.log(req.body);
    const {name, email, password, password2} = req.body;
    let errors = [];
     
    ///Checking required Fileds

    if(!name || !email || !password || ! password2){
          errors.push({message: "Please fill out all the details"});

    }

    ///Checking if the password match

    if(password !== password2){
        errors.push({message : 'Please check the password'})
    }

    ////checking if the password is atleasr 8 character
    if(password.length < 6){
        errors.push({message : 'Password should be atleast 8 characters '})

    }
    if(errors.length > 0){
         res.render('register', {
             errors,
             name,
             email,
             password,
             password2
         });
    }else {
        Users.findOne({email : email})
        .then(user => {
            ///User exist 
            if(user){
                errors.push({message : 'User already exist!'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new Users({
                    name,
                    email,
                    password
                });

                ///Generate hash
                bcrypt.genSalt(10, (err, salt) => {
                      bcrypt.hash(newUser.password, salt, (error, hash) => {
                           if(error) throw error;
                            

                           ////Setting new hash password
                           newUser.password = hash;

                           ///Save users 

                            newUser.save().then(resUser => { 
                              ///Show flash messages  
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login')})
                            .catch(errs => {
                                req.flash('error_msg', 'Not registered.')
                                console.log(errs)})
                      })
                })
            }

        })
    }
})

////Login Handler 

router.post('/login', (req, res, next) => {
       passport.authenticate('local', {
           successRedirect : '/dashboard',
           failureRedirect : '/users/login',
           failureFlash : true
       })(req, res, next);
})

///Log pout handler 

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You re logged out');
    res.redirect('/users/login');
    
})


module.exports = router;