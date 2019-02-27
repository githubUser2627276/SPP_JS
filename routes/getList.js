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
console.log("f")
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
