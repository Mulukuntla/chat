async function signin(event){
    try{
        event.preventDefault()
        
        const email=event.target.email.value
        const password=event.target.password.value
        const obj={
        email:email,
        password:password
        }
        console.log(obj)
        const response=await axios.post("http://51.20.172.55:4008/user/signin",obj)
        localStorage.setItem("token",response.data.token)
        console.log(response)
        window.location.href = "./group.html";
        

       
    }
   catch(err){
    console.log(err)
   
   }
      
  
}