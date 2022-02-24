//container elements that hold other elements used for exent delegation 
const container = document.querySelector('.background');
const signinForm = document.querySelector('.sign-up');

//The different form input elements
const userNameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password')

//Button that sends post request to create the account 
const createAccount = document.getElementById('btn');

//The div that holds the profile image options which is inititally hidden 
const profileGallery = document.querySelector('.images-container');
profileGallery.style.display = "none";

//The eyes that can be clicked to toggle the password visibility 
const togglePassword = document.querySelectorAll('.toggle');

//Variables used later to send the post request 

let username,
  newpassword;


  //adding the togglePasswordVisibilty function on click for all of the elements with a class of toggle 
togglePassword.forEach((eye)=>{
  eye.addEventListener("click", togglePasswordVisibility)
})
//figures out which input needs to be toggles and calls the toggleSpeccifiedInput function with the specific input
function togglePasswordVisibility(e){
  if(e.target.id === "password-toggle" || e.target.id === "inner-password-toggle"){
    toggleSpecifiedInput(passwordInput, "slash-password")
  }else{
    toggleSpecifiedInput(confirmInput, "slash-confirm");
  }
  
}
function toggleSpecifiedInput(input, strikethrough){
  //Will only toggle if there is atleast one character in the input
  if(input.value.length >0){
    //gets the slash thats passed in 
    const slash = document.querySelector(`#${strikethrough}`);
    const type = input.type;
    //If the type is currently password or hidden, then change it to text and make it visible and vice versa. 
    if(type === "password"){
      input.type = "text"
      slash.style.display = "block";
    }else{
      input.type = "password"
      slash.style.display = "none";
    }
  }
}
//calls the calidateInputs function when the submit button is clicked
createAccount.addEventListener('click', validateInputs)

function validateInputs(e){
  e.preventDefault();
  //sets the userName, password, and comfirmPassword to the input value that matches
  const userName = userNameInput.value
  const password = passwordInput.value
  const confirmPassword = confirmInput.value
  //if all of the fields are filled out
  if(userName !== '' && password !== '' && confirmPassword !== ''){
    //calls the getRequest function with the username to see if it's already taken
  getRequest(userName)
  .then(userExists=>{
    //If the user exists than create error that the username can't be used. 
    if(userExists){createErrorMessage("Username has already been taken")}
    else{
      //checks if the username has atleast one number
      const containsNum = /\d/;
      const testingUsername = containsNum.test(userName);
      //runs if the username has atleast one number
      if(testingUsername){

        //the username now has a number so this tests if it's atleast six characters long
        if(userName.length >=6){
          //sets the global variable username to userName used later to make the post request
          username = userName
          //Once the username is valid this checks to see if the passwords are valid 
          checkIfPasswordValid(password, confirmPassword )
        }
        else{
          //creates error if the username isn't at least six characters long
          createErrorMessage("Username must be atleast 6 characters")
        }
      }
      //runs if the username doesn't have a number
      else{
        createErrorMessage( "Username Must Have Atleast one number");
      }
    }
  })
  }
  //if one or more of the fields are empty 
  else{
    createErrorMessage("Please Fill Out All Fields")
  }

}


async function getRequest(userName){
  const request = await fetch('http://localhost:5000/users')
  .then(data=> data.json())
  .then(users=>{
    let userExists;
    users.map((user)=>{
      if(user.username === userName){
       const message = `${userName} is already taken please make another one`;
        createErrorMessage(message);
        userExists = true
      }else{
        userExists = false
      }
    })
    return userExists

  })
 // .then(data=> console.log(data));

  return request
}




//Creates error Message
function createErrorMessage(mesg){

  const previousMessage = document.querySelector('.alert-message');
  //if there already is an errror message return 
   if(previousMessage!== null) return
  const usernameLabel = document.getElementById('username-label')
  const div = document.createElement('div');
  const message = document.createTextNode(mesg)
  div.classList.add('alert-message')
  div.appendChild(message);
  signinForm.insertBefore(div, usernameLabel)
  //remove the message after 2 seconds
  setTimeout(removeErrorMessage, 2000, div)
 
}

function removeErrorMessage(div){
  div.remove();
}





function checkIfPasswordValid(password, passwordConfirmation){
  //Checks if the password and confirm password match
  if(password!== passwordConfirmation){
    createErrorMessage("Passwords don't match")

  }else{
    //checks if the password has a number
    const containsNum = /\d/;
    const hasNum = containsNum.test(password);
    //if it has a number then check if it is atleast 8 characters long
    if(hasNum){
      if(password.length< 8){
        createErrorMessage("password must have atleast eight characters")

      }else {
        //sets the newpassword global variable to the password
        newpassword = password
        //changes state to display the profile images
        signinForm.style.display = "none";
        //Function that fills up the div with the possible profile images 
        populateGallery();
      }
    }
    else{
      createErrorMessage("password must have atleast one number")

    }
   

  }
}

async function populateGallery(){
  const gallery = document.querySelector('.gallery-container')
  const getPictures = fetch('http://localhost:5000/users/pics')
  .then(data=>data.json())
  .then(data => {
    const pics = data;
    //for every pic make a div and an image tag. set the images source to the url from the dat, and then 
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

container.addEventListener('click', pickIcon);


function pickIcon(e){
  //every image in the gallery has a class of profile-option
  if(e.target.classList.contains('profile-option')){
    const previousSelection = document.querySelector('.selected-profile');
  //If there is already something selected than remove the selection if clicked again
    if(previousSelection){
      previousSelection.classList.remove('selected-profile');     
    }else{
      //If the target has a class of selected profile then remove it
      if(e.target.classList.contains('selected-profile')){
        e.target.classList.remove('selected-profile');
      }else{
        //add the class of selected profile which creates a border around the image indicating that it is currently selected
        e.target.classList.add('selected-profile')
      }    
    } 
  }
}
container.addEventListener('click', sendPostRequest)


function sendPostRequest(e){
  const selection = document.querySelector('.selected-profile');
  //The set profile image button has the id of finish-sign-up. if there is a selected profile than call postuser with the images src passed in and then go back to the home page
  if(e.target.id === 'finish-sign-up'&& selection){
    postUser(selection.src)
    window.location.href = "index.html"
  }
}

 async function postUser(image){
  //sends post request 
  const rawResponse =  await fetch('http://localhost:5000/users', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    //username and newpassword passed in to the body as well as the source of the image selected 
    body: JSON.stringify({username: username, password: newpassword, profilePic : image})
  })

  

}
