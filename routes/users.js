import express from 'express';
const router = express.Router();
let nftToOrder = {
  url : "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-4.png",
  price: "2.3 ",
  name: "Bored Ape #2087",
} 
import users from './accounts.js'
// let users = [
//   {
//     username: "ssama2",
//     password : "hidethisplease",
//     login: false,
//     profilePic: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-4.png",
//     purchasedItems :[{url: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-4.png",
//     price: "2.3 million",
//     quantity: 8,
//     name: "Bored Ape #2087"
//   },

// ],
//   },
//   {
//     username: "geazy7",
//     password : "sleezyI",
//     login: false,
//     profilePic: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-8.png",
//     purchasedItems:    [   {
//   url: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-8.png",
//   price: "2.67 million",
//   quantity: 8,
//   name: "Bored Ape #2087"
// }]

//   }
// ]

import images from './image-gallery.js'

// router.get('/:imageurl',(req,res)=>{
//   res.send(1)
// } )
router.get('/', (req, res)=>{
  res.send(users);
})
router.get('/pics', (req, res)=>{
  res.send(images);
})
router.post('/pics', (req, res)=>{
  const {src, name, price} = req.body;
  images.push({
    src:src,
    name: name,
    price: `${price} `,
    description: `Sold for ${price} million USD at the time of the transaction`
   
  })

  res.send(`${name} was added to the gallery `);
})
router.get('/placeorder', (req, res)=>{
   
  res.send(nftToOrder);
})

router.post('/placeorder', (req, res)=>{
   const {username, url} = req.body;
  nftToOrder.url  = url;
//console.log(images);

  let targetNFT= images.filter((image)=>{
    return image.src === url;
  })
  console.log(targetNFT);
  nftToOrder.price = targetNFT[0].price
  nftToOrder.name = targetNFT[0].name
  res.send(`User with the username of ${username} has decided to look at the nft with the url ${url}`);
  
})

router.post('/', (req, res)=>{
  const newUser = req.body;
  const checkExisting = users.filter((user)=>{
    if(user.username === newUser.username){
      return user;
    }
  })


  console.log(checkExisting)

   if(checkExisting.length === 0) users.push(newUser)
  res.send(`User with the user name of ${newUser.username} was added to the database`);
 // res.send(JSON.parse(req.body));
})

router.patch('/', (req, res)=>{
  console.log(req.url)
  const {username, password, login} = req.body;
  //console.log(req.body)
  let loggedInUser = users.find((user)=> {
    if(user.username === username &&  user.password === password){
      return user;
    }

   
  });
  //console.log(users)
  //console.log(loggedInUser);
  let index = users.indexOf(loggedInUser);
  users[index].login = login;

 // console.log(index);
  //users[index].login = login;
  if(req.body.purchasedItem!== undefined){
  
   let allPurchases = users[index].purchasedItems;
   allPurchases.map((purchase, index)=>{
     if(purchase.url === req.body.purchasedItem[0].url){
       console.log('huhuhuhuhhuhu')
       if(req.body.type !== "sell"){

       req.body.purchasedItem[0].quantity =  req.body.purchasedItem[0].quantity + purchase.quantity
   
        
       }


       allPurchases.splice(index, 1);
      
     }

   })
   console.log(allPurchases);
    if(req.body.purchasedItem[0].quantity !==0){
     allPurchases.push(req.body.purchasedItem[0])

   }
   console.log(allPurchases);
  console.log(users[0].purchasedItems);   
    //users[index].purchasedItems.push(req.body.purchasedItem);
  }
  
   res.send(`The user with the username ${username} is now logged in and just purchase  of the nfts with the url of ${req.body.purchasedItem}`)
 //  console.log(users[index]);

})

export default router;