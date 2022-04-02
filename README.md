# NFT-Collector
NFT-Collector app 
## Overview 
		NFT Collector is a fun, fullstack application that uses node and
		express on the backend and plain old javascript on the front end.
		You can create buy and sell different nfts and watch your net worth
		on paper skyrocket. It also has user authentication using a rest api
		that stores users as well as different default nfts the user can
		dynamically add to their portfolio. The api on the backend has has
		all of the CRUD functionalities as you can create, update and delete
	your account. You can also make a get request to get the users or
	nfts.
  
  ## Signing Up
  	There's a sign up page that has a form where you are required to make
					a username and password. The passwords both need to match and there
					needs to be atleast 6 characters in the username with atleast one
					number and 8 characters and at least one number in the password which
					is done through regular expressions. You can also toggle the
					visibility of the password as you please. Once you made a username and
					password, a list of profile pictures appear that you can pick from as
					your own profile picture. Don't worry if you change your mind later,
					you can always go back and change your username, password, and profile
					picture.
          
  ## Features
  		After you login you are now able to use all of the different
						features. When you buy nfts from the gallery, you can order 10 at a
						time. Once you select the wuantity yo uget redirected to a checkout
						screen where you can double click the image to screenshot it and add
						it to your portfolio. On your portfolio page, you can view all of
						your nfts and view the total worth of your portfolio on paper. This
						is all fun and games after all as screenshoting a ranodom image
						doesn't make you money if you're notfamous or have some sort of
						following. From the portfolio, you can sell the nfts back but you
						don't get any money becuase all of the value is on paper. Whats
						crazy about the default nfts though is that the rediculus prices
						like 1.91 million was actually the amount that someone paid for that
						specific nft and you get to have it in your portfolio for free.
            
            
            
  ## CUSTOM NFTs
  	You can also add a nft with a custom name, price, and image. The image
					must be the image address because of cors bugs that don't allow for a
					image url to be submitted. There is a check for this where if the
					image isn't valid then it shows the error. Once you submit the custom
					values you get a preview of what the NFT will look like. If you decide
					that it doesn't look the way you wanted. You can always go back and
					change your values
  
