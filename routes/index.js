var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/main', function (req, res, next) {
    res.render('chat');
})



router.get('/walwal',function(req,res,next){
    res.render('walwal');
});


router.get('/setting',function(req,res,next){
    res.render('setting');
});

router.get('/walwalDetail',function(req,res,next){
    res.render('walwalDetail');
});



router.get('/getphotho/:id',function (req,res, next) {

});

module.exports = router;
