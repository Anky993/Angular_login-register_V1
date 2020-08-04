const express = require('express');
var bcrypt = require('bcryptjs');
var cors = require('cors')
const{MongoClient, ObjectID} = require('mongodb');
app = new express();
app.use(cors())
let connection; 

var BCRYPT_SALT_ROUNDS = 12;
mongoconfig = {
    url : "mongodb://localhost:27017",
    database : "test1"
}
app.use(express.json())

 MongoClient.connect(mongoconfig.url,{ useUnifiedTopology: true})
.then(db=>{
   connection = db;
   console.log("connected");
})
.catch(err => console.error(err.stack))

app.get('/get', (req,res)=>{
   connection.db(mongoconfig.database).collection('mycol1').find().toArray((err, result)=>{
      if(err) throw err;
      res.json(result);
      console.log(result);
   })
})

app.post('/search',(req,res)=>{
    console.log(req.body);
    connection.db(mongoconfig.database).collection('mycol1').findOne({Email: req.body.Email }, (err,result)=>{
        if(err) throw err;
        res.json(result);
    })
})

app.post('/delete',(req,res)=>{
    console.log(req.body);
    connection.db(mongoconfig.database).collection('mycol1').deleteOne({_id: ObjectID(req.body.deletedata) }, (err,result)=>{
        if(err) throw err;
        res.json(1);
    })
})

app.get('/deleteall',(req,res)=>{
    console.log(req.body);
    connection.db(mongoconfig.database).collection('mycol1').remove( {}, (err,result)=>{
        if(err) throw err;
        res.json(req.body);
    })
})

app.post('/update',(req,res)=>{

    console.log(req.body);
    // connection.db(mongoconfig.database).collection('mycol1').updateMany({_id: ObjectID(req.body.ID)},{"Email" : "req.body.Email", "First Name" : "req.body.FirstName","Last Name" : "req.body.LastName"}, (err,result)=>{
        connection.db(mongoconfig.database).collection('mycol1').updateOne({_id: ObjectID(req.body.ID)},{$set: req.body}, (err,result)=>{
        if(err) throw err;
        res.json(result);
    })
})







app.post('/login',(req,res) =>{
    connection.db(mongoconfig.database).collection('mycol1').findOne({Email: req.body.Email}, (err,result)=>{
        if(err) {throw err;
        console.log(err)}
        var user = result;
        if(result){
        console.log("Request Data",req.body);
        console.log("userData",user);
           
        if(bcrypt.compareSync(req.body.Password, user.Password)) {
          // return res.status(400).send({ message: "The password is invalid" });
          console.log("dbhsbhfbhbhbfhdh");
        return res.json(result);
          }
          else {
            console.log("wrong password");
              return res.json(0);
          }
        }
        else {
          res.json(0);
        }
    })
})
app.post('/loginByGoogle',(req,res) =>{
    connection.db(mongoconfig.database).collection('mycol1').findOne({Email: req.body.Email}, (err,result)=>{
        if(err) {throw err;
        console.log(err)}
        res.json(result);
    })
})



app.post('/register', (req,res,next)=>{
    connection.db(mongoconfig.database).collection('mycol1').findOne( { Email: req.body.Email },(err, result)=>{
		if(err) {throw err;
        console.log(err)}
        if(result){
		    res.json(0);
        return next();  
		} else {
            req.body.Password= bcrypt.hashSync(req.body.Password, 10);
			connection.db(mongoconfig.database).collection('mycol1').insertOne(req.body, function (err, result) {
				if(err) {throw err;
				console.log(err)}
				res.json(req.body);
				console.log("posting");
				console.log(result);
		})
		}
	})
})
app.post('/registerByGoogle', (req,res,next)=>{
    connection.db(mongoconfig.database).collection('mycol1').findOne( { Email: req.body.Email },(err, result)=>{
		if(err) {throw err;
        console.log(err)}
        if(result){
		res.json(0)
        return next();  
		} else {
			connection.db(mongoconfig.database).collection('mycol1').insertOne(req.body, function (err, result) {
				if(err) {throw err;
				console.log(err)}
				res.json(req.body);
				console.log("posting");
				console.log(result);
		})
		}
	})
})
app.listen(9000);