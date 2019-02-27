var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register',
  						 { title: 'Заполнение формы о проблеме' ,
                           h1: 'Введите ваши данные',
                           name: 'Имя',
                           years: 'Возраст',
            			});
});

module.exports = router;
