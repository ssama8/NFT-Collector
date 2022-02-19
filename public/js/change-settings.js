
const container = document.querySelector('.change-account-settings')
container.addEventListener('click', pickIcon);
container.addEventListener('click', updatePassword);
const confirmation = document.querySelector('.confirmation')

const profileImages = document.querySelector('.profile-icon-container');
const signinForm = document.querySelector('.change-details')
const getState = new httpRequest('http://localhost:5000/users/change-request')
getState.getRequest()
.then(settings=>{
  console.log(settings);
  if(settings.profileImage){
  populateGallery();

    setTimeout(showImages, 500)
    signinForm.style.display = "none";
  }else{
    container.addEventListener("click", changeLogin)
    const usernameLabel = document.getElementById('username-label')
    const passwordLabel = document.getElementById('password')
    const changeBtn = document.querySelector('#change-parameter')
    if(settings.username){
   

      usernameLabel.textContent = "Enter your old username";
      passwordLabel.textContent = "Enter your password";
      changeBtn.value = "Confirm account"
    }
    if(settings.remove){
      console.log("delete account");
      usernameLabel.textContent = "Enter your username";
      passwordLabel.textContent = "Enter your password";
      changeBtn.value = "Confirm account"
      
    }
  }
})
function showImages(){

  profileImages.style.display = "flex";
}
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

  }
    )
}



function pickIcon(e){

  if(e.target.classList.contains('profile-option')){
    const previousSelection = document.querySelector('.selected-profile');
  
    if(previousSelection && e.target.classList.contains('selected-profile')){
      previousSelection.classList.remove('selected-profile');
      //e.target.classList.add('selected-profile')
     
    }else{
    
        if(previousSelection){
      previousSelection.classList.remove('selected-profile');

        }
        e.target.classList.add('selected-profile')
      //}
     

    }
   
  }
  
}
const confirmImage = document.querySelector('.confirm-new-image')
confirmImage.addEventListener("click", sendPatchRequest)
const getLoggedInUser = new httpRequest('http://localhost:5000/users');


function getUser  (){
  let loggedInUser;
 const user =  getLoggedInUser.getRequest()
  .then(data=>{
    let users = data;
    loggedInUser =   users.filter((user)=>{
      return user.login
    })
    if(loggedInUser.length === 1){
      console.log(loggedInUser)
    }
    return loggedInUser

  }
  

  )
  console.log(user);
  console.log(loggedInUser);

  return user;
}
// const getLoggedInUser = new httpRequest('http://localhost:5000/users');
function sendPatchRequest(){
  const previousSelection = document.querySelector('.selected-profile');
  if(previousSelection){
console.log('Send request')
     getUser()
     .then(user=>{
      patch(user, previousSelection.src)

     });
    
  }

}


function patch(user, url){
  console.log(user);
  const getUserInfo = new httpRequest(`http://localhost:5000/users/${user[0].username}`)
  getUserInfo.changeProfileSettings(url);
  window.location.href = 'index.html';
}
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

function changeLogin(e){
  if(e.target.id === "change-parameter" && !e.target.classList.contains('patch-username')&& !e.target.classList.contains('delete-account')){
    e.preventDefault()
   
    console.log(usernameInput.value, passwordInput.value )
    if(usernameInput.value !=='' && passwordInput.value != ''){
      checkIfValid(usernameInput.value, passwordInput.value);

    }else{

      let message = "Please Fill Out All Fields"
    createErrorMessage(message)
    }
    console.log('update')
    

  }
}

const formDiv = document.querySelector('.validate-login')
const changePassword = document.querySelector('.change-password')


function createErrorMessage(mesg){
  const previousMessage = document.querySelector('.alert-message');
  const usernameLabel = document.getElementById('username-label')

   if(previousMessage!== null) return
  const div = document.createElement('div');
  const message = document.createTextNode(mesg)
  div.classList.add('alert-message')
  div.appendChild(message);
  if(formDiv.classList.contains('hidden')){
  console.log(formDiv.style)   
 console.log(changePassword);

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



function checkIfValid(username, password){
 getUser()
 .then(user=>{
   
   if(user[0].username === username && user[0].password === password){
     console.log("valid")
     getState.getRequest()
     .then(update=>{
       console.log(update)
       if(update.password){
        formDiv.style.display = "none"
        formDiv.classList.add("hidden");
        changePassword.style.display = "block"
       }else{
        const changeBtn = document.getElementById("change-parameter");

         if(update.remove){
         const copyBtn = changeBtn;
         changeBtn.remove()
         passwordInput.disabled = true;
         usernameInput.disabled = true;
            confirmation.style.display = "block";
            copyBtn.value = "Delete Account";

            copyBtn.classList.add("delete-account")
            formDiv.appendChild(copyBtn);
         }else{
          passwordInput.disabled = true;
          usernameInput.disabled = true;
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
   
   }else{
     console.log("wrong username or password")
    createErrorMessage("wrong username or password")

   }
 })
}


const passwordLabel = document.getElementById('.new-password-label')

function updatePassword(e){
  if(e.target.id === "confirm-new-password"){
    e.preventDefault();
    console.log("running")
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    if(passwordInput.value !=='' && confirmPasswordInput.value !== ''){
        if(passwordInput.value !== confirmPasswordInput.value){
      
          createErrorMessage("Passwords don't match", passwordLabel)

        }else{
          const password = passwordInput.value
          const containsNum = /\d/;
        const testingUsername = containsNum.test(password);
          if(password.length <7 || !testingUsername){
              createErrorMessage("Password Must be at least 7 character with atleast one number")
          }else{
            getUser()
            .then(user=>{
              const setPassword = new httpRequest(`http://localhost:5000/users/${user[0].username}`)
              setPassword.changeProfileSettings(null, null, password);
              window.location.href = "index.html"
            })
         

          }
          
        }
      ;

    }else{
      console.log("empty")
      let message = "Please Fill Out All Fields"
    createErrorMessage(message)
    }
  }

}

container.addEventListener("click", patchUsername)

function patchUsername(e){
  if(e.target.classList.contains("patch-username")){
    e.preventDefault();
    console.log("update username ")
    const newUsername = document.getElementById("new-username")
    if(newUsername.value!== ''){
      checkIfUsernameValid(newUsername.value)
    }else{
      createErrorMessage("Fill out all fields")
    }
  }

}


function checkIfUsernameValid(username){
  const checkNumber = /\d/;
  const hasNumber = checkNumber.test(username);
  if(hasNumber){
      if(username.length <6) {
        createErrorMessage("New username must have atleast six characters")
      }else{
        getLoggedInUser.getRequest()
        .then(users=>{
          const filtered = users.filter((user)=>{
            return user.username === username
          })
          if(filtered.length!== 0){
            console.log("Username is already Taken ")
            createErrorMessage("Username is already Taken ")
          }else{
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
function removeAccount(e){
  if(e.target.classList.contains('delete-account')){
    e.preventDefault();
    const confirmDelete = document.getElementById("confirm-delete");
    const dontDelete = document.getElementById("dont-delete");
    console.log(confirmDelete.checked, dontDelete.checked)
    if(!confirmDelete.checked && !dontDelete.checked){
      createErrorMessage("Please check yes or no")
    }else{
      if(dontDelete.checked){
        window.location.href = "index.html"
      }else{
        getUser()
        .then(user=>{
          const deleteAccount = new httpRequest(`http://localhost:5000/users/${user[0].username}`)
          deleteAccount.deleteAccount();
          //setUsername.changeProfileSettings(null, username, null);

          window.location.href = "index.html"
        })
        

      }
    }
    console.log("Remove Account");
  }
}