let userLoginButton=document.getElementById('userLoginButton');
let trainerLoginButton=document.getElementById("trainerLoginButton");

let userForm=document.getElementById('userForm');
let trainerForm=document.getElementById('trainerForm');

userLoginButton.addEventListener('click',()=>{
    userForm.classList.remove("hide");
    trainerForm.classList.add("hide");

    userLoginButton.classList.add("btn-primary");
    userLoginButton.classList.remove("btn-secondary");

    trainerLoginButton.classList.add("btn-secondary");
    trainerLoginButton.classList.remove("btn-primary");
});

trainerLoginButton.addEventListener('click',()=>{
    trainerForm.classList.remove("hide");
    userForm.classList.add("hide");

    trainerLoginButton.classList.add("btn-primary");
    trainerLoginButton.classList.remove("btn-secondary");

    userLoginButton.classList.add("btn-secondary");
    userLoginButton.classList.remove("btn-primary");
});