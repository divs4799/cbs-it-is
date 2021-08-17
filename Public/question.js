let semester;
let stream;
for(i=0;i<10;i++){
document.getElementById("btn" + i ).addEventListener("click",function(){
            semester=this.innerHTML;

            document.getElementById("sem-cont").style.left="0";
            setTimeout(() => {
                document.getElementsByClassName("stream-cont")[0].style.visibility="visible";
                document.getElementsByClassName("stream-cont")[0].classList.add("animate");
            },1500);



});
}
for(i=0;i<4;i++){
document.getElementsByClassName("stream-btn")[i].addEventListener("click",function(){
    stream = this.innerHTML;
    semester= semester.toLowerCase();
   semester= semester.replace(/ /g, "");
    
    stream = stream.toLowerCase();
    url = "/question/"+ semester+"/"+stream;

    window.location.href =url;
    
    
});
}