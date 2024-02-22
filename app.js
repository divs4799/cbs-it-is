const express = require('express');
// pdfdata12345
const app = express();
const bodyParser= require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose'); 
const fileUpload = require('express-fileupload');
var cloudinary = require('cloudinary').v2;
var uri = "mongodb+srv://pdfData:pdfdata12345@pdf-cluster.obw3a.mongodb.net/newPdfDB";
// 'mongodb+srv://admin-pdfData:pdfdata12345@pdf-cluster.obw3a.mongodb.net/newPdfDB'
mongoose.connect(uri).then((result)=>{console.log("DB Connected")}).catch((error)=>{console.log("Error in connection to DB: ",error)});
// mongoose.connect('mongodb://localhost:27017/pdfDB', {useNewUrlParser: true,useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload({useTempFiles:true}));
cloudinary.config({ 
    cloud_name: 'cbsitis', 
    api_key: '512518989829881', 
    api_secret: 'nsfjnRBbi_xLelYeaoRWgkE027A',
    secure: true
  });

const pdfSchema = new mongoose.Schema({
    name: String,
    subjectCode:String,
    semester:{type:String,required: true},
    stream: {type:String,required: true},
    session : Number,
    examName: String,
    all:Boolean,
    url:"string"
     
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
    code= req.body.subjectCode.toUpperCase();

    PDF.find({subjectCode:code,examName:req.body.examName,session:req.body.session},function(err,docs){
        if(docs.length>=1){
            res.redirect('/upload/already')
        }
        else{
            var name = req.body.subjectName+"("+code+")"+ req.body.session +" "+ req.body.examName;
            let file = req.files.sampleFile;
            
            cloudinary.uploader.upload(file.tempFilePath,{public_id:name,folder:"PDF/"+req.body.session+"/"+req.body.examName},(err,result)=>{
                if(err != undefined){
                    res.redirect('/upload/fail');    
                    console.log(err)
                }
                
                const pdf = new PDF({
                    name:name,
                    subjectCode:code,
                    semester:req.body.semester,
                    stream:req.body.stream,
                    session:req.body.session,
                    examName:req.body.examName,
                    url:result.url
                });
                pdf.save();
                
            })

      res.redirect('/upload/sucess');
    

        }
    })
   
  });

app.get("/upload/:result",function(req,res){
    result= req.params.result;
    if(result=="sucess"){
        var head ="Yeah !"
        var para = "Your File is Uploaded Thankyou for Uploading"
    }else if(result=="already"){
        var head= "Oops!!";
        var para = "There is another file with same details Please Check the site and try again."
    }
    else{
        var head = "Oops!!"
        var para ="There was some error while uploading please try again! or contact Support"
    }
    res.render('jumbotron',{head:head,resultString:para})
});
app.get('/already',function(req,res){

});
app.listen(process.env.PORT || 3000,function(){
 
    console.log("server started at port 3000");
});