async function signup(event){
    try{
        event.preventDefault()
        console.log("Hi")
        const name=event.target.name.value
        const email=event.target.email.value
        const phoneNumber=event.target.PhoneNumber.value
        const password=event.target.password.value
        const obj={
        name:name,
        email:email,
        phoneNumber:phoneNumber,
        password:password
        }
        console.log(obj)
        const response=await axios.post("http://51.20.172.55:4008/user/signup",obj)
        alert("Successfully signed up")
    }
   catch(err){
    console.log(err.response.data.message)
    if(err.response.data.message =="usage already exits"){
        alert("User already exists,Please Login")
    }
   }
      
  
}
    