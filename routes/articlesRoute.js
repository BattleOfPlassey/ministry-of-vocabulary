require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const { celebrate, Joi } = require("celebrate");

const Article = require('../models/articlesModel.js');
const User = require('../models/usersModel.js');
const config = require('../config.js');

let router = express.Router();

const checkForErrors = ({ Word, Meaning }) => {
    let errors = {};
    let isValid = false;
    if (Word === '') {
        errors = { ...errors, Word: 'This field is required' }
    }
    
    if (Meaning === '') {
        errors = { ...errors, Meaning: 'This field is required' }
    }

    const reqBody = {   Word };
    Object.keys(reqBody).forEach(async field => {
        
        if (field === 'Word') {
            const value = reqBody[field];
            const { error, isUnique } = await checkArticleUniqueness( value);
            if (!isUnique) {
                errors = {...errors, ...error};
                }
        }
       
    });

    
    if (Object.keys(errors).length > 0) {
        return { isValid, errors };
    }
    isValid = true;
    return { isValid, errors };
}


const checkArticleUniqueness = (field, value) => {
    return { error, isUnique } = Article.findOne({[field]: {$regex : "^" + value + "$", $options: 'i'}}).exec()
        .then(user => {
            let res = {};
            if (Boolean(user)) {
                res = { error: { [field]: value + " is already present in database." }, isUnique: false };
            } else {
                res = { error: { [field]: "" }, isUnique: true };
            }
            return res;
        })
        .catch(err => console.log(err))
}

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

router.get('/', celebrate({
    query: {
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(5),
        search: Joi.string()
        
    }
}),  (req, res) => {
      const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
      const page = limit*(parseInt(req.query.page)-1);// Make sure to parse the skip to number

    // Article.find({}, null,{limit:limit,skip:page}, (err, articles) => {
    //     res.json({ articles });
    // })


    //Just for Random Documents, aggregate pipline with sample size 10
    Article.aggregate(
        [ { $sample: { size: 10 } } ], (err, articles) => {
                 res.json({ articles });
             }
     )
});

router.get('/myarticles', isAuthenticated, (req, res) => {
    Article.find({authorId: req.authorId}, (err, articles) => {
        if (err) throw err;
        res.json({ articles });
    })
});

router.post('/validate', async (req, res) => {
    const { field, value } = req.body;
    const { error, isUnique } = await checkArticleUniqueness(field, value);

    if (isUnique) {
        res.json({ success: 'success' });
    } else {
        res.json({ error });
    }
});


router.post('/add', isAuthenticated, (req, res) => {
    const Word = req.body.Word || '';
    const Meaning = req.body.Meaning || '';
    const Mneomonic = req.body.Mneomonic || '';
    const Usage = req.body.Usage || '';
    const authorId = req.authorId;

    const { isValid, errors } = checkForErrors({ Word, Meaning });
      

    if (isValid) {
        const newArticle = new Article({
            Word : Word ,
            Meaning : Meaning,
           Mneomonic : Mneomonic ,
           Usage : Usage,
           authorId: new ObjectId(authorId)
        });

        newArticle.save((err) => {
            if (err) throw err;
            else {
                res.json({ success: 'success' });
            }
        });
    } else {
        res.json({ errors });
    }
});

router.post('/edit/:id', isAuthenticated, (req, res) => {
    const Word = req.body.Word || '';
    const Meaning = req.body.Meaning || '';
    const Mneomonic = req.body.Mneomonic || '';
    const Usage = req.body.Usage || '';
    const authorId = req.authorId;

    const { isValid, errors } = checkForErrors({ Word, Meaning });

    if (isValid) {
        const updatedArticle = {
           Mneomonic : Mneomonic ,
           Usage : Usage,
           authorId: new ObjectId(authorId)
        };

        Article.findByIdAndUpdate(req.params.id, updatedArticle, err => {
            if (err) throw err;
            else res.json({ success: 'success' });
        });
    } else {
        res.json({ errors });
    }
});

router.delete('/delete/:id', isAuthenticated, authRole(process.env.ADMIN), (req, res) => {
    Article.findByIdAndDelete( req.params.id, (error, item) => {
        if (!item){
            res.json({ Error: 'Could not find document. Something went wrong' });
        }else{
            res.json({ success: 'success' });
        }
    })
});

 function authRole(role) {
    return async (req, res, next) => {

        let isAdmin  = await User.findOne({'_id': req.authorId},{'role':1,'_id':0}).exec()
        .then()
        .catch(err => console.log(err))

      if (isAdmin.role !== role) {
        res.status(401).json({ error: 'Not Authorised to delete' });
        // return res.send('Not allowed')
        return false
      }
  
      next()
    }
  }


router.get('/word',isAuthenticated,(req, res) => {
    const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }
    // console.log(param)
    Article.find({'Word': {$regex : "^" + param, $options: 'i'}},null,{limit:25}, (err, articles) => {
        if (err) throw err;
        // console.log(articles)
        res.json({ articles });
    })
});

router.get('/words',(req, res) => {
    const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }
    // console.log(param)
    Article.find(
      { Word: { $regex: "^" + param, $options: "i" } },
      null,
      {
        sort: {
          Barrons: -1,
          top1k: -1,
        },
        limit: 7,
      },
      (err, articles) => {
        if (err) throw err;
        // console.log(articles)
        res.json({ articles });
      }
    );
});


/* router.get('/Sord', (req, res) => {
    console.log("🚀 ~ file: articlesRoute.js ~ line 261 ~ router.get ~ req.query.q", req)
   
      if (req.query && req.query.q && req.query.q !== '') {
        
            // Article.findById(req.params.q, (err, article) => {
            //     if (err) throw err;
            //     res.json({ article });
            // })
            Article.findOne({Word: {$regex : "^" + req.query.q + "$", $options: 'i'}},(err, article) => {
                if (err) throw err;
                res.json({ article });
            })
      
      } else {
        res.status(401).json({ error: 'Please provide query parameter' });
      }
}); */

router.get('/:id', (req, res) => {
    
    // const ObjectId = require("mongoose").Types.ObjectId;
      if (ObjectId.isValid(req.params.id)) {
        if (String(new ObjectId(req.params.id)) === req.params.id) {
            Article.findById(req.params.id, (err, article) => {
                if (err) throw err;
                res.json({ article });
            })
        } else {
            res.status(401).json({ error: 'Provided _id is not valid object id' });
        }
      } else {
        res.status(401).json({ error: 'Provided _id is not valid' });
      }
});
module.exports = router;
