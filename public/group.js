const socket = io('http://51.20.172.55:4008');
socket.on("connect",()=>{
    console.log(socket.id)
})
var numbers;
async function sendMessages(event){
    try{
        event.preventDefault()
        const message=event.target.message.value
        const token=localStorage.getItem("token")
        const groupId=localStorage.getItem("groupId")
        console.log(groupId)
        if(groupId ==null){
            return alert("add Groups")
        }
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
        
        //socket.emit("sendMessage",message)
        socket.on("receiveMessage",message =>{
            updatedsendMessage(user.name,updatedMessage)
            if(message=="http://51.20.172.55:4008/group/allgroups/invite"){
                updateSendMessageLink()
            }
            console.log(message)
            
        })
        document.getElementById("message").value=""

    }
    catch(err){
        console.log(err)
    }
   

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
} 

function updatedsendMessage(name,message,fileUrl){
    const a = document.getElementById("chats");
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
   
    
    if (message.includes("http://51.20.172.55:4008/group/allgroups/invite")) {
        // Generate message with a clickable link
        numbers=numbers+1
         // Append the new message to the chat
        if(fileUrl!=undefined){
            b = `<div class="message">
           <img src="${fileUrl}" width="150" height="150"></img><br>
           ${name}:<a href="#" id="${numbers}a">${message}</a>
           </div>`;
           a.innerHTML=a.innerHTML+b
            
           

        }
        else{
            b = `<div class="message">
            ${name}:<a href="#" id="${numbers}a">${message}</a>
            </div>`;
            a.innerHTML=a.innerHTML+b

        }
       
 

        // Add an event listener to the link
    } 
    else if(message.includes("http")){
        if(fileUrl!=undefined){
            b = `<div class="message">
            <img src="${fileUrl}" width="150" height="150"></img><br>
            ${name}:<a href="${message}">${message}</a>
            </div>`
            a.innerHTML=a.innerHTML+b // Append the new message to the chat

        }
        else{
            b = `<div class="message">
            ${name}:<a href="${message}">${message}</a>
            </div>`
            a.innerHTML=a.innerHTML+b // Append the new message to the chat

        }
     
    }
    else {
        // Generate a normal message
        if(fileUrl!=undefined){
            console.log("Hi")
            b = `<div class="message">
            <img src="${fileUrl}" width="150" height="150"></img><br>
            ${name}: ${message}
            </div>`;
            a.innerHTML += b;

        }
        else{
            console.log("Hi")
            b = `<div class="message">
            ${name}: ${message}
            </div>`;
            a.innerHTML += b;

        }
      
    }
    

}
document.addEventListener('DOMContentLoaded',async function () {
    //setInterval(allMessages,1000)
    localStorage.removeItem('groupId');
    const token=localStorage.getItem("token")
    const response=await axios.get(`http://51.20.172.55:4008/group/allgroups`,{headers :{"Authorization" :token}}) 
    console.log(response)
    const element=response.data.groups
    groups(element)
    
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
        console.log(ress)
        const groups=document.getElementById("groups")
        const groupItem = document.createElement("li");
        groupItem.className ="group-item";
        groupItem.textContent = ress.data.groupName
        groupItem.id = ress.data.groupId;  // Display the group name
        groupItem.addEventListener("click", () => getChat(ress.data.groupId,ress.data.inviteLink));
        groups.appendChild(groupItem);
        
        
        document.getElementById("addGroup").value=""
    }catch(err){
        console.log(err)
    }
}











function groups(element){
    console.log(element)
    
    const groups=document.getElementById("groups")
    groups.innerHTML=""
    element.forEach(group => {
        const groupItem = document.createElement("li");
        console.log(group.group.groupName)
        groupItem.className ="group-item";
        groupItem.textContent = group.group.groupName;
        groupItem.id = group.group.id;  // Display the group name
        groupItem.addEventListener("click", () => getChat(group.group.id,group.group.inviteLink));
        groups.appendChild(groupItem);
       
      });

}

async function getChat(groupId,inviteLink){
    console.log(inviteLink)
    const search=document.getElementById("addMembersToGroup")
    search.innerHTML=""
    
    console.log(search)
    const token=localStorage.getItem("token")
    const response=await axios.get(`http://51.20.172.55:4008/messages/allMessages/${groupId}`,{headers :{"Authorization" :token}}) 
    console.log(response)
    if(response.data.userAdmin==true){
        const searchInput=`<input type="text" id="addMembersToTheGroup"></input>addMembersToTheGroup`
        search.innerHTML=searchInput
        inputt()
    }
    const a=document.getElementById("chats")
    a.innerHTML=""
    if(response.data.allMessages.length ===0){
        a.innerHTML=`
        <a>Start Messaging</a>
        `
    }
    console.log(response)
    numbers=0
    response.data.allMessages.forEach(element => {
        updatedsendMessage(element.userName,element.message,element.fileUrl)
    });
    console.log(numbers)
    for(let i=1;i<= numbers;i++){
        const link = document.getElementById(`${i}a`);
        console.log(link)
        const messagee=link.textContent
        console.log(messagee)
        link.addEventListener("click", function (event) {
            console.log("Link clicked");
            event.preventDefault(); // Prevent default link behavior
            addMembersInGroup(messagee); // Call the function with the message
        });

    }
    
    localStorage.setItem("groupId",groupId)
    localStorage.setItem("inviteLink",inviteLink)
    const groupInvite=document.getElementById("group-invite")
    const b=`
        <p>Invite Link: <a href="http://51.20.172.55:4008/group/allgroups/invite/${inviteLink}" >http://51.20.172.55:4008/group/allgroups/invite/${inviteLink}</a></p>
    `
    groupInvite.innerHTML=b
    

}

