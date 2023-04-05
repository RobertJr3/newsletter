const express =require('express')
const bodyParser=require('body-parser')
const request=require('request')
const https=require('https');
const { url } = require('inspector');
const { response } = require('express');

const app=express();
app.use(express.static("public"))   // server => to access the static file in our system
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post('/',function(req,res){
    var firstName=req.body.fName;
    var lastName=req.body.lName;
    var email=req.body.email;
    // console.log(firstName,lastName,email);

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                   FNAME:firstName,
                   LNAME:lastName
                }
            }
        ]       
    };

    const jsonData=JSON.stringify(data);
    
    const url="https://us21.api.mailchimp.com/3.0/lists/ec153b635ba";
    const options={
        method:"POST",
        auth:"sivaram:30f3b0774ffc7b60747e0cc7ba3db1ce-us21"
    };


    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    

    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect('/');
});

app.listen(process.env.PORT||3000,function(){
    console.log("Server is running on port 3000");
});





// api key
// 30f3b0774ffc7b60747e0cc7ba3db1ce-us21

// list id
// ec153b635b.