
console.log(currentUser);
const users = new httpRequest("http://localhost:5000/users/pics")

//users.getRequest().then(data => console.log(data))
const signUpBtn = document.getElementById('sign-up')
const loginButton = document.getElementById('login-btn');
const profile = document.getElementById('profile');

console.log('running');
const display = document.getElementById('display-info')
const container = document.getElementById('container');

container.addEventListener("click", showProfileSettings)
container.addEventListener('click', signOut);
//container.addEventListener('click', updateProfile);
container.addEventListener('click', buyNFT);




 function getImages(){

  //const getImages = await fetch('http://localhost:5000/users/pics')
  //.then(data=> data.json())
users.getRequest()
  .then(data=> {
    console.log(data);
    data.map((user)=>{
      let parentDiv = document.createElement('div');
      parentDiv.classList.add("gallery-pic")
      let header = document.createElement('h3');
      let description = document.createElement('p');
      header.textContent = user.name;
      description.textContent = user.description;
      let button = document.createElement('button');
      button.textContent = "Buy Now";
      button.classList.add('buy-nft')
      let div = document.createElement('img');
      div.classList.add('showcase')
      parentDiv.appendChild(header);
      parentDiv.appendChild(div);
      parentDiv.appendChild(button);
       parentDiv.appendChild(description);


       let parent = document.querySelector('#gallery');
       div.src = user.src;
       parent.appendChild(parentDiv);
    })
    
  
  })
  .catch(err=> console.log(err));
  ;
}
getImages();







// async function sendURl(userName, image){
//   console.log(userName); console.log(image);
//   const rawResponse =  await fetch('http://localhost:5000/users/placeorder', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({username: userName,  url : image})
//   })


  
// // //getRequest();

//  }




function buyNFT(e){
  if(e.target.classList.contains("buy-nft")){
    console.log("buy this particular NFT")
    console.log(accountState.signedIn)
    if(!accountState.signedIn){
      console.log("can't buy item")
    //  console.log(e.target.parentElement.childNodes)
  
    }else{
      console.log(" buy item")
      console.log(currentUser);
      let siblingElements = [...e.target.parentElement.childNodes]
      let img = siblingElements.filter((node)=>{
        return node.classList.contains("showcase")
      })
    const url = img[0].src
    //console.log(img[0].src);
     // sendURl(currentUser[0].userName, url )
    const nftToOrder = new httpRequest("http://localhost:5000/users/placeorder", currentUser[0].userName, url )
    nftToOrder.nftOrderPostRequest();  

      // const get = fetch("http://localhost:5000/users/placeorder")
      // .then(data=> data.json())
      // .then(data => console.log(data));
       window.location.href = "http://localhost:5000/order.html"
    }
 
  }
}











// function validateUser(e){
//   e.preventDefault();

//   let valid = false
//   const firstName = firstNameField.value;
//   const lastName = lastNameField.value;
//   const age = ageField.value;
//   let details =  getDetails();
//   console.log(details);
//   details.then(data=> {
//     console.log(data);
//     data.map((user)=>{
//       if(user.firstName === firstName 
//         && user.lastName === lastName 
//         && user.age === parseInt(age) 
//         ){
//         valid =true;
//       }
//       console.log(firstName, lastName, age);
//     })
    
//     console.log(valid);
//     displayValidation(valid);

//   });
  

// }
// console.log("running");

// function displayValidation(valid){
//   let message;
//   if(valid){
//     message = "User Found Here's you're account"
//     createMessage(message);
//   }else{
//     message = "user not found"
//     createMessage(message);

//   }
// }

// function createMessage(message){
//   const area = document.createElement('div');
//   let text = document.createTextNode(message);
//   area.appendChild(text);
//   form.insertBefore(area, firstNameField)
//   setTimeout(removeMessage, 2000, area);

// }
// function removeMessage(area){
//   area.remove();
// }
