const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const { celebrate, Joi } = require("celebrate");

const User = require('../models/usersModel.js');
const config = require('../config');

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if(!authorizationHeader){
        res.status(403).json({ error: 'Not Authorised' });
    }
    const authorizationToken = authorizationHeader.split(' ')[1];
    if (authorizationToken) {
        jwt.verify(authorizationToken, config.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Failed to authenticate' });
            } else {
                req.authorId = decoded.id;
                next();
            }
        });
    } else {
        res.status(403).json({ error: 'No token provided' })
    }
}

router.get('/',isAuthenticated, authRole('ROOT'), celebrate({
    query: {
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(5),
        search: Joi.string()
        
    }
}),  (req, res) => {
      const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
      const page = limit*(parseInt(req.query.page)-1);// Make sure to parse the skip to number

    User.find({}, {password:0},{limit:limit,skip:page}, (err, articles) => {
        res.json({ articles });
    })
});

function authRole(role) {
    return async (req, res, next) => {

        let isAdmin  = await User.findOne({'_id': req.authorId},{'role':1,'_id':0}).exec()
        .then()
        .catch(err => console.log(err))

        // console.log(isAdmin)
        
      if (isAdmin.role !== role) {
        res.status(401).json({ error: 'Not Authorised to access' });
        return res.send('Not allowed')
      }
  
      next()
    }
  }


  router.delete('/delete/:id', isAuthenticated, authRole('ROOT'), (req, res) => {
    // console.log(req);
    User.findByIdAndDelete( req.params.id, (error, item) => {
        // console.log(err)
        if (!item){
            res.json({ Error: 'Could not find user. Something went wrong' });
        }else{
            res.json({ success: 'success' });
        }
    })
});

router.post('/edit/', isAuthenticated, authRole('ROOT'), (req, res) => {
  let role = req.query.role;
  if (role == "USER") {
    role = "ADMIN";
  } else {
    role = "USER";
  }

  User.findByIdAndUpdate(req.query.id, { role: role }, (err) => {
    if (err) throw err;
    else res.json({ success: "success" });
  });
});

module.exports = router;