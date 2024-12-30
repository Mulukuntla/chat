

async function sendMessage(event){
    event.preventDefault()
    const message=event.target.message.value
    const token=localStorage.getItem("token")
    const user=parseJwt(token)
    console.log(message)
    console.log(token)
    const obj={
        name:user.name,
        message:message
    }
    const response=await axios.post("http://51.20.172.55:4008/messages/sendMessage",obj,{headers :{"Authorization" :token}}) 
    const updatedMessage=response.data.message
    console.log(updatedMessage)
    console.log(user.name)
    document.getElementById("message").value=""
    
   

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
} 

function updatedsendMessage(name,message){
    const a=document.getElementById("chats")
    const b=`<div class="message">${name}:${message}</div>`
    a.innerHTML=a.innerHTML+b

}






document.addEventListener('DOMContentLoaded',function () {
    //setInterval(allMessages,1000)
    allMessages()
    async function allMessages(){
        try{
            const a=document.getElementById("chats")
            a.innerHTML=""
            const token=localStorage.getItem("token")
            var getAllMessages=localStorage.getItem("messages")
            console.log(getAllMessages)
            if(getAllMessages==null || JSON.parse(getAllMessages).length==0){
                getAllMessages=[]
                var messageee=-1
                localStorage.setItem("messages",[])
            }
            else{
                getAllMessages=JSON.parse(getAllMessages)
                console.log(getAllMessages.length)
                var messageee=getAllMessages[getAllMessages.length-1].id
                console.log(messageee)
            }
            
            

            const response=await axios.get(`http://51.20.172.55:4008/messages/allMessages/${messageee}`,{headers :{"Authorization" :token}}) 
            response.data.allMessages.forEach(element => {

                //updatedsendMessage(element.userName,element.message)
                getAllMessages.push({id:element.id,userId:element.userId,userName:element.userName,message:element.message})
            });
            console.log(response.data.allMessages)
            
            
            if(getAllMessages.length>10){
                getAllMessages=getAllMessages.slice(-10)
            }
            getAllMessages=JSON.stringify(getAllMessages)
            localStorage.setItem("messages",getAllMessages)
            const updatedMessages=localStorage.getItem("messages")
            JSON.parse(updatedMessages).forEach(element => {
                updatedsendMessage(element.userName,element.message)
            });
            
        }
        catch(error){
            console.log(error)
        }

    }
    
    
    
})



async function initial(){
    const token=localStorage.getItem("token")
    const user=parseJwt(token)
    const obj={
        name:user.name,
        message:"is joined"
    }
    const ress=await axios.post("http://51.20.172.55:4008/messages/sendMessage",obj,{headers :{"Authorization" :token}}) 
    console.log(ress)
    updatedsendMessage(user.name,ress.data.message)
}