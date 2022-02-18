
const usernameInput = document.getElementById('username-login');
const passwordInput = document.getElementById('password-login');
const loginButton = document.getElementById('login');

const signinForm = document.querySelector('.login')
loginButton.addEventListener('click', loginToAccount)


function loginToAccount(e){
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  if(username === '' || password === ''){
    //alert to fill in all of the fields
    createErrorMessage("Please fill out all fields")
  }else{

const loginSite = new httpRequest('http://localhost:5000/users', username, null, password)
    loginSite.getRequest()
    .then(data=> {
      const users = data;
        let filtered = users.filter((user)=>{
          console.log(user.username, user.password)
          return user.username === username && user.password === password
        })
        console.log(filtered)
      if(filtered.length ===1){
        loginSite.loginRequest(true);
        loggedIn()
      }else{
        createErrorMessage("Username or Password is not correct")
      }
      
    })
    .catch(err=> {
      console.log(err)
      checkValidAccount()

    })
    //checkInfo(username, password, true);
    //loggedIn();
  }

}
function checkValidAccount(){
  console.log("The username or password is not correct")
}



function loggedIn(){
  window.location.href = "index.html"
  
}



function createErrorMessage(mesg){
  const previousMessage = document.querySelector('.alert-message');
  const usernameLabel = document.getElementById('username-label')

   if(previousMessage!== null) return
  const div = document.createElement('div');
  const message = document.createTextNode(mesg)
  div.classList.add('alert-message')
  div.appendChild(message);
  signinForm.insertBefore(div, usernameLabel )

  setTimeout(removeErrorMessage, 2000, div)
 
}

function removeErrorMessage(div){
  div.remove();
}



// if(formDiv.classList.contains('hidden')){
//   console.log(formDiv.style)   
//  console.log(changePassword);

// const passwordLabel = document.getElementById('new-password-label')

//     changePassword.insertBefore(div, passwordLabel)
//   }else{

//   }