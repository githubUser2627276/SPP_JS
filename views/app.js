var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

module.exports = app;

//const express = require("express");
const bodyParser = require("body-parser");
  
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1092",
  database : 'spp_1'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

global.mysql = mysql;

/*
con.query("
  CREATE TABLE orders (`id` int NOT NULL AUTO_INCREMENT,\
  `first_name` varchar(255) NOT NULL,\
  `last_name` varchar(255) NOT NULL,\
  `number` varchar(255) NOT NULL,\
  `time` int(11) NOT NULL,\
  `status` varchar(255) NOT NULL,\
  `picture_url` varchar(20) NOT NULL,\
  `picture_hash` varchar(20) NOT NULL,\
  PRIMARY KEY (`id`)\
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;")
*/

//const app = express();
  
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});
 


//module.exports = router;

//app.get("/register", urlencodedParser, function (request, response) {
//    response.sendFile(__dirname + "/views/register.html");
//});



app.get('/getList', function(req, res, next) {
  if(req.headers["accept-language"].split(',')[0] == "ru-RU"){
  res.render('getList.ejs',
               {});

  } else{
  res.render('getList.ejs',
               { });

  }
});

app.get('/register', function(req, res, next) {
  if(req.headers["accept-language"].split(',')[0] == "ru-RU"){
  res.render('register.ejs',
               { title: 'Заполнение формы о проблеме' ,
                           h1: 'Введите ваши данные',
                           name: 'Имя',
                           mail: 'почтовый ящик',
                  });

  } else{
  res.render('register.ejs',
               { title: 'fill problem form' ,
                           h1: 'your credits',
                           name: 'Name',
                           mail: 'Mail',
                  });

  }
});


function print_list(list)
{
    for (el in list)
    {
      response.send("<p>привет</p>")
    }
}

app.post("/getList", function(request, response){
  //is_in_process = document.getElementById("checkBox_inProcess").checked
  //is_in_waiting = document.getElementById("checkBox_waiting").checked
  //is_in_finished = document.getElementById("checkBox_finished").checked

  if(!request.body){
    return
  }

  is_in_process = request.body["checkBox_inProcess"]
  is_in_waiting = request.body["checkBox_waiting"]
  is_in_finished = request.body["checkBox_finished"]

  print(is_in_finished)
  print(is_in_finished.checked)

  let query_ = 'SELECT * FROM spp_1.orders WHERE';

  if ( false == (is_in_process || is_in_waiting || is_in_finished)){
                response.send("ничего не выбрано");
                return
      } 

  if (is_in_process){
      query_ += ' state="starting" '
  }

  if (is_in_waiting){
      if (is_in_process){
           query_ += ' or state="waiting" '
      } else{
           query_ += ' state="waiting" '
      }
  } 

  if (is_in_finished){
     if (is_in_process || is_in_waiting){
         query_ += ' or state="finished" '
     } else{
         query_ += ' state="finished" '
      }
  }

  query_ += ' ORDER BY id ASC'

  con.query(query_, (err, result) => {
            if (err) {
                res.redirect('/register');
            }

            
            result = con.query(query_, function(err, rows) {
    
                  if (err) {
        
                       console.log(err);
        
       
                  }
                  
                  print_list(rows);
        
  // connected! (unless `err` is set) 
            });
   });
});


app.post("/register", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);

    userName = request.body["userName"]
    userMail = request.body["userMail"]
    description = request.body["description"]
    create_time = new Date()

    console.log(create_time)

    con.query("INSERT INTO orders (user_name, user_mail, create_time, state, description)\
               values ('" + userName + "', '"+ userMail +"',\
               '" + create_time + "', 'starting', '" + description + "')");

    response.send("Ваша заявка добавлена");
});






  
  
app.get("/", function(request, response){
    response.send("Главная страница");
});
  
app.listen(3001);


/*
CREATE DATABASE SPP_1;
CREATE TABLE IF NOT EXISTS orders (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `number` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `picture_url` varchar(20) NOT NULL,
  `picture_hash` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
*/