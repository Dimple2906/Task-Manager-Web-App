
const signup=(event)=>{
    event.preventDefault();
let name=document.getElementById("fname").value.trim();
let email=document.getElementById("email").value.trim();;
let pass=document.getElementById('pass').value.trim();;
if(!name||!email||!pass){
    alert("All the fields are required");
    return;
}
let users=JSON.parse(localStorage.getItem("users"))||[];
let exists=users.some(user=>user.email===email);
if(exists){
    alert("This Email-ID is already registered");
    return;
}
let newuser={
    id:Date.now(),
    name:name,
    email:email,
    pass:pass
}
users.push(newuser);
localStorage.setItem('users',JSON.stringify(users));
alert("SignUp Successfully");
window.location.href="login.html";
}
