const signUpBtn = document.getElementById('sign-up')
const loginButton = document.getElementById('login-btn');
const profile = document.getElementById('profile');
const container = document.getElementById('container');
container.addEventListener("click", showProfileSettings)
container.addEventListener('click', signOut);
//container.addEventListener('click', updateProfile);

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
      if(data.length !== 0){
        signUpBtn.style.display = "none";
            loginButton.style.display = "none";
      
            profile.style.display = "block" 
            const img = document.getElementById('profile-image-display');
          
            img.src = data[0].profilePic
            console.log(data)
            currentUser = data;
          
      
            accountState.signedIn = true;
      }else{
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







