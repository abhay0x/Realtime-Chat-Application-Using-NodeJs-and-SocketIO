const socket=io();

const clientstotal=document.getElementById('client-total');
const messagecontainer=document.getElementById('message-container');
const nameinput=document.getElementById('name-input')
const messageform=document.getElementById('message-form');
const messageinput=document.getElementById('message-input');

const tone=new Audio('/ting_iphone.mp3')

socket.on('clients-total',(data)=>{
   clientstotal.innerText=`Total-Clients:${data}`
})
messageform.addEventListener('submit',(e)=>{
  e.preventDefault();
  sendmessage();
})
function sendmessage(){
    console.log(messageinput.value)
    const d=new Date();
   
    const data={
      name:nameinput.value,
      message:messageinput.value,
      dateTime:d.toLocaleTimeString(),
    }
    socket.emit('message',data);
    addmessagetoui(true,data);
    messageinput.value=''
}  
  
socket.on('chat-message',(data)=>{
tone.play()
addmessagetoui(false,data);
})
 

function addmessagetoui(isownmessage,data){
  clearfeedback()
  const element =`<li class="${isownmessage ? "message-right" : "message-left"}">
  <p class="message">
      ${data.message};  
  </p>
  <span>${data.name} ▪️${data.dateTime} </span>
</li>`

messagecontainer.innerHTML += element;
}  


     
messageinput.addEventListener('keypress',(e)=>{
  socket.emit('feedback',{
   feedback:`${nameinput.value} is typing..`
  }) 
 })

 messageinput.addEventListener('blur',(e)=>{
  socket.emit('feedback',{ 
   feedback:""
  })
 })

 socket.on('feedback',(data)=>{
  clearfeedback()
  const element=`<li class="message-feedback">
  <p class="feedback" id="feedback">
      ${data.feedback}
  </p>
</li>`

messagecontainer.innerHTML+=element;
 })

 function clearfeedback(){
  document.querySelectorAll('li.message-feedback').forEach(element=>{
    element.parentNode.removeChild(element)
  })
 }