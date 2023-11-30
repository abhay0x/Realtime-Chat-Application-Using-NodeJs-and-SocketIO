const express =require('express');
const path=require('path');
const app=express();

const port=process.env.PORT ||80;
const server=app.listen(port,()=>{
    console.log(`sever is listening on port ${port}`)
})
const io=require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')))

let socketconnected=new Set();
io.on('connection',onconnected)

function onconnected(socket){
    console.log(socket.id);
    socketconnected.add(socket.id);

     io.emit('clients-total',socketconnected.size)


    socket.on('disconnect',()=>{
     console.log("socket disconnected",socket.id);
     socketconnected.delete(socket.id);
     io.emit('clients-total',socketconnected.size)
    }) 

    socket.on('message',(data)=>{
        console.log(data) 
        socket.broadcast.emit('chat-message',data);
    })
    socket.on('feedback',(data)=>{
        console.log(data) 
        socket.broadcast.emit('feedback',data);
    })
}  

  