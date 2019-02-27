var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var formidable = require('formidable');
var multer          =       require('multer');
var upload          =       multer({ dest: './uploads/'});
var fs              =       require('fs');

/*app.use(multer({ dest: './uploads/',
rename: function (fieldname, filename) {
    return filename+Date.now();
},
onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
},
onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
 }
}, res, next));
*/
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
  database : "spp_1"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

global.mysql = mysql;


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
  console.log(req.headers["accept-language"])
  if(req.headers["accept-language"].split(',')[0] == "ru"){
    res.render('register.ejs',
               { title: 'Заполнение формы о проблеме' ,
                           h1: 'Введите ваши данные',
                           name: 'Имя',
                           mail: 'почтовый ящик',
                           description: "описание проблемы",
                           state: "состояние заказа"
                  });

  } else{
    res.render('register.ejs',
               { title: 'fill problem form' ,
                           h1: 'your credits',
                           name: 'Name',
                           mail: 'Mail',
                           description: "problem description",
                           state: "order state"
                  });

  }
});


function print_list(list, response)
{
    table = ""
    for (let el of list)
    {
        table += "<p>name:        " + el["user_name"] + "</p>";
        table += "<p>user_mail:   " + el["user_mail"] + "</p>";
        table += "<p>state:       " + el["state"] + "</p>";
        table += "<p>create_time: " + el["create_time"] + "</p>";
        table += "<p>description: " + el["description"] + "</p>";
        table += "<p>file_url:    " + el["file_url"] + "</p>";
        list = el["file_url"].split(".")
        table += "</br></br>";

/*
        if ((list[list.length - 1] == 'jpg') ||
          (list[list.length - 1] == 'jpeg') ||
          (list[list.length - 1] == 'gif') ||
          (list[list.length - 1] == 'JPEG'))
        {
          console.log(el["file_url"])
          table += "<img src='" + el["file_url"] + "' height='100' width='100'>"
        }
        table += "</br></br>";
        */
    }
    response.send(table)
}

app.post("/getList", urlencodedParser, function(request, response){

  if(!request.body){
    return
  }

  is_in_process = request.body["checkBox_inProcess"]
  is_in_waiting = request.body["checkBox_waiting"]
  is_in_finished = request.body["checkBox_finished"]


  let query_ = 'SELECT * FROM spp_1.orders WHERE';

  if ( false == (is_in_process || is_in_waiting || is_in_finished)){
                response.send("ничего не выбрано");
                return
      } 

  if (is_in_process){
      query_ += ' state="in process" '
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

            print_list(result, response);
   });
});


function isValidName(name){
  return true
}

function isValidMail(mail){
  return true
}


function bin2String(array){
            var result = "";
            for(var i = 0; i < array.length; ++i){
              result+= (String.fromCharCode(array[i]));
            }
            return result;
          }


function bufferFile(Path) {
            return fs.readFileSync(Path); // zzzz....
          }



app.post("/upload", urlencodedParser, function (request, response) {



  console.log("ffff")
    var BUFFER = bin2String(bufferFile('D:/work/SPP/SPP_1/test_2/test_2/tmp'));
    try{
      fs.unlinkSync(BUFFER);
    } catch(exc)
    {

    }
    /// delete /// 



    var form = new formidable.IncomingForm();
    form.uploadDir ='/';
    form.keepExtensions = true;

    form.type = 'multipart/form-data';
    form.multiples = true;

    form.on('error', function(err) {
          console.log(err);
    });

    form.on('end', function(fields, files) {
    
    });

    form.parse(request, function(err, fields, files) {

          path = files['file']['path'];
          file = "D:/word/SPP/files/" + path

          
          console.log(file)

          fs.writeFile("D:/work/SPP/SPP_1/test_2/test_2/tmp", file, function(err) {
            if(err) {
              return console.log(err);
            }
          }); 
          

          /*var blob = file.slice(startingByte, endindByte);
          reader.readAsArrayBuffer(blob);
          
          hash = CryptoJS.MD5();
          console.log(oldpath)
          var newpath = 'D:/' + "file_1";
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
          });
          */
      });
});




app.post("/register", urlencodedParser, function (request, response) {
    /*upload(request,response,function(err) {
      if(err) {
          return response.end("Error uploading file.");
      }
      response.end("File is uploaded");
    });


*/
    /*fs.writeFile("/tmp", '', function(err) {
            if(err) {
              return console.log(err);
            }
    });
    */

    if(!request.body){
      return response.sendStatus(400);
    } 

    userName = request.body["userName"]
    userMail = request.body["userMail"]
    description = request.body["description"]
    state = request.body["state"]

    



          

          var BUFFER = bin2String(bufferFile('D:/work/SPP/SPP_1/test_2/test_2/tmp'));
          file = BUFFER


          //file_url_ = "D:/work/SPP/SPP_1/test_2"; 

          create_time = new Date()

          if (!isValidName(userName)){
            response.send("недопустимое имя");
            return 
          }


          if (!isValidMail(userMail)){
            response.send("недопустимая почта");
            return 
          }

          try
          { 
              con.query("INSERT INTO orders (user_name, user_mail, create_time, state, description, file_url)\
                     values ('" + userName + "', '"+ userMail +"',\
                     '" + create_time + "', '" + state + "', '" + description + "', '" + file + "'" + ")");
          } catch(ex)
          {
              response.send("ERROR")
              return 
          }
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