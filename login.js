const login=(event)=>{
    event.preventDefault();
    let email=document.getElementById('email').value.trim();
    let pass=document.getElementById('pass').value.trim();
    if(!email||!pass){
        alert("All fields are Required..!");
        return;
    }
    let users=JSON.parse(localStorage.getItem('users'))||[];
    let exist=users.find(user=>user.email===email && user.pass===pass);
    if(!exist){
        alert("Invalid Email or Password");
        return;}
    
    localStorage.setItem("currentUser",JSON.stringify(exist));
    alert("Login Successfully..!");
    window.location.href="dashboard.html";
};
