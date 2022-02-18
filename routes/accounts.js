import images from "./image-gallery.js";
let imageCopy = images;
let users = [
  {
    username: "ssama2",
    password : "hidethisplease",
    login: false,
    profilePic: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-4.png",
    purchasedItems :[{url: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-4.png",
    price: "2.3 million",
    quantity: 8,
    name: "Bored Ape #2087"
    
  }

],
  images: imageCopy
},
  {
    username: "geazy7",
    password : "sleezyI",
    login: true,
    profilePic: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-8.png",
    purchasedItems:    [   {
  url: "https://www.nftsstreet.com/wp-content/uploads/2021/11/unnamed-8.png",
  price: "2.67 million",
  quantity: 8,
  name: "Bored Ape #2087"
}],
images: imageCopy

  }
]

export default users;