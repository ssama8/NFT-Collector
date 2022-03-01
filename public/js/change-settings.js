
const container = document.querySelector('.change-account-settings')
const confirmation = document.querySelector('.confirmation')

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');


const profileImages = document.querySelector('.profile-icon-container');
const signinForm = document.querySelector('.change-details')

//gets what is being requested to change
const getState = new httpRequest('http://localhost:5000/users/change-request')
getState.getRequest()
.then(settings=>{
  //if user wants to change their profile image
  if(settings.profileImage){
  populateGallery();
    //shows the images after half a secons
    setTimeout(()=>{
      profileImages.style.display = "flex";
    }, 500)
    signinForm.style.display = "none";
  }else{
  //if user wants to change their password, defailt state

    const usernameLabel = document.getElementById('username-label')
    const passwordLabel = document.getElementById('password')
    const changeBtn = document.querySelector('#change-parameter')

    //if user wants to change their username
    if(settings.username){

      //changing text of labels and button
      usernameLabel.textContent = "Enter your old username";
      passwordLabel.textContent = "Enter your password";
      changeBtn.value = "Confirm account"
    }
    //if user wants to remove their account
    if(settings.remove){
      usernameLabel.textContent = "Enter your username";
      passwordLabel.textContent = "Enter your password";
      changeBtn.value = "Confirm account"
    }
  }
})
// function showImages(){
// }

//adds images to the gallery 
async function populateGallery(){
  const gallery = document.querySelector('.gallery-container')
  const getPictures = fetch('http://localhost:5000/users/pics')
  .then(data=>data.json())
  .then(data => {
    const pics = data;
    pics.map((pic)=>{
      const img = document.createElement('img');
      img.classList.add('profile-option')
      img.src = pic.src;
      gallery.appendChild(img);

    })
  })
}

container.addEventListener('click', pickIcon);

function pickIcon(e){
  //gets called when a profile image is clicked
  if(e.target.classList.contains('profile-option')){
    //dynamically added class that is added when an image is clicked
    const previousSelection = document.querySelector('.selected-profile');
    //if there is a previous selection and the user clicks that image, deselect it
    if(previousSelection && e.target.classList.contains('selected-profile')){
      previousSelection.classList.remove('selected-profile');
    }else{
      //if there is a previous selection deselect it and select whatever image is being clicked
        if(previousSelection){
      previousSelection.classList.remove('selected-profile');
        }
        e.target.classList.add('selected-profile')
    }
  }
  
}

const getLoggedInUser = new httpRequest('http://localhost:5000/users');
//function that returns the user thats logged in  
function getUser  (){
 const user =  getLoggedInUser.getRequest()
  .then(data=>{
    const users = data;
    const loggedInUser =   users.filter((user)=>{
      return user.login
    })
    return loggedInUser
  }
  )
  return user;
}

const confirmImage = document.querySelector('.confirm-new-image')
confirmImage.addEventListener("click", sendPatchRequest)


function sendPatchRequest(){
  const previousSelection = document.querySelector('.selected-profile');
  //runs if there is an image selected when button is clicked
  if(previousSelection){
    //gets the logged in user
     getUser()
     //calls the patch function with the logged in user and the url of the selected image of the new profile image
     .then(user=>{
      patch(user, previousSelection.src)
     });
  }
}





//sends the request to the server to update the profile image to the one selected and redirects to the homepage
function patch(user, url){
  const getUserInfo = new httpRequest(`http://localhost:5000/users/${user[0].username}`)
  getUserInfo.changeProfileSettings(url);
  window.location.href = 'index.html';
}


const formDiv = document.querySelector('.validate-login')
const changePassword = document.querySelector('.change-password')

//creates the error message 
function createErrorMessage(mesg){
  const previousMessage = document.querySelector('.alert-message');
  const usernameLabel = document.getElementById('username-label')
   if(previousMessage!== null) return
  const div = document.createElement('div');
  const message = document.createTextNode(mesg)
  div.classList.add('alert-message')
  div.appendChild(message);
  if(formDiv.classList.contains('hidden')){
const passwordLabel = document.getElementById('new-password-label')
    changePassword.insertBefore(div, passwordLabel)
  }else{
    formDiv.insertBefore(div, usernameLabel )
  }
  setTimeout(removeErrorMessage, 2000, div)
 
}

function removeErrorMessage(div){
  div.remove();
}


container.addEventListener("click", changeLogin)

function changeLogin(e){
  //the same button  used to perform all of the different requests but it is given a different class if the user wants to change their username or delete their account. This only fires if the button doesn't have the patch-username or delete-account class
  if(e.target.id === "change-parameter" && !e.target.classList.contains('patch-username')&& !e.target.classList.contains('delete-account')){
    e.preventDefault()
    //if all fields are filled out check if its valid
    if(usernameInput.value !=='' && passwordInput.value != '') checkIfValid(usernameInput.value, passwordInput.value)
    else createErrorMessage( "Please Fill Out All Fields");
  }
}

