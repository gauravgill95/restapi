var express =require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234567890",
});
con.query("CREATE DATABASE if not exists db1", function (err, result) {
    if (err) throw err;
    console.log("Database created");
});
con.database='db1';
con.end();
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234567890",
  database:'db1'
});
con.connect(function(err){
	if(err) throw err;
	else{
		console.log("Connected");
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
app.set('view engine','ejs');
var urlencodedParser = bodyParser.urlencoded({ extended:false  })
app.use('/',express.static('src'));
app.get('/',function(req,res){
    //res.sendFile(__dirname +'/index.html');
    		var con = mysql.createConnection({
		  host: "localhost",
		  user: "root",
		  password: "1234567890",
		  database: "db1"
		});
    	var resul1,resul2,resul3;
		con.connect(function(err) {
		  if (err) throw err;
		
		  con.query("select * from items where item_category='Animals'", function (err, result1) {
		    if (err) throw err;
		    resul1=result1;
		    console.log(result1);
		    res.send(resul1);
		    //res.send(result);
		    
		    //res.send("Got it");
		  });
		  con.query("select * from items where item_category='Flowers'", function (err, result2) {
		    if (err) throw err;
		    resul2=result2;
		    console.log(result2);
		    //res.send(result);
		    
		    //res.send("Got it");
		  });
		  con.query("select * from items where item_category='Fruits'", function (err, result3) {
		    if (err) throw err;
		    resul3=result3;
		    console.log(result3);
		    //res.send(result);
		    
		    //res.send("Got it");
		  });
		});
		console.log(resul1);
		console.log(resul2);
		//res.send(resul2);
	//res.render('startindex',{data1 : resul1,data2 :resul2, data3: resul3});
    //res.render('startindex',{data :data});
});
app.get('/api/data',function(req,res){
		var con = mysql.createConnection({
		  host: "localhost",
		  user: "root",
		  password: "1234567890",
		  database: "db1"
		});
		con.connect(function(err) {
		  if (err) throw err;
		  con.query("SELECT * FROM items", function (err, result, fields) {
		    if (err) throw err;
		    console.log(result);
		    res.send("Got it");
		  });
		});
});
app.post('/api', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "1234567890",
	  database:'db1'
	});
	con.connect(function(err){
		if(err) throw err;
		else{
			console.log("Connected");
			var sql='insert into items(item_name, item_category) values ?';
			var values=[['','']];
			var length=0;
			if(typeof(req.body.name)=="string"){
				var temp=[];
				temp[0]=req.body.name;
				temp[1]=req.body.Category;
				values[length]=temp;
				length++;
			}
			else{
				var name_array=req.body.name;
				var category_array=req.body.Category;
				for(var i=0;i<name_array.length;i++){
					console.log("pk");
					var temp=[];
					temp[0]=name_array[i];
					temp[1]=category_array[i];
					values[length]=temp;
					length++;
				}
			}
			console.log(values);
			con.query(sql,[values],function(err,res){
				if(err) throw err;
				else {
					console.log("Data inserted");
				}
			});
		}
	});
  console.log(req.body);
  //res.send('welcome, ' + req.body.name);
  res.render('index');
})
app.listen(3000);