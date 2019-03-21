//this schema is for VOTERS
var mongoose=require('mongoose');
module.exports = mongoose.model('users',
{
    firstName:{type: String, unique: true, required: true},
    lastName:String,
    email:{type: String, unique: true, required: true},
    phoneNumber:{type: Number, required: true},
    voterId:{type: String, unique: true, required: true},
    password:String,
    constituency:String,
    party:String,
    isCandid:String,
})

// <!--     
//     <script>
//         var i=0;
//         var count=<%=JSON.stringify(candidate.length)%>;
//         console.log("The number of candidates :",count);
//         for(var i=0;i<count;i++){
//             <%=JSON.stringify(candidate[i].firstName)%>
//             h1=document.createElement('h1');
//             document.body.appendChild(h1);
//             document.getElementsByTagName('h1').innerHTML=

//         }


        
//     </script> -->