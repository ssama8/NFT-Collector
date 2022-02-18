class httpRequest{
  constructor(url, username, img, password, quantity){
    this.url = url
    this.username = username
    this.imageSrc = img
    this.password = password
    this.quantity = quantity
  }

  async getRequest(){
    const getData = await fetch(this.url)
      .then(response => response.json())
      .then(data => data)

    return getData
  }
  async nftOrderPostRequest(){
    const rawResponse =  await fetch(this.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: this.username,  url : this.imageSrc})
  })
  return rawResponse;
  }
  async nftPostPurchasesRequest(price, header, type){
    const addToPortfolio = await fetch(this.url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: this.username, password: this.password, login : true, purchasedItem: [{url: this.imageSrc, price: `${price} million`, quantity: this.quantity, name: header}], type: type})
    })
    return addToPortfolio
  
}
async  loginRequest (status){
  const retrieveLogin = await fetch(this.url,
  {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: this.username, password: this.password, login: status})
  })
  return retrieveLogin;
}
async addNFT (url, name, price ){
  const addImage = await fetch(this.url,  {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({src: url,  name: name, price: price, description: `Sold for ${price} million USD at the time of the transaction `})
  })
}
async changeProfileSettings ( image, username, password ){
  const changeProfileSettings = await fetch(this.url,  {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url: image, newusername: username, newpassword: password})
  })
}
async sendProfileSettings ( image, username, password ){
  const changeProfileSettings = await fetch(this.url,  {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({profileImage: image, username: username, password: password})
  })
}

}

// async function checkInfo(status){
//   const retrieveLogin = await fetch('http://localhost:5000/users',
//   {
//     method: 'PATCH',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({username: username, password: password, login: status})
//   })
//   const get = await fetch('http://localhost:5000/users')
//   .then(data=> data.json())
//   .then(data=> console.log(data))
  
//   if(retrieveLogin.status === 500){
//     alert("One or both of the fields are incorrect");

//   }else{
//     loggedIn()
//   }
// }














  
    //   const rawResponse =  await fetch('http://localhost:5000/users/placeorder', {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({username: this.username,  password : this.imageSrc})
  // })
  // return rawResponse;
