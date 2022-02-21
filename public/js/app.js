/*Made class called httpRequest that is inserted in the 
HTML before the app.js file to perform http requests to 
the servers rest api*/
const users = new httpRequest("http://localhost:5000/users/pics")

//Container holding everything used for event delegation 
const container = document.getElementById('container');

/*The buttons at the top of the header */ 
const signUpBtn = document.getElementById('sign-up')
const loginButton = document.getElementById('login-btn');

//The profile photo that toggles the settings dropdown onclick
const profile = document.getElementById('profile');

/*The div that holds the alert when user tries buying nft without being logged in */
const alertLayer = document.querySelector(".relative-layer")



//On the exit button on the alert to remove the alert message
container.addEventListener("click", removeAlert)


/*Get Request to server ran initially, to look for a logged in user.  */
const checkLogin = new httpRequest("http://localhost:5000/users")
checkLogin.getRequest() //method made to send a get request to server
.then(data =>{
 const copy = data;   //storing the data returned in a separate variable
  const filtered = copy.filter((user)=>{ 
    return user.login //Looking for a user that is logged in 
  })

  //If there is no logged in usr than only load the nfts that come with the app by default 
  if(filtered.length === 0){
    //Sends get request to serer that sends back the default nfts
    users.getRequest()
    .then(images=> {
    //Making sure that only 9 images by deault show just in case hteres some error in the server
    const copyOfImages = images.slice(0,9) 
    copyOfImages.map((image)=>{
     populateGallery(image);
    })
  })
  .catch(err=> alert(err));

  }else{
     //If there is a logged in user than load the default nfts as well as any custom nfts that the specific user made.  
    filtered[0].images.map((image)=>{
      populateGallery(image);
    })
  }
})
      


/*Makes a card for each nft that is passed in */ 
function populateGallery(nft){

  //Making elements for the header, image, and description of the nft with a button to initiate a request to order the specified nft
  const parentDiv = document.createElement('div');
  const  button = document.createElement('button');
  const header = document.createElement('h3');
  const description = document.createElement('p'); 
  const image = document.createElement('img');

  //Setting the contnet of the elements to the data passed in 
  header.textContent =nft.name;
  description.textContent =nft.description;
  button.textContent = "Buy Now";
  image.src =nft.src;

  //Adding classes for styling purposes
  button.classList.add('buy-nft')
  image.classList.add('showcase')
  parentDiv.classList.add("gallery-pic")

  //adding everything to the parentDiv
  parentDiv.appendChild(header);
  parentDiv.appendChild(image);
  parentDiv.appendChild(button);
   parentDiv.appendChild(description);

   //Adding the parent div to the gallery section to display all of the nfts
   const container = document.querySelector('#gallery');
   container.appendChild(parentDiv);

}

//Used to send request to server that the user want to order a particular NFT
container.addEventListener('click', orderNFT);

function orderNFT(e){
  if(e.target.classList.contains("buy-nft")){

    if(!accountState.signedIn){

    showAlert();

  
    }else{
      console.log(accountState)
   
      let siblingElements = [...e.target.parentElement.childNodes]
      let img = siblingElements.filter((node)=>{
        return node.classList.contains("showcase")
      })
  
    const url = img[0].src

   const nftToOrder = new httpRequest("http://localhost:5000/users/placeorder", currentUser[0].username, url )
    nftToOrder.nftOrderPostRequest();  

 
    //   window.location.href = "http://localhost:5000/order.html"
    }
 
  }
}



function showAlert(){
 alertLayer.style.display = "block";

  const alertOverlay = document.querySelector(".alert-overlay")
  const customAlert = document.querySelector('.alert')
  customAlert.style.height = `${window.innerHeight/4}px`
  const height = customAlert.style.height
  customAlert.style.width = `${window.innerWidth/2}px`
  const width = customAlert.style.width

  const top =(window.innerHeight - parseInt(height)) /2;
 
  const left = (window.innerWidth - parseInt(width))/2
  customAlert.style.top = `${top}px` ;
  customAlert.style.left = `${left}px` ;

  alertOverlay.style.top = `${0}px`
}

function removeAlert(e){
  if(e.target.id === "remove-alert"){
    alertLayer.style.display = "none";
  }
}