import express from 'express';

const router = express.Router();

import users from './accounts.js'
import images from './image-gallery.js'
const placeOrder = "placeorder";
//import images from './image-gallery.js'

// router.get('/:imageurl',(req,res)=>{
//   res.send(1)
// } )
let nftToOrder = {
  url : "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-4.png",
  price: "2.3 ",
  name: "Bored Ape #2087",
} 
router.get('/', (req, res)=>{
  res.send(users);
})
router.get('/pics', (req, res)=>{
  res.send(images);
})


router.patch('/pics', (req, res)=>{
  const {src, name, price} = req.body;
  console.log(price);
  const object = {
    src:src,
name: name,
price: `${price}  `,
description: `Sold for ${price} million USD at the time of the transaction`
  }
  let filtered = users.filter((user=>{
    return user.login 
  }))
  console.log(filtered);
  filtered[0].images = [...filtered[0].images, object]


  res.send(`${name} was added to the gallery `);
})

  

router.get('/placeorder', (req, res)=>{
  res.send(nftToOrder);
})
const changeSetting = {
  profileImage: null,
  password: null,
  username: null,
  remove: null
}
router.get('/change-request', (req, res)=>{
  res.send(changeSetting)
})
router.patch('/change-request', (req, res)=>{
  const {profileImage, password, username, remove} = req.body;
  for(const key in changeSetting){
    changeSetting[key] = null;
  }
  console.log(remove)
  if(profileImage) changeSetting.profileImage = "change"
  else if (password) changeSetting.password = "change"
  else if(username)changeSetting.username = "change";
  else if(remove) changeSetting.remove = "change";
  else res.send("can't update profile state")

  res.send("updated")
})
router.get('/:username', (req, res)=>{
  const {username} = req.params;
  const findUser = users.find((user)=> user.username === username)
  // if(username === placeOrder) res.send(nftToOrder)
  if(!findUser) res.send("error 404 page not found")
  res.send(findUser)
})
router.patch('/:username', (req,res)=>{
  const {username} = req.params;
  const {url, newusername, newpassword } = req.body;
  const findUser = users.find((user)=> user.username === username)
  // if(username === placeOrder) res.send(nftToOrder)
  if(!findUser) res.send("error 404 page not found")
 // console.log(findUser);
  if(url){
    findUser.profilePic = url;

  }else if(newpassword){
    
    findUser.password = newpassword
  }else if (newusername){
    findUser.username = newusername

  }
  
  console.log(findUser.username);
  res.send(findUser.username)
})
router.delete('/:username', (req, res)=>{
  const {username} = req.params;
  const findUser = users.find((user)=> user.username === username)
  const index = users.indexOf(findUser)
  console.log(index)
  if(!findUser) res.send("error 404 page not found")
  users.splice(index, 1);
  
  
  res.send(`user ${findUser.username} has been deleted from the database`)
  


})
router.post('/placeorder', (req, res)=>{
   const {username, url} = req.body;
  nftToOrder.url  = url;
//console.log(images);
console.log(req.body)
    let filtered = users.filter((user)=>{
     return user.username === username
    })
    console.log(filtered)
  let targetNFT= filtered[0].images.filter((image)=>{
    return image.src === url;
  })
//  console.log(targetNFT);
  nftToOrder.price = targetNFT[0].price
  nftToOrder.name = targetNFT[0].name
  res.send(`User with the username of ${username} has decided to look at the nft with the url ${url}`);
  
})
// {
//   username: "ssama2",
//   password : "hidethisplease",
//   login: false,
//   profilePic: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-4.png",
//   purchasedItems :[{url: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-4.png",
//   price: "2.3 million",
//   quantity: 8,
//   name: "Bored Ape #2087"
  
// }

// ],
// images: imageCopy
// }
router.post('/', (req, res)=>{
  const newUser = req.body;
  const checkExisting = users.filter((user)=>{
    if(user.username === newUser.username){
      return user;
    }
  })
  newUser.purchasedItems = [];
  newUser.images = images;
   if(checkExisting.length === 0) users.push(newUser)
  res.send(`User with the user name of ${newUser.username} was added to the database`);
})

router.patch('/', (req, res)=>{
  const {username, password, login} = req.body;
  let loggedInUser = users.find((user)=> {
    if(user.username === username &&  user.password === password){
      return user;
    }

   
  });
  let index = users.indexOf(loggedInUser);
  users[index].login = login;

  
  if(req.body.purchasedItem!== undefined){
  
   const allPurchases = users[index].purchasedItems;
   allPurchases.map((purchase, index)=>{
     if(purchase.url === req.body.purchasedItem[0].url){
       if(req.body.type !== "sell"){
       req.body.purchasedItem[0].quantity =  req.body.purchasedItem[0].quantity + purchase.quantity
       }
       allPurchases.splice(index, 1);
       if(req.body.purchasedItem[0].quantity !==0){
        allPurchases.splice(index, 0, req.body.purchasedItem[0])
      }
     }
   })
  }
  
   res.send(`The user with the username ${username} is now logged in and just purchase  of the nfts with the url of ${req.body.purchasedItem}`)
 //  console.log(users[index]);

})

export default router;