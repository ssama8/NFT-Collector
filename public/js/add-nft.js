const form = document.querySelector('.create-nft')
const nameInputlabel = document.querySelector('.name-label')

const nameInput = document.getElementById('name')
const priceInput = document.getElementById('value-on-paper')


const urlInput = document.getElementById('nft-url');
const image = document.querySelector('.preview-nft');
const previewBtn = document.querySelector('.preview-btn')
const newNFTHeader = document.querySelector('.nft-name')
const newNFTPrice = document.querySelector('.nft-name')
let error;
const loadingScreen =  document.querySelector('.loading-screen') 
previewBtn.addEventListener('click', previewTheNFT)
let loggedInUser 
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
      const loginSection = document.querySelector('#showcase');
      console.log(loginSection)
      loginSection.style.display = "none"
     
    }else{
      const portfolioSection = document.querySelector('.login');
      portfolioSection.style.display = "none";
     
      
    }
  })
}
init();

form.addEventListener('click', sendPostRequest)

function previewTheNFT(e){
  e.preventDefault();
  if(e.target.classList.contains('submit')) return 
  if(nameInput.value === '' || priceInput.value === '' || urlInput.value === ''){
    showError("Fill Out All Fields", nameInputlabel)
  }else{
    const validNumber = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
    let valid = validNumber.test(priceInput.value);
    console.log(valid);
    if(valid){
      error = false;
     loadingScreen.style.display = "block";
      image.src = urlInput.value
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
  console.log('runs');
  error = true;

  

}
function fillOutPreview(){
  console.log(error)
  if(!error){
    loadingScreen.style.display = "none";
    document.querySelector('.preview-nft').style.display = "block";
    const nameHeading = document.querySelector('.nft-name')
    const priceHeading = document.querySelector('.nft-price')
    nameHeading.textContent = nameInput.value
    priceHeading.textContent = `$${priceInput.value} million`
  
    console.log(urlInput.value);
  
    image.alt = "test";
   
    previewBtn.style.display = "block";

    previewBtn.classList.add('submit');
    previewBtn.value = "Add To NFT Gallery "

  }else{
    loadingScreen.style.display = "none";
    showError("The image can't be found, please enter the image address", previewBtn)
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







function sendPostRequest(e){
  if(e.target.classList.contains('submit')){
    const addNFt = new httpRequest("http://localhost:5000/users/pics" )
    addNFt.addNFT(image.src, nameInput.value, priceInput.value)
    window.location.href = "index.html#gallery"
  }
}

//  fetch("http://localhost:5000/users")
//  .then(data=> data.json())
//  .then(resp => console.log(resp))
  // .then(data => {console.log(data)
  //   // newNFTHeader.textContent = nameInput.value
  //   //newNFTPrice.textContent = priceInput.value; 
  // }
  // )
  // .catch(err => console.log(err));