//checking user authentication to see if the input vlaues match the users username and password
function checkIfValid(username, password){
  let approved;

 getUser()
 .then(user=>{
  //if the inputs match 
  const checkInfo = new httpRequest('http://localhost:5000/users', username, null, password)
  checkInfo.loginRequest(true)
  .then(resp=>{
    console.log(resp);
    if (resp.status === 200) userAuthenticated()
    else createErrorMessage("wrong username or password")

  })
  //console.log(approved)
  //  if(approved){
  //    getState.getRequest()
  //    .then(update=>{
  //      //if the user wanted to change their password show the change password state
  //      if(update.password){
  //       formDiv.style.display = "none"
  //       formDiv.classList.add("hidden");
  //       changePassword.style.display = "block"
  //      }else{
  //       const changeBtn = document.getElementById("change-parameter");
  //       passwordInput.disabled = true;
  //       usernameInput.disabled = true
  //       const copyBtn = changeBtn;
  //       //if the user wanted to remove their account show the remove state
  //        if(update.remove){
  //         changeBtn.remove();
  //         confirmation.style.display = "block";
  //         copyBtn.value = "Delete Account";
  //         copyBtn.classList.add("delete-account")
  //         formDiv.appendChild(copyBtn);
  //        }
  //        //if the user wanted to change their username then show the username state
  //        else{
  //         const label = document.createElement('label');
  //         label.for = "new-username"
  //         label.textContent = "Enter new username"
  //         const changeUsername = document.createElement('input');
  //         changeUsername.type = "text";
  //        changeUsername.id = "new-username";
  //        const copyBtn = changeBtn;
  //        copyBtn.value = "Change Username"
  //        copyBtn.classList.add("patch-username")
  //        formDiv.appendChild(label);
  //        formDiv.appendChild(changeUsername)
  //        formDiv.appendChild(copyBtn);
  //        }
      
        
  //      }
  //    })
   
  //  }
  //  else{
  //   createErrorMessage("wrong username or password")
  //  }
 })
}
function userAuthenticated(){
    getState.getRequest()
    .then(update=>{
      //if the user wanted to change their password show the change password state
      if(update.password){
       formDiv.style.display = "none"
       formDiv.classList.add("hidden");
       changePassword.style.display = "block"
      }else{
       const changeBtn = document.getElementById("change-parameter");
       passwordInput.disabled = true;
       usernameInput.disabled = true
       const copyBtn = changeBtn;
       //if the user wanted to remove their account show the remove state
        if(update.remove){
         changeBtn.remove();
         confirmation.style.display = "block";
         copyBtn.value = "Delete Account";
         copyBtn.classList.add("delete-account")
         formDiv.appendChild(copyBtn);
        }
        //if the user wanted to change their username then show the username state
        else{
         const label = document.createElement('label');
         label.for = "new-username"
         label.textContent = "Enter new username"
         const changeUsername = document.createElement('input');
         changeUsername.type = "text";
        changeUsername.id = "new-username";
        const copyBtn = changeBtn;
        copyBtn.value = "Change Username"
        copyBtn.classList.add("patch-username")
        formDiv.appendChild(label);
        formDiv.appendChild(changeUsername)
        formDiv.appendChild(copyBtn);
        }
     
       
      }
    })
  
}

const passwordLabel = document.getElementById('.new-password-label')
container.addEventListener('click', updatePassword);

//changes password
function updatePassword(e){  
  if(e.target.id === "confirm-new-password"){
    e.preventDefault();
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    if(passwordInput.value !=='' && confirmPasswordInput.value !== ''){
        if(passwordInput.value !== confirmPasswordInput.value){
          createErrorMessage("Passwords don't match", passwordLabel)
        }
        else{
          const password = passwordInput.value
          const containsNum = /\d/;
          const testingPassword = containsNum.test(password);
          if(password.length <7 ){
              createErrorMessage("Password must be at least 7 characters");
          }
          else if(!testingPassword){
            createErrorMessage("Password must have at least one number ");
          }

          //if the new password meets the criteria then send the patch request to the server with the new password
          else{
            getUser()
            .then(user=>{
              const setPassword = new httpRequest(`http://localhost:5000/users/${user[0].username}`);
              setPassword.changeProfileSettings(null, null, password);
              window.location.href = "index.html";
            })
          }
        }
    }
    else{
    createErrorMessage("Please Fill Out All Fields")
    }
  }

}

container.addEventListener("click", patchUsername)
//changes the username
function patchUsername(e){
  if(e.target.classList.contains("patch-username")){
    e.preventDefault();
    const newUsername = document.getElementById("new-username")
    //if theres a value inputted check if it is a valid username
    if(newUsername.value!== ''){
      checkIfUsernameValid(newUsername.value)
    }else{
      createErrorMessage("Fill out all fields")
    }
  }

}


function checkIfUsernameValid(username){
  const checkNumber = /\d/;
  //testing to see if username has a number
  const hasNumber = checkNumber.test(username);
  if(hasNumber){
    //checking to see if username is long enough
      if(username.length <6) {
        createErrorMessage("New username must have atleast six characters")
      }else{
        getLoggedInUser.getRequest()
        .then(users=>{
          //checking to see if there are any users that have that username already
          const filtered = users.filter((user)=>{
            return user.username === username
          })
          //if there is a user with that username
          if(filtered.length!== 0){
            createErrorMessage("Username is already Taken ")
          }
          //send a patch request with the new username 
          else{
          getUser()
          .then(user=>{
            const setUsername = new httpRequest(`http://localhost:5000/users/${user[0].username}`)
            setUsername.changeProfileSettings(null, username, null);
            window.location.href = "index.html"
          })
          }
        })
      }

  }else[
    createErrorMessage("New username must have atleast one number")
  ]
}

container.addEventListener("click", removeAccount)
//removes account
function removeAccount(e){
  if(e.target.classList.contains('delete-account')){
    e.preventDefault();
    const confirmDelete = document.getElementById("confirm-delete");
    const dontDelete = document.getElementById("dont-delete");
    //if none of the options are checked 
    if(!confirmDelete.checked && !dontDelete.checked){
      createErrorMessage("Please check yes or no")
    }else{
      //if user decides not to delete
      if(dontDelete.checked){
        window.location.href = "index.html"
      }else{
        //send delete request to the server to remove the account
        getUser()
        .then(user=>{
          const deleteAccount = new httpRequest(`http://localhost:5000/users/${user[0].username}`)
          deleteAccount.deleteAccount();

          window.location.href = "index.html"
        })
      }
    }
  }
}