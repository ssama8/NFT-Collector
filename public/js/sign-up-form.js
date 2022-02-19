const container = document.querySelector('.background');
const signinForm = document.querySelector('.sign-up');
const createAccount = document.getElementById('btn');
const userNameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const profileGallery = document.querySelector('.profile-icon-container');
const togglePassword = document.querySelectorAll('.eye');
profileGallery.style.display = "none";


let username,
  newpassword;


togglePassword.forEach((eye)=>{
  eye.addEventListener("click", togglePasswordVisibility)
})

createAccount.addEventListener('click', addUser)
container.addEventListener('click', pickIcon);
container.addEventListener('click', sendPostRequest)
let userDetails = [];

function pickIcon(e){

  if(e.target.classList.contains('profile-option')){
    const previousSelection = document.querySelector('.selected-profile');
  
    if(previousSelection){
      previousSelection.classList.remove('selected-profile');
     
    }else{
      if(e.target.classList.contains('selected-profile')){
        console.log('firing');
        e.target.classList.remove('selected-profile');
        console.log(e.target.classList);
      }else{
        e.target.classList.add('selected-profile')
      }
     

    }
   
  }
  
}

function togglePasswordVisibility(e){
  if(e.target.id === "create"){
    toggleSpecifiedInput(passwordInput, "slash-password")
  }else{
    toggleSpecifiedInput(confirmInput, "slash-confirm");
  }
  
}
function toggleSpecifiedInput(input, strikethrough){
  if(input.value.length >0){
    console.log('toggle');
    console.log(input.type);
    const slash = document.querySelector(`#${strikethrough}`);
    const type = input.type;
    if(type === "password"){
      input.type = "text"
      slash.style.display = "block";
    }else{
      input.type = "password"
      slash.style.display = "none";
  
    }
  }


}
let taken;

function addUser(e){
  console.log(e.target);
  e.preventDefault();
  const userName = userNameInput.value
  const password = passwordInput.value
  const confirmPassword = confirmInput.value
  console.log(userName, password, confirmPassword);
  if(userName != '' && password != '' && confirmPassword != ''){

    const parameters = [userName, password, confirmPassword]
  const checkExisting = getRequest()
  .then(users=> {
    users.map((user)=>{
      if(user.username === userName){
        console.log('this username is already taken')
        taken = true;
        let message = `${userName} is already taken please make another one`;
        createErrorMessage(message);
      }
    })
      console.log(taken);
      if(taken){
        return
      }else{
        const containsNum = /\d/;
        const testingUsername = containsNum.test(userName);
        console.log(testingUsername);
        if(testingUsername){
          if(userName.length >=6){
            username = userName
            checkIfPasswordsMatch(password, confirmPassword )

          }else{
            createErrorMessage("Username must be atleast 6 characters")
          }
        }else{
          const message = "Username Must Have Atleast one number"
          createErrorMessage(message);
        }
        // checkIfPasswordsMatch(password, confirmPassword )
      }
      
  }
  
  );
  console.log(checkExisting);
    


  }else{
    let message = "Please Fill Out All Fields"
    createErrorMessage(message)
  }

}

function createErrorMessage(mesg){
  const previousMessage = document.querySelector('.alert-message');
   if(previousMessage!== null) return
  const usernameLabel = document.getElementById('username-label')
  const div = document.createElement('div');
  const message = document.createTextNode(mesg)
  div.classList.add('alert-message')
  div.appendChild(message);
  signinForm.insertBefore(div, usernameLabel)
  setTimeout(removeErrorMessage, 2000, div)
 
}

function removeErrorMessage(div){
  div.remove();
}
const passwordSrength = document.querySelector('.password-strength');
//passwordSrength.style.display = "none";
//asswordInput.addEventListener('input', checkStrength);


function checkIfPasswordsMatch(password, passwordConfirmation){
  if(password!== passwordConfirmation){
    let message = "Passwords don't match"
    console.log(message)
    createErrorMessage(message)
  }else{
    // userDetails.push(accountInfo)
    const containsNum = /\d/;
    const valid = containsNum.test(password);
    if(valid){
      if(password.length< 8){
        createErrorMessage("password must have atleast eight characters")

      }else {
        console.log("success")
        newpassword = password
        signinForm.style.display = "none";
        populateGallery();
      }

    }
    else{
      createErrorMessage("password must have atleast one number")

    }
   

  }
}

// function checkStrength(e){
//   passwordSrength.style.display = "block";
// }
// const defaultDisplay = function(e){
//   passwordSrength.style.display = "none";
  
// }

//passwordInput.addEventListener('blur', defaultDisplay);



function sendPostRequest(e){
  const selection = document.querySelector('.selected-profile');
  if(e.target.id === 'finish-sign-up'&& selection){
    
    postUser(selection.src)

    console.log("send post request");
    console.log(window.location.href);
    window.location.href = "index.html"
  }
}

 async function postUser(image){
  console.log(username); console.log(newpassword);
  const rawResponse =  await fetch('http://localhost:5000/users', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: username, password: newpassword, profilePic : image})
  })


  

}
async function getRequest(){
  const request = await fetch('http://localhost:5000/users')
  .then(data=> data.json())
 // .then(data=> console.log(data));

  return request
}
//const signinFOrm 

async function populateGallery(){
  const gallery = document.querySelector('.gallery-container')
  const getPictures = fetch('http://localhost:5000/users/pics')
  .then(data=>data.json())
  .then(data => {
    console.log(data)
    
    const pics = data;
    pics.map((pic)=>{
      const div = document.createElement('div');
      div.classList.add('profile-icon')
      const img = document.createElement('img');
      img.classList.add('profile-option')
      img.src = pic.src;
      div.appendChild(img);
      gallery.appendChild(div);

    })
    profileGallery.style.display = "flex";

  }
    )
}
//populateGallery();