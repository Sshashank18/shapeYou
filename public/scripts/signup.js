let userSignupButton = document.getElementById('userSignupButton');
let trainerSignupButton = document.getElementById('trainerSignupButton');

let userForm = document.getElementById('userForm');
let trainerForm = document.getElementById('trainerForm');

userSignupButton.addEventListener("click", () => {
    userForm.classList.remove("hide");
    trainerForm.classList.add("hide");

    userSignupButton.classList.add("btn-primary");
    userSignupButton.classList.remove("btn-secondary");

    trainerSignupButton.classList.add("btn-secondary");
    trainerSignupButton.classList.remove("btn-primary");
});

trainerSignupButton.addEventListener("click", () => {
    trainerForm.classList.remove("hide");
    userForm.classList.add("hide");

    trainerSignupButton.classList.add("btn-primary");
    trainerSignupButton.classList.remove("btn-secondary");

    userSignupButton.classList.add("btn-secondary");
    userSignupButton.classList.remove("btn-primary");
});


// $('#userSignupFormButton').click(event=>{
//     event.preventDefault();

//     $.post('/user/checkCredentials',{
//         email:$('#userEmail').val()
//     })
//     .then(res=>{
//         if(res=="Exist")
//             $('#userSignupError')[0].removeAttribute("hidden");
//         else
//         {
//             if(userForm[0].checkValidity())
//                 userForm.submit();
//             else
//                 alert('Fill All Fields Please');
//         }
//     })
// });