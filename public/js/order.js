//container used for event delegation purposes
const container = document.querySelector("#container")

//Variables that have to do with the counter
const decrementCounter = document.querySelector('.decrement');
const incrementCounter = document.querySelector('.increment');
const counterValue = document.querySelector('.quantity');;


//Order screen or initial screen variables 
const orderScreen = document.querySelector('.nft-pic');
const orderHeading = document.querySelectorAll('.name');
const order = document.querySelector('.place-order');

//Purchase screen varibales 
const purchaseScreen = document.querySelector('.purchase-screen');
const amountToPurchase = document.querySelector(".total-quantity")
const totalAmount = document.querySelector(".total-amount")


const h1 = document.querySelector('.place-order-heading')

//Utility variables that will get the data from the get request and populate the content for the specified NFT
const nftSpot = document.querySelectorAll(".nft-to-buy")
const priceSpan = document.querySelectorAll('.nft-price');
const nftHeading = document.querySelector('.heading')



//The variable for the arrow that goes back to the order screen from the purchase screen and inititally is hidden 
const backArrow = document.querySelector('.back-arrow')
backArrow.style.display = "none";



//Creating a new httpRequest object with the link to make the requests
const getOrderedNFT = new httpRequest("http://localhost:5000/users/placeorder")

//Used later when sending the post request to server
let price,
  header;
//function will be run on page load right away
getCorrectNFT()

async function getCorrectNFT(){
  //Sets each variables attributes to the appropriate data from the get request to the server
  getOrderedNFT.getRequest()
  .then(data => {
    nftSpot.forEach((img)=>{
      img.src = data.url;
    })
    orderHeading.textContent = data.name
    orderHeading.forEach((heading)=>{
      heading.textContent = data.name;
      //Stting the header to the name 
      header = data.name;
    })
    priceSpan.forEach((span)=>{
      span.textContent = `${data.price} million`;
      //setting price to the specified price
      price = data.price
    })
  });
}

  //Event listeners for the buttons next to the counter
  //Decrement subtracts 1 and increment adds 1

  decrementCounter.addEventListener('click', subtractCounter);
  incrementCounter.addEventListener('click',addCounter);


  function subtractCounter(){
    //value represents the new value if decrement is clicked
   const value = parseInt(counterValue.textContent) -1
    //If the value is less than 0 then don't decrement more because you can't order a negative amount

   if(value < 0)counterValue.textContent = 0
   else counterValue.textContent = value;
  }
  function addCounter(){
    //value represents the new value if increment is clicked
    const value = parseInt(counterValue.textContent) +1
    //10 is the max order amount so if the value is greater than 1- than set value to 10 
    if(value > 10)counterValue.textContent = 10
    else counterValue.textContent = value;
  }


  //adding event listener to the order button 
order.addEventListener("click", showPurchaseScreen)


function showPurchaseScreen(){
  //only runs if the order value is not 0 
  if(counterValue.textContent !== '0' ){ 
    //Sets the state of the purchase screen 
    h1.style.display = "none";
    orderScreen.style.display = "none"
  purchaseScreen.style.display = "flex";
  backArrow.style.display = "block";

    //Setting the amountToPurcase text content to the value of the counter
  amountToPurchase.textContent = counterValue.textContent;
    //setting price to the content of the priceSpan element which is the price of the NFT, and parsing as a floated int
  let price = parseFloat(priceSpan[0].textContent);
    //counter value will always be a whole value so total will be the amount parsed as an int times the prices
  const total = parseInt(amountToPurchase.textContent) *price;
  //Rounds to 1 decimal point
  totalAmount.textContent = total.toFixed(1);

  }
  

}




//If the back arrow is clicked than go back to the orde screen to modify the purchase amount and reset the state to the order state
backArrow.addEventListener("click", goBack)
function goBack(){
  purchaseScreen.style.display = "none";
  backArrow.style.display = "none";
  h1.style.display = "block";
  orderScreen.style.display = "grid"
}

//On double click screen shot the image simulating a purchase of the nft
container.addEventListener("dblclick", screenShotImage )


function screenShotImage(e){
  //Using event delegation, the appropriate image has and id of double-click and this will only fire if that image is double clicked. 
  if(e.target.id === "double-click"){
    //Plays audio when screenshot has processed
    const screenshot = new Audio('z_uk-foto.mp3');
  screenshot.play();

  //Calls the getUser function with the image src,  which sends a post request to the server indicating that the user bought the NFT
    getUser(e.target.src);
    //Once it screenshotted just in ase the page doesn't redirect remove the event listener. 
    container.removeEventListener("dblclick", screenShotImage);
    //After 750 ms it will direct the user to the redirect screen 
    setTimeout(showRedirectScreen, 750);
  }
}
  //Setting the page into the redirect state
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
      //Making a copy of the data so that the actual response isn't being changed
      const users = data;
      //Finding the user thats logged 
     const  targetUser =  users.filter((user)=>{
        return user.login
      })
      //insantiating the postLoggedInUser variable as a httpRequest with the parameters needed to perform the post request 
      const postLoggedInUser = new httpRequest('http://localhost:5000/users', targetUser[0].username, img, targetUser[0].password, parseInt(counterValue.textContent) )
      //Calls the nftPostPurcasesRequest method with price, header, and the method type which in this case is buy, this is used to differentiate betwen buying and selling. 
      postLoggedInUser.nftPostPurchasesRequest(price, header, "buy")
    })




  


 

}
