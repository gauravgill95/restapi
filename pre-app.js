var express =require('express');
var password='Enter your password here';
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

con.end();