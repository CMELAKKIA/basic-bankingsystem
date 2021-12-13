const express=require('express')
const ejs=require('ejs')
let app=express();
let mongodb=require('mongodb')
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')



let db



let port = process.env.PORT
if (port == null || port == "") {
  port = 3000
}


mongodb.MongoClient.connect('mongodb+srv://todoappUser:todoappUser@cluster0.8hhqo.mongodb.net/bankapp?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    db = client.db()
    app.listen(port)
})





app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/',function(req,res){

    
    res.render('index.ejs')
})

app.get('/createuser', function(req, res) {
    res.render('createuser.ejs')
})

app.post('/createuser',function(req,res){
    
    db.collection('accountdetails').insertOne({name:req.body.name,mobile:req.body.mobile,accountbalance:req.body.accbal}, function(err, info) {
        res.render('createuser.ejs')
      })
})

app.get('/viewaccounts',function(req,res){

    db.collection('accountdetails').find().toArray(function(err,items){
       res.render('viewaccounts.ejs',{items:items})
    })
})

app.get('/transfer',function(req,res){
    res.render('transfermoney.ejs')
})

app.post('/transfer', function(req, res) {
           
    db.collection('accountdetails').find({name:req.body.to}).toArray(function(err,items){
      
        var acc;
      items.forEach(function(items){ 
        acc=items.accountbalance;
        
        })
        var amount= parseInt(acc) + parseInt(req.body.amount)
        console.log(amount)
     db.collection('accountdetails').findOneAndUpdate({name: req.body.to}, {$set: {accountbalance:amount}}, function() {
       db.collection('accountdetails').find({name:req.body.from}).toArray(function(err,items){
      
         var senderacc;
          items.forEach(function(items){ 
            senderacc=items.accountbalance;
            
            })
            var senderamount= parseInt(senderacc) - parseInt(req.body.amount)

            
         db.collection('accountdetails').findOneAndUpdate({name: req.body.from}, {$set: {accountbalance:senderamount}}, function() {
           res.render('transfermoney.ejs')
         })
     });
     })
 });

 
})


