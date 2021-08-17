const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
let alert = require('alert'); 
const fileUpload = require('express-fileupload');
mongoose.connect('mongodb+srv://admin-divs:Hello2310@pdf-cluster.obw3a.mongodb.net/pdfDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload());

const pdfSchema = new mongoose.Schema({
    name: String,
    subjectCode:String,
    semester:{type:String,required: true},
    stream: {type:String,required: true},
    session : Number,
    examName: String,
    all:Boolean
     
});
const PDF = mongoose.model("PDF",pdfSchema);

app.get("/question/:sem/:stream",function(req,res){
    const sem = req.params.sem;
    const stream = req.params.stream;

   
    PDF.find({$or: [{semester:sem,stream:stream},{stream:"all",semester:sem}]},function(err,result){
        if(result.length==0){
            res.render('error',{sem:sem,stream:stream});
        }else{
        res.render('paper',{sem:sem,stream:stream,result:result});
        }
    });

})

app.get("/",function(req, res){
res.render('index.ejs');

});
app.get("/syllabus",function(req,res){
    res.sendFile(__dirname+"/Public/html/syllabus.html")
});

app.get("/question",function(req,res){
    res.sendFile(__dirname+"/Public/html/question.html");
    });

app.post("/newPdfForm",(req,res)=>{
    res.render('newForm');
});

app.post('/upload', function(req, res) {
    
    PDF.find({subjectCode:req.body.subjectCode,examName:req.body.examName,session:req.body.session},function(err,docs){
        console.log(docs)
        if(docs.length>=1){
    
            res.redirect('/upload/fail')
        }
        else{
            code= req.body.subjectCode.toUpperCase();
            console.log(code)
            var name = req.body.subjectName+"("+code+")";
            const pdf = new PDF({
                name:name,
                subjectCode:code,
                semester:req.body.semester,
                stream:req.body.stream,
                session:req.body.session,
                examName:req.body.examName
            });
            pdf.save();
             let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/Public/pdf/' + sampleFile.name;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);

      res.redirect('/upload/sucess');
    });

        }
    })
    console.log(req.body);
   
  });

app.get("/upload/:result",function(req,res){
    result= req.params.result;
    if(result=="sucess"){
        var head ="Yeah !"
        var para = "Your File is Uploaded Thankyou for Uploading"
    }else{
        var head = "Oops!!"
        var para ="There is another file with same details Please Check the site and try again."
    }
    res.render('jumbotron',{head:head,resultString:para})
});
app.get('/already',function(req,res){

});
app.listen(process.env.PORT || 3000,function(){
 
    console.log("server started at port 3000");
});