async function addMembersInGroup(message){
    try{
        console.log("Hi")
        const token=localStorage.getItem("token")
        console.log(message)
        const response=await axios.get(message,{headers :{"Authorization" :token}}) 
        console.log(response)
        if(response.data.messagess ="User added to the group"){
            console.log("Hi")
            allMessages()
        }
        else{
            console.log("Hii")
            
        }
        

    }
   catch(err){
    console.log(err)
   }
    
}
async function allMessages(){
    try{ 
        const group=localStorage.getItem("group")
        const token=localStorage.getItem("token")
        const response=await axios.get(`http://51.20.172.55:4008/group/allgroups`,{headers :{"Authorization" :token}}) 
        console.log(response)
        const element=response.data.groups
        groups(element)
    
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

function linkss(links,message){
    console.log(links)
    links.addEventListener("click", function (event) {
        console.log("Hi")
        event.preventDefault(); // Optional: prevent default link behavior
        console.log("Hi")
        addMembersInGroup(message)
    });
}




function updateSendMessageLink(){
    const link = document.getElementById(`${numbers}a`);
    console.log(link)
    const messagee=link.textContent
    console.log(messagee)
    link.addEventListener("click", function (event) {
        console.log("Link clicked");
        event.preventDefault(); // Prevent default link behavior
        addMembersInGroup(messagee); // Call the function with the message
    });

}

async function members(){
    console.log("Hi")
    const groupId=localStorage.getItem("groupId")
    const token=localStorage.getItem("token")
    const response=await axios.get(`http://51.20.172.55:4008/members/allmembers/${groupId}`,{headers :{"Authorization" :token}}) 
    const a=document.getElementById("chats")
    a.innerHTML=""
    console.log(response.data)
    const b="<a>Members of the group</a>"
    a.innerHTML=a.innerHTML+b
    const admin="admin"
    const mySet = new Set();
    response.data.admin.forEach(element => {
        console.log(element.userName,element.phoneNumber,element.userId,element.groupId)
        mySet.add(element.userId)

        updateMembers(element.userName,element.phoneNumber,element.userId,element.groupId,admin,response.data.userAdmin)
    });
    console.log(mySet) 
    const members="members"
    response.data.usergroup.forEach(element => {
        if(!mySet.has(element.userId)){
            updateMembers(element.userName,element.phoneNumber,element.userId,element.groupId,members,response.data.userAdmin)

        }
    });
    
    }


function updateMembers(userName,phoneNumber,userId,groupId,aa,userAdmin){
    console.log(userAdmin)
    
    const a = document.getElementById("chats");
    const div = document.createElement("div");
    div.className = "message";
    const b = document.createElement("a");
    if(aa=="admin"){
        b.textContent = `${userName} (${phoneNumber})(admin)`;
        div.appendChild(b);
        if(userAdmin==true){
            const button = document.createElement("button");
            button.textContent = "notAnAdmin"; 
            button.onclick = function () {
                removeAsAdmin(userName,phoneNumber,userId,groupId); 
            };
            div.appendChild(button);

        }
        a.appendChild(div);
    }
    else{
        b.textContent = `${userName} (${phoneNumber})(member)`;
        div.appendChild(b);
        if(userAdmin ==true){
            const button = document.createElement("button");
            button.textContent = "makeAnAdmin"; 
            button.onclick = function () {
                updateAdminMember(userName,phoneNumber,userId,groupId); 
            };
            div.appendChild(button);
            const buttons = document.createElement("button");
            buttons.textContent = "removeUserFromGroup"; 
            buttons.onclick = function () {
            removeUserFromGroup(userName,phoneNumber,userId,groupId); 
            };
            div.appendChild(buttons);

        }
        a.appendChild(div); 

    }
    
        
   }
function seeChat(){
    const groupId=localStorage.getItem("groupId")
    const inviteLink=localStorage.getItem("inviteLink")
    getChat(groupId,inviteLink)


}


async function updateAdminMember(userName,phoneNumber,userId,groupId){
    console.log("Hi")
    console.log(userName)
    const obj={
        userName:userName,
        phoneNumber:phoneNumber,
        userId:userId,
        groupId:groupId,
    }
    console.log(groupId)
    const token=localStorage.getItem("token")
    const response=await axios.post(`http://51.20.172.55:4008/members/addAdmin`,obj,{headers :{"Authorization" :token}}) 
    console.log(response)
    console.log(response.data.message)
    if(response.data.message=="this user is an admin now"){
        members()
    }
}
async function removeAsAdmin(userName,phoneNumber,userId,groupId){
    console.log("Hi")
    console.log(userName)
    const obj={
        userName:userName,
        phoneNumber:phoneNumber,
        userId:userId,
        groupId:groupId,
    }
    const token=localStorage.getItem("token")
    const response=await axios.post(`http://51.20.172.55:4008/members/removeAsAdmin`,obj,{headers :{"Authorization" :token}}) 
    console.log(response)
    if(response.data.message=="not an admin now"){
        console.log("Hi")
        members()
    }}

function inputt(){
    const inputField = document.getElementById('addMembersToTheGroup');
    if(inputField!==null){
    inputField.addEventListener('keyup', async (event) => {
        const inputt=inputField.value
        console.log(inputt)
        const a=document.getElementById("chats")
        a.innerHTML=""
        console.log(inputt.value)
        const groupId=localStorage.getItem("groupId")
        const obj={
            input:inputt,
            groupId:groupId
        }
        
        console.log(groupId)
        const token=localStorage.getItem("token")
        const response=await axios.post(`http://51.20.172.55:4008/members/searchMembersToGroup`,obj,{headers :{"Authorization" :token}}) 
        console.log(response)
        response.data.users.forEach(element => {
            showUsersToAdd(element.userName,element.phoneNumber,element.id,groupId)
    
            
        });
        
    });
    

}

}

            

function showUsersToAdd(userName,phoneNumber,userId,groupId){
    const a = document.getElementById("chats");
    const div = document.createElement("div");
    div.id=`${userId}showUsersToAdd`
    div.className = "message";
    const b = document.createElement("a");
    b.textContent = `${userName} (${phoneNumber})`;
    div.appendChild(b);
    const button = document.createElement("button");
    button.textContent = "AddToGroup"; 
    button.onclick = function () {
        console.log("Hi")
        addToGroup(userName,phoneNumber,userId,groupId); 
    };
    div.appendChild(button);
    a.appendChild(div);

}

async function addToGroup(userName,phoneNumber,userId,groupId){
    try{
        console.log("Hi")
        const token=localStorage.getItem("token")
        console.log(userName,phoneNumber,userId,groupId)
        const obj={
            userName:userName,
            phoneNumber:phoneNumber,
            userId:userId,
            groupId:groupId
        }
        console.log("Hi")
        const response=await axios.post(`http://51.20.172.55:4008/members/addMembersToGroup`,obj,{headers :{"Authorization" :token}}) 
       
       
       
       
       
        console.log(response)
        if(response.data.message=="user added to the group"){
            const div=document.getElementById(`${userId}showUsersToAdd`)
            div.innerHTML=""
            const b = document.createElement("a");
            b.textContent = `${userName} (${phoneNumber}):userAddedToTheGroup`;
            div.appendChild(b);
            
            console.log(div)
            
        }
        
        console.log("Hi")

    }
    catch(err){
        console.log(err)
    }
    

}



async function removeUserFromGroup(userName,phoneNumber,userId,groupId){
    console.log("Hi")
        const token=localStorage.getItem("token")
        console.log(userName,phoneNumber,userId,groupId)
        const obj={
            userName:userName,
            phoneNumber:phoneNumber,
            userId:userId,
            groupId:groupId
        }
        console.log("Hi")
        const response=await axios.post(`http://51.20.172.55:4008/members/removeMembersToGroup`,obj,{headers :{"Authorization" :token}}) 
        console.log(response)
        if(response.data.message=="not a member"){
            members()
            
        }
        console.log("Hi")
    }


async function sendMessage(event){
    event.preventDefault();
    const messageInput = document.getElementById("message");
    const fileInput = document.getElementById("fileInput");
    const token=localStorage.getItem("token")
    const user=parseJwt(token)
    const formData = new FormData();
    formData.append("message", messageInput.value); // Text message
    formData.append("name",user.name);
    console.log(formData)
    if (fileInput.files[0]) {
        formData.append("file", fileInput.files[0]); // Attach the file if selected
    }
    formData.forEach((value, key) => {
        console.log(`${key}:`, value);
    });
    console.log(formData)
    const groupId=localStorage.getItem("groupId")
    const response = await axios.post(`http://51.20.172.55:4008/messages/sendMessage/${groupId}`, formData, {
        headers: {
            "Authorization" :token,
            "Content-Type": "multipart/form-data",
        },
    });
    console.log(response.data)
    const name=response.data.message.userName
    const message=response.data.message.message
    const fileUrl=response.data.message.fileUrl
    console.log(name,message,fileUrl)
    socket.emit("sendMessage",message,fileUrl)
    socket.on("receiveMessage",(message,fileUrl) =>{
        updatedsendMessage(name,message,fileUrl)
        if(message=="http://51.20.172.55:4008/group/allgroups/invite"){
            updateSendMessageLink()
        }
        console.log(message)
        
    })
}















