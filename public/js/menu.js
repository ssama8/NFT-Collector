const signUpBtn = document.getElementById('sign-up')
const loginButton = document.getElementById('login-btn');
const profile = document.getElementById('profile');
const container = document.getElementById('container');
container.addEventListener("click", showProfileSettings)
container.addEventListener('click', signOut);
//container.addEventListener('click', updateProfile);
container.addEventListener('click', updateChangeRequest);

const accountState = {
  signedIn : false

}
let currentUser;
async function getDetails(){
  
  const getDetails = new httpRequest("http://localhost:5000/users" )
  const findLogin = getDetails.getRequest()
  .then(data=>  {
    let copyData = [...data];
    let currentAccount = copyData.filter((user)=>{
          return user.login
    
    })

  return currentAccount
  })
  
  return findLogin;
}




function showLoginStatus(){
  getDetails()
    .then(data=> {
      console.log(data);
      if(data.length !== 0){
        console.log("show")
        signUpBtn.style.display = "none";
            loginButton.style.display = "none";
            profile.style.display = "block" 
        console.log(profile);

            //const img = document.getElementById('profile-image-display');
            const img = document.querySelectorAll('.profile-image');
            console.log(img)
            img.forEach((img)=>{
              img.src = data[0].profilePic

            })
            const usernameDisplay = document.querySelector('.current-username')
            const passwordDisplay = document.querySelector('#current-password')

            usernameDisplay.textContent = data[0].username;
            passwordDisplay.value= data[0].password;

            console.log(data)
            currentUser = data;

          
      
            accountState.signedIn = true;
      }else{
        console.log('get rid of')
        profile.style.display = "none"     
  
            signUpBtn.style.display = "block";
            loginButton.style.display = "block";
            accountState.signedIn = false;
      }
    })
    .catch(err => console.log('get request not received'));
    console.log(currentUser);
  }
  
  showLoginStatus();


  const accountNav = document.getElementById('account-details');
  accountNav.style.display = "none";

  function showProfileSettings(e){

    if(e.target.id === 'profile-image-display'){
      console.log("show account Settings");
      ('account-details');
      if(accountNav.style.display === "none"){
        accountNav.style.display = "flex";
      }else{
        accountNav.style.display = "none";
  
      }
      
    }
  }



function signOut(e){
  if(e.target.id === "sign-out" ){
    e.preventDefault();
    console.log("sign-Out");
    getDetails()
    .then(data => {
    
      console.log(data);
      
      const status = false;
      const loginSite = new httpRequest('http://localhost:5000/users', data[0].username, null, data[0].password)
    loginSite.loginRequest(status)
     // sendPatchReguest(data[0].username, data[0].password, status)
      accountState.signedIn = false;
      currentUser = null;
   window.location.reload();
      
    });
  }
}




function updateChangeRequest(e){
  //  console.log(e.target.classList)
    if(e.target.classList.contains("change-request")){
    e.preventDefault()
  
      console.log('update settings')
      const sendData = new httpRequest("http://localhost:5000/users/change-request")
      console.log(e.target.id)
      if(e.target.id === "change-profile-image" ){
        sendData.sendProfileSettings(true)
      }else if(e.target.id === "change-username"){
        sendData.sendProfileSettings(null, true)
  
      }else{
        sendData.sendProfileSettings(null, null,  true)
  
      }
  
      console.log("running")
      window.location.href = 'changeAccountSettings.html';
  
    }
  }


// async function sendPatchReguest(username, password, status){
//   const signOut = await fetch('http://localhost:5000/users',
//   {
//     method: 'PATCH',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({username: username, password: password, login: status})
//   })
//   // const get = await fetch('http://localhost:5000/users')
//   // .then(data=> data.json())
//   // .then(data=> console.log(data))

// }







