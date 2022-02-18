console.log('connected');
const container = document.querySelector("#container")
const nftSpot = document.querySelectorAll(".nft-to-buy")
const orderHeading = document.querySelectorAll('.name');
const priceSpan = document.querySelectorAll('.nft-price');
const nftHeading = document.querySelector('.heading')
const decrementCounter = document.querySelector('.decrement');
const incrementCounter = document.querySelector('.increment');
const counterValue = document.querySelector('.quantity');;
const order = document.querySelector('.place-order');
const purchaseScreen = document.querySelector('.purchase-screen');
const orderScreen = document.querySelector('.nft-pic');
const amountToPurchase = document.querySelector(".total-quantity")
const totalAmount = document.querySelector(".total-amount")

// const imageToScreenshot = document.querySelector('#double-click');
const backArrow = document.querySelector('.back-arrow')
backArrow.style.display = "none";
order.addEventListener("click", showPurchaseScreen)

let price;
let header;

function  addEventListener(){
  decrementCounter.addEventListener('click', subtractCounter);
  incrementCounter.addEventListener('click',addCounter);
  container.addEventListener("dblclick", screenShotImage )


}

function subtractCounter(){

  let value = parseInt(counterValue.textContent) -1
  if(value <= 0){
    counterValue.textContent = 0
  }else{
    counterValue.textContent = value;

  }
}
function addCounter(){

  let value = parseInt(counterValue.textContent) +1
  if(value >= 10){
    counterValue.textContent = 10
  }else{
    counterValue.textContent = value;

  }
}
addEventListener();
function showPurchaseScreen(){
  if(counterValue.textContent !== '0' ){
    orderScreen.style.display = "none"
  purchaseScreen.style.display = "flex";
  nftHeading.style.display = "none";
  backArrow.style.display = "block";
  amountToPurchase.textContent = counterValue.textContent;
  let price = parseFloat(priceSpan[0].textContent);
  console.log(price);
 // console.log(total);
  const total = parseInt(amountToPurchase.textContent) *price;
  totalAmount.textContent = total.toFixed(1);

  }
  

}
backArrow.addEventListener("click", goBack)
function goBack(){
  purchaseScreen.style.display = "none";
  backArrow.style.display = "none";
  nftHeading.style.display = "flex";

  orderScreen.style.display = "grid"
}

const getOrderedNFT = new httpRequest("http://localhost:5000/users/placeorder")
async function getCorrectNFT(){
  console.log("running")
  getOrderedNFT.getRequest()
  .then(data => {
    console.log(1);
   // nftSpot.src = data.url;
    nftSpot.forEach((img)=>{
      img.src = data.url;
    })
    orderHeading.textContent = data.name
    orderHeading.forEach((heading)=>{
      heading.textContent = data.name;
      header = data.name;
    })
    priceSpan.forEach((span)=>{
      span.textContent = `${data.price} million`;
      price = data.price
    })
    
  });
 
 
 

}


getCorrectNFT()


function screenShotImage(e){
  if(e.target.id === "double-click"){
    console.log("screenshot");
    const screenshot = new Audio('z_uk-foto.mp3');
  screenshot.play();
    getUser(e.target.src, parseInt(counterValue.textContent));
    container.removeEventListener("dblclick", screenShotImage);
    setTimeout(showRedirectScreen, 750);
  }
}

function showRedirectScreen(){
  purchaseScreen.style.display = "none";
  backArrow.style.display = "none";
  const redirect = document.querySelector('.menu-screen');
  redirect.style.display = "flex";
}

async function getUser(img){

   const getLoggedInUser = new httpRequest('http://localhost:5000/users')
    getLoggedInUser.getRequest()
    .then(data=> {
      let targetUser;
      let users = data;
       users.filter((user)=>{
        user.login ? targetUser = user: null;
      })
      const postLoggedInUser = new httpRequest('http://localhost:5000/users', targetUser.username, img, targetUser.password, parseInt(counterValue.textContent) )

      postLoggedInUser.nftPostPurchasesRequest(price, header, "buy")
    })




  


 

}

// async function postPurchases(username, password,  purchase, quantity){
//   const addToPortfolio = await fetch('http://localhost:5000/users', {
//     method: 'PATCH',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({username: username, password: password, login : true, purchasedItem: [{url: purchase, price: `${price} million`, quantity: quantity, name: header}]})
//   })
// } 










  // await fetch('http://localhost:5000/users', {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({username: userName, password: password, profilePic : image})
  // })