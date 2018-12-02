var express =require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var async =require('async');
// Enter your password here
var password= '1234567890';
// App will listen to port 3000
var port=3000;
//Create the connection with the server and database.
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
  database:'db1'
});
con.connect(function(err){
	if(err) throw err;
	else{
		console.log("Connected");
		//Sql query to create a table in database.
		var sql="create table if not exists items( item_id int NOT NULL AUTO_INCREMENT PRIMARY KEY, item_name varchar(20) NOT NULL , item_category varchar(20) NOT NULL );"
		con.query(sql,function(err,res){
			if(err) throw err;
			else {
				console.log("Table created");
			}
		});
	}
});
var app= express();
//view engine for rendering dynamic html pages.
app.set('view engine','ejs');
// bodyParser  for POST request.
var urlencodedParser = bodyParser.urlencoded({ extended:false  })
//  To load stylesheet and javascript code from src folder.
app.use('/',express.static('src'));
// To handle starting '/' get request.
app.get('/',function(req,res){
	// create a connection.
   	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: password,
	  database:'db1'
	});   	
	// to store animals, fruits and flowers data.
	var data_animals=[];
	var data_fruits=[];
	var data_flowers=[];	
	//connect to server.
    con.connect(function(err) {
		if (err) throw err;
		// Sql query to select all items from database.
		con.query("select * from items", function (err, result) {
		    if (err) throw err;
			    for(var i=0;i<result.length;i++){
			    	if(result[i].item_category=='Animals'){
			    		data_animals.push(result[i]);
			    	}
			    	else if(result[i].item_category=='Flowers'){
			    		data_flowers.push(result[i]);
			    	}
			    	else if(result[i].item_category=='Fruits')
			    		data_fruits.push(result[i]);
			    }
			// Render the starting html page with values retrieved from database.
		 	res.render('startindex',{data_animals: data_animals,data_flowers:data_flowers,data_fruits:data_fruits});
		  });
	});
});
// to handle post or submit item data request.
app.post('/api', urlencodedParser, function (req, res) {
  	if (!req.body) return res.sendStatus(400)
  	// create a connection.
  	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: password,
	  database:'db1'
	});
	//connect to server 
	con.connect(function(err){
		if(err) throw err;
		else{
			// to store animals, fruits and flowers data.
			var data_animals=[];
			var data_fruits=[];
			var data_flowers=[];
			// sql query to insert items into table.
			var sql='insert into items(item_name, item_category) values ?';
			// array to store input items retrieved from form .
			var values=[['','']];
			var length=0;
			/*
					Below code converts the sql return RowDataPacket to a araray values.
			*/
			//  when RawDataPacker is a string.
			if(typeof(req.body.name)=="string"){
				var temp=[];
				temp[0]=req.body.name;
				temp[1]=req.body.Category;
				// to block values with null name.
				if(temp[0]!=""){
					values[length]=temp;
					length++;
				}
			}
			else{
				// when RawDataPacket is a array.
				var name_array=req.body.name;
				var category_array=req.body.Category;
				for(var i=0;i<name_array.length;i++){
					var temp=[];
					temp[0]=name_array[i];
					temp[1]=category_array[i];
					// to block values with null name.
					if(temp[0]!=""){
						values[length]=temp;
						length++;
					}
				}
			}
			// perform sql query to insert data into database.
			con.query(sql,[values],function(err,res){
				if(err) throw err;
				else {
					console.log("Data inserted");
				}
			});
			// sql query to retrieve items from database.
			con.query("select * from items", function (err, result) {
			    if (err) throw err;
			    for(var i=0;i<result.length;i++){
			    	if(result[i].item_category=='Animals'){
			    		data_animals.push(result[i]);
			    	}
			    	else if(result[i].item_category=='Flowers'){
			    		data_flowers.push(result[i]);
			    	}
			    	else if(result[i].item_category=='Fruits')
			    		data_fruits.push(result[i]);
			    }
			    // Render the page after data is uploaded. 
			  	res.render('index',{data_fruits:data_fruits,data_flowers:data_flowers,data_animals:data_animals});
			  });
		}
	});
});
// handles the data classification request.
app.post('/classify', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	// create a connection.
  	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: password,
	  database:'db1'
	});
	// connect to server.
	con.connect(function(err){
		if(err) throw err;
		else{
			console.log("Connected");
			// to store animals, fruits and flowers data.
			var data_animals=[];
			var data_fruits=[];
			var data_flowers=[];
			//	array to store input items retrieved from form (names of items to be searched).
			var values=[];
			var length=0;
			/*
					Below code converts the sql return RowDataPacket to a araray values.
			*/
			//  when RawDataPacker is a string.			
			if(typeof(req.body.name)=="string"){
				var temp;
				temp=req.body.name;
				values[length]=temp;
				length++;
			}
			else{
				// when there are multiple inputs (array of names).
				var name_array=req.body.name;
				for(var i=0;i<name_array.length;i++){
					var temp;
					temp=name_array[i];
					values[length]=temp;
					length++;
				}
			}
			var res_animal=[];
		    var res_fruit=[];
			var res_flower=[];
			var other=[];
		    var ok=0;
		    // async function perform the fucntion in the order they are written.
    		async.forEachOf(values, function (dataElement, i, inner_callback){
	        	var temp_value = dataElement;
	        	var ssql = "select * from items where item_name =?";
	        	// sql quey to select items with given name,
		        con.query(ssql,temp_value, function(err, result){
		            if(!err){
		            	// categorize the items acccording to teir category.
		            	for(var i=0;i<result.length;i++){
							if(result[i].item_category=='Animals'){
							res_animal.push(result[i]);
							}
							else if(result[i].item_category=='Flowers'){
				    			res_flower.push(result[i]);
				    		}
							else if(result[i].item_category=='Fruits'){
				    			res_fruit.push(result[i]);
					   		}
						}
						if(result.length==0) other.push(dataElement);
		                inner_callback(null);
		            } else {
		                console.log("Error while performing Query");
		                throw(err);
		            };
        		});
    		},  function(err){
        		   if(err){
          		//handle the error if the query throws an error
          				console.log("coming");
          				throw(err);
        		}else{
        	   // Render the classified data
          			res.render('indexapi',{data_fruits:res_fruit,data_flowers:res_flower,data_animals:res_animal,data_other:other});
        		}
    	});
		}
	});
})
// App listening to port 3000;
app.listen(port);