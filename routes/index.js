var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/chat',function(req,res,next){
  res.render('index');
});

router.get('/walwal',function(req,res,next){
    res.render('walwal');
});


router.get('/setting',function(req,res,next){
    res.render('setting');
});

router.get('/walwalDetail',function(req,res,next){
    res.render('walwalDetail');
});
module.exports = router;
