

async function sendMessage(event){
    event.preventDefault()
    const message=event.target.message.value
    const token=localStorage.getItem("token")
    const groupId=localStorage.getItem("groupId")
    const user=parseJwt(token)
    console.log(message)
    console.log(token)
    const obj={
        name:user.name,
        message:message,
    }
    const response=await axios.post(`http://51.20.172.55:4008/messages/sendMessage/${groupId}`,obj,{headers :{"Authorization" :token}}) 
    const updatedMessage=response.data.message.message
    console.log(updatedMessage)
    console.log(user.name)
    updatedsendMessage(user.name,updatedMessage)
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
           // const group=localStorage.getItem("group")
            const token=localStorage.getItem("token")
            const response=await axios.get(`http://51.20.172.55:4008/group/allgroups`,{headers :{"Authorization" :token}}) 
            console.log(response)
            response.data.groups.forEach(element => {
                
                groups(element)
                
            });
            const groupId=localStorage.getItem("groupId")
            
            const responsee=await axios.get(`http://51.20.172.55:4008/messages/allMessages/${groupId}`,{headers :{"Authorization" :token}}) 
            const a=document.getElementById("chats")
            a.innerHTML=""
            responsee.data.allMessages.forEach(element => {
                updatedsendMessage(element.userName,element.message)
                
            });
        }
        catch(err){

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













async function groupAdded(event){
    try{
        event.preventDefault()
        const groupName=event.target.groupName.value
        console.log(groupName)
        const obj={
            group:groupName
        }
        const token=localStorage.getItem("token")
        const ress=await axios.post("http://51.20.172.55:4008/group/addgroup",obj,{headers :{"Authorization" :token}}) 
        
        const groups=document.getElementById("groups")
        const addGroup=`
        <li class="group-item" id="${ress.data.groupId}">${ress.data.groupName}</li>
        `
        groups.innerHTML=groups.innerHTML+addGroup
        document.getElementById("addGroup").value=""
        
        
    }
    catch(err){
        console.log(err)
    }
    
    
}

function groups(element){
    console.log(element)
    
    const groups=document.getElementById("groups")
    const li = document.createElement("li");
    li.className = "group-item"; 
    li.id = groupId; 
    li.textContent = groupName; 
    li.addEventListener("click", () => getChat(groupId, groupName));
    groups.appendChild(li);
    const button=document.createElement("button")
    button.id=groupId;
    button.textContent = invite; 
    button.addEventListener("click", () => getGroup(groupId, groupName));
    groups.appendChild(button);

}

async function getChat(groupId,groupName){
    const token=localStorage.getItem("token")
    const response=await axios.get(`http://51.20.172.55:4008/messages/allMessages/${groupId}`,{headers :{"Authorization" :token}}) 
    const a=document.getElementById("chats")
    a.innerHTML=""
    if(response.data.allMessages.length ===0){
        a.innerHTML=`
        <a>Start Messaging</a>
        `
    }
    console.log(response)
    response.data.allMessages.forEach(element => {
        updatedsendMessage(element.userName,element.message)
    });
    
    localStorage.setItem("groupId",groupId)
    


}




function getGroup(){
    console.log("Hi")
}