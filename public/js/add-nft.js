

//form elements
const form = document.querySelector('.create-nft')
const nameInputlabel = document.querySelector('.name-label')
const nameInput = document.getElementById('name')
const priceInput = document.getElementById('value-on-paper')
const urlInput = document.getElementById('nft-url');

//buttons used for page to function
const previewBtn = document.querySelector('.preview-btn')
const redirectBtn = document.querySelector('.redirect')
redirectBtn.style.display = "none"
//part of the preview state that willhave text content set to the given inputs
const newNFTHeader = document.querySelector('.nft-name')
const newNFTPrice = document.querySelector('.nft-name')
const image = document.querySelector('.preview-nft');


const loadingScreen =  document.querySelector('.loading-screen') 

let loggedInUser ;
//function run right away to check if theres a user logged in. I
function init(){
  const getUser = new httpRequest("http://localhost:5000/users")
 getUser.getRequest()
  .then(data=>{
    console.log(data)
    let copy = data;
    copy.filter((user)=>{
      if(user.login){
        loggedInUser = user
      }
    })
    if(loggedInUser === undefined){
      //if there is no user logged in hide the form 
      const loginSection = document.querySelector('#showcase');
      loginSection.style.display = "none"
     
    }else{
      //hides the redirect screen 
      const redirectScreen = document.querySelector('.login');
      redirectScreen.style.display = "none";
     
      
    }
  })
}
init();


previewBtn.addEventListener('click', previewTheNFT)
//used to see if the url points to an actual image initially set to false
let error = false;


function previewTheNFT(e){
  e.preventDefault();
  //the class of the button changes based on the state so if it has submit as a class don't run this function 
  if(e.target.classList.contains('submit')) return 

  //checking for empty inputs
  if(nameInput.value === '' || priceInput.value === '' || urlInput.value === ''){
    showError("Fill Out All Fields", nameInputlabel)
  }else{
    //regex for a validnumber to make sure the price input is a valid number
    const validNumber = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
    let valid = validNumber.test(priceInput.value);
    if(valid){
      // error = false;
      
      //image is the where the preview of the nft will show

      loadingScreen.style.display = "block";
      //setting the images src to the input value
      image.src = urlInput.value
      //if the image doesn't load it will call checkError which sets error to true
      image.onerror = checkError
      
      previewBtn.style.display = "none";
      setTimeout(fillOutPreview, 1500)
     //console.log(imageShown);

    }else{
      const valueLabel = document.querySelector('.paper-value')
      showError("Enter a valid number for the worth on paper",valueLabel)
    }
   
  }
  
}


function checkError(){
  error = true;
}


function fillOutPreview(){
  //if there is no error then populate the preview section with the given inputs
  if(!error){
    loadingScreen.style.display = "none";
    const inputContainer = document.querySelector(".inputs-container")
    inputContainer.style.display = "none";
    document.querySelector('.preview-nft').style.display = "block";
    const nameHeading = document.querySelector('.nft-name')
    const priceHeading = document.querySelector('.nft-price')
    nameHeading.textContent = nameInput.value
    priceHeading.textContent = `$${priceInput.value} million`
  
  
    image.alt = "test";
   
    previewBtn.style.display = "block";
    //changing the state of the button. 
    previewBtn.classList.add('submit');
    previewBtn.value = "Add To NFT Gallery "
    redirectBtn.style.display = "block"
  }else{
    //if there's an error than send error message 
    loadingScreen.style.display = "none";
    showError("The image can't be found, please enter the image address", previewBtn)
    error = false;
    previewBtn.style.display = "block";
  }

}
function showError(msg, specifiedDiv){
  const div = document.createElement("div");
  div.classList.add('error-div');
  const text = document.createTextNode(msg);
  div.appendChild(text);
  form.insertBefore(div, specifiedDiv);
  setTimeout(removeErrorMSG, 2000, div)
}
function removeErrorMSG(div){
  div.remove();
}

redirectBtn.addEventListener("click", goBack)


function goBack(e){
  e.preventDefault();
  loadingScreen.style.display = "none";
  const inputContainer = document.querySelector(".inputs-container")
  inputContainer.style.display = "block";
  const nameHeading = document.querySelector('.nft-name')
  const priceHeading = document.querySelector('.nft-price')
  nameHeading.textContent = ''
  priceHeading.textContent = ''
  image.style.display = "none";
  previewBtn.classList.remove('submit');
  previewBtn.value = "Preview "
  redirectBtn.style.display = "none";

}


form.addEventListener('click', sendPostRequest)



function sendPostRequest(e){
  //if the buttonhas the class of submit, send a post request to the users/pics route and send user back to homepage. 
  if(e.target.classList.contains('submit')){
    const addNFt = new httpRequest("http://localhost:5000/users/pics" )
    addNFt.addNFT(image.src, nameInput.value, priceInput.value)
    window.location.href = "index.html#gallery"
  }
}

