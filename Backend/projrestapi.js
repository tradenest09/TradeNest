const exp = require('express')
const cors = require('cors');
const app = exp();

app.use(exp.json());
app.use(cors())



app.listen(9000, function() {
   console.log("exp started - rest API");
})


const mysql = require('mysql2');
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "project_db"
});

con.connect(function(err){
    if(!err){
        console.log("Connection Established!");
    }
    else
        console.log("rejected : "+err.toString());
})

app.post('/login' ,function(req,res){
    
    let query = "select * from users where username = ? and password = ?"
    con.query(query, [req.body.username, req.body.password], function(err,result) {
         if(!err) {
	 	if(result.length === 1)
	            res.status(200).json({user: {userid: result[0].userid, username:result[0].username, role: result[0].roleid }, token:"abc123"});
                else
	            res.status(404).send("login failed");
         } 
	 else{
              res.status(500).send("Could not fetch data");
         }
    })
})



app.post('/register', function(req, res) {

let query = `
INSERT INTO users
(username,password,firstname,lastname,roleid,email,contactnumber)
VALUES(?,?,?,?,?,?,?)
`;

con.query(
    query,
    [
        req.body.username,
        req.body.password,
        req.body.firstname,
        req.body.lastname,
        2,
        req.body.email,
        req.body.contactnumber
    ],
    function(err, result){

        if(!err){
            res.status(201).send("User Registered Successfully");
        }
        else{
            console.log(err);
            res.status(500).send("Registration Failed");
        }
    }
);


});


app.get('/assets', function(req,res){


let query = "select * from assets";

con.query(query,function(err,result){

    if(!err){
        res.status(200).json(result);
    }
    else{
        res.status(500).send("Could not fetch assets");
    }

});

});



app.post('/assets', function(req,res){
let query = `
INSERT INTO assets
(title,description,category,price,type,ownerid)
VALUES(?,?,?,?,?,?)
`;

con.query(
    query,
    [
        req.body.title,
        req.body.description,
        req.body.category,
        req.body.price,
        req.body.type,
        req.body.ownerid
    ],
    function(err,result){

        if(!err){
            res.status(201).send("Asset Added Successfully");
        }
        else{
            console.log(err);
            res.status(500).send("Could not add asset");
        }

    }
);


});






app.all('/*splat', function(req,res) {
    res.send("Invalid URL");
})

