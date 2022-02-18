
console.log("test");
const portfolioSection = document.querySelector('.portfolio-container');
const gallery = document.querySelector('.portfolio-gallery');
const sellScreen = document.querySelector('.sell-screen');
portfolioSection.addEventListener('click', updatePortfolio)

const loginSection = document.querySelector('.login');
let loggedInUser;
let purchasedNFTs;
let nameSoldNFT; 
let priceToSell; 
let maxSellNumber;
let assetValues = [];


async function checkUserData(){
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
      portfolioSection.style.display = "none";
    }else{
      loginSection.style.display = "none"

    
    const profilePic = document.querySelector('.profile');
    profilePic.src = loggedInUser.profilePic;
    const username = document.querySelector('.username');


    username.textContent = `#${loggedInUser.username}`;
    purchasedNFTs = loggedInUser.purchasedItems;


    loggedInUser.purchasedItems.map((item)=>{
      const div = document.createElement("div");
      const img = document.createElement('img');
      const header = document.createElement('h3');
      const description = document.createElement('h4');
      const number = document.createElement('h4');

      img.classList.add('purchased-nfts')
      div.classList.add("gallery-image")
      header.classList.add('name');
      
      description.classList.add('price')
      number.classList.add('amount');
      header.textContent = item.name;
      nameSoldNFT = item.name
      number.textContent = `  ${item.quantity}`
      description.textContent = ` ${item.price}`;
      const priceInt = parseFloat(item.price)
      const quantityInt = parseFloat(item.quantity)
      img.src = item.url;
      priceToSell = priceInt;

      let orderWorth = priceInt * quantityInt
    
      orderWorth = `Total Value: ${+orderWorth.toFixed(2)} million`
      assetValues.push(priceInt * quantityInt)
      const orderValue = document.createElement('h4');
      const button = document.createElement('button');

      orderValue.textContent = orderWorth;
      button.textContent = "Sell";
      button.classList.add('sell-nft')
      button.classList.add('show-sell-screen')

      div.classList.add('showcase')
      div.appendChild(header);
      div.appendChild(img);
      div.appendChild(button);
      div.appendChild(description);
      div.appendChild(number);
      div.appendChild(orderValue);


      
      gallery.appendChild(div);
      calculatePortfolioWorth()

    })
  //addBuy();

  } 
}
  )

}
checkUserData();


function calculatePortfolioWorth(){
  const portfolioValue = document.querySelector('.net-worth');
  console.log(assetValues)
  let sum = assetValues.reduce((a,b)=>{
    return a +b;
  })
  sum = +sum.toFixed(2);
  portfolioValue.textContent = `Net Worth On Paper: $${sum} million`;

}
let currentItem;

// function addBuy(){
//   const div = document.createElement('div');
//   div.classList.add('add-to-portfolio')
//   const button = document.createElement('a');
//   button.textContent = "Buy More NFT's"
//   button.href = "http://localhost:5000/index.html"
//   div.appendChild(button);
//   gallery.appendChild(div);
// }


portfolioSection.addEventListener('click', sellItem)


function sellItem(e){
  if(e.target.classList.contains('show-sell-screen')){
    // portfolioSection.style.display = "none";
     sellScreen.style.display = "flex";
    counterValue.textContent = 0;
const priceOfItem = document.querySelector('.price-description');

    const sellItem = document.querySelector('.item-to-sell');
    const nameOfItem = document.querySelector('.heading-nft')
    let siblingElements = [...e.target.parentElement.childNodes]
    console.log(siblingElements)
    let name = siblingElements.filter((node)=>{
      return node.classList.contains('name');
    })
    let img = siblingElements.filter((node)=>{
      return node.classList.contains("purchased-nfts")
    })
    let price = siblingElements.filter((node)=>{
      return node.classList.contains("price")
    })
    let quantity = siblingElements.filter((node)=>{
      return node.classList.contains("amount")
    })
    const url = img[0].src
    currentItem = url;
    const value = parseFloat(price[0].textContent)
    const number = parseInt(quantity[0].textContent)
    maxSellNumber = number;
    console.log(number);
    console.log(quantity[0]);
    console.log(number);
    console.log(value);
    sellItem.src = url;
    priceOfItem.textContent = `The value of this NFT on paper is $${value} million`
    console.log(name.innerHTML);
    nameOfItem.textContent = name[0].textContent;
    console.log(decrementCounter);
    
    
  }
}



function  addEventListener(){
  decrementCounter.addEventListener('click', subtractCounter);
  incrementCounter.addEventListener('click',addCounter);


}

function subtractCounter(){
  const priceOfItem = document.querySelector('.price-description');
  const sellValue = document.querySelector('.sell-value')
  let value = parseInt(counterValue.textContent) -1
  if(value <= 0){
    counterValue.textContent = 0
  }
  else{
    counterValue.textContent = value;

  }
  console.log(priceOfItem);
  console.log(priceToSell);
  sellValue.textContent = `$${+(priceToSell * parseInt(counterValue.textContent)).toFixed(2)} million`;
}


function addCounter(){
  const priceOfItem = document.querySelector('.price-description');
  const sellValue = document.querySelector('.sell-value')
  let value = parseInt(counterValue.textContent) +1
  console.log(maxSellNumber);
  if(value >= maxSellNumber){
    counterValue.textContent = maxSellNumber
  }else{
    counterValue.textContent = value;

  }
  sellValue.textContent = `$${+(priceToSell * parseInt(counterValue.textContent)).toFixed(2)} million`;

}
addEventListener();
 
function updatePortfolio(e){
  if(e.target.id === 'update-portfolio' && counterValue.textContent!== '0'  ){
    let itemToSell;
    console.log('send patch request to server')
    console.log(loggedInUser);
    console.log(purchasedNFTs);
    console.log(currentItem)
    purchasedNFTs.filter((nft)=>{
      console.log(nft);
      if(nft.url === currentItem){
        itemToSell = nft.url
      }
    })
    const counterQuantity = parseInt(counterValue.textContent)
    console.log(itemToSell);
    console.log(nameSoldNFT);
    console.log(priceToSell);
const postPurchases = new httpRequest("http://localhost:5000/users", loggedInUser.username, itemToSell, loggedInUser.password,maxSellNumber -  counterQuantity  )
postPurchases.nftPostPurchasesRequest(priceToSell, nameSoldNFT, "sell")

  //  postPurchases(loggedInUser.username, loggedInUser.password, itemToSell, priceToSell,  maxSellNumber - parseInt(counterValue.textContent) , nameSoldNFT )
    // fetch("http://localhost:5000/users")
    // .then(data=> data.json())
    // .then(data=> console.log(data));
    window.location.reload();
  }
}




// async function postPurchases(username, password, link, price,  quantity, header){
//   const addToPortfolio = await fetch('http://localhost:5000/users', {
//     method: 'PATCH',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({username: username, password: password, login : true, purchasedItem: [{url: link, price: `${price} million`, quantity: quantity, name: header}], type: "sell"})
//   })
// } 