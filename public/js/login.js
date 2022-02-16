
const usernameInput = document.getElementById('username-login');
const passwordInput = document.getElementById('password-login');
const loginButton = document.getElementById('login');


loginButton.addEventListener('click', loginToAccount)


function loginToAccount(e){
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  if(username === '' || password.value === ''){
    //alert to fill in all of the fields
  }else{
const loginSite = new httpRequest('http://localhost:5000/users', username, null, password)
    loginSite.loginRequest(true)
    .then(data=> {
        loggedIn()
      
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
