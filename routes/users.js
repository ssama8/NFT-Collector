import express from "express";

//used to encrypt password
import bcrypt from "bcrypt";

const router = express.Router();

//array that will contain all of the users
let users = [];

//the array of default nfts
import images from "./image-gallery.js";

router.get("/", (req, res) => {
	res.send(users);
});

router.get("/pics", (req, res) => {
	res.send(images);
});

/*patch request to user/pics that adds the custom nft */
router.patch("/pics", (req, res) => {
	const { src, name, price } = req.body;
	//sets the new nfts keys
	const newNFT = {
		src: src,
		name: name,
		price: `${price}  `,
		description: `Sold for ${price} million USD at the time of the transaction`,
	};
	//gets the user logged in
	const filtered = users.filter((user) => {
		return user.login;
	});
	//destructures the users images currently stored and adds the newNFT
	filtered[0].images = [...filtered[0].images, newNFT];

	res.send(`${name} was added to the gallery `);
});

//indicates what the user wants to change
const changeSetting = {
	profileImage: null,
	password: null,
	username: null,
	remove: null,
};

router.get("/change-request", (req, res) => {
	res.send(changeSetting);
});

router.patch("/change-request", (req, res) => {
	const { profileImage, password, username, remove } = req.body;
	//resets all of the keys so that only one of the keys has the value of "change"
	for (const key in changeSetting) {
		changeSetting[key] = null;
	}

	if (profileImage) changeSetting.profileImage = "change";
	else if (password) changeSetting.password = "change";
	else if (username) changeSetting.username = "change";
	else if (remove) changeSetting.remove = "change";
	else res.send("can't update profile state");

	res.send("updated");
});

let nftToOrder = {
	url: null,
	price: null,
	name: null,
};

router.get("/placeorder", (req, res) => {
	res.send(nftToOrder);
});

router.post("/placeorder", (req, res) => {
	//request will contain a username and a url .

	const { username, url } = req.body;
	//gets the user
	let filtered = users.filter((user) => {
		return user.username === username;
	});
	//goes through the users images and finds the one that matches the url
	let targetNFT = filtered[0].images.filter((image) => {
		return image.src === url;
	});
	//sets the nftToOrder keys

	nftToOrder.url = url;
	nftToOrder.price = targetNFT[0].price;
	nftToOrder.name = targetNFT[0].name;
	res.send(
		`User with the username of ${username} has decided to look at the nft with the url ${url}`
	);
});

//post route that adds the user to the users array once they sign up
router.post("/", async (req, res) => {
	const newUser = req.body;
	//const newUser = {username: req.body.username};
	//encrypts the password so that if anybody gets access to the database they can't get people's passwords
	try {
		const hashedPassword = await bcrypt.hash(newUser.password, 10);
		newUser.password = hashedPassword;
	} catch {
		res.status(500);
	}

	//checking for an existing user
	const checkExisting = users.filter((user) => {
		if (user.username === newUser.username) {
			return user;
		}
	});
	newUser.purchasedItems = [];
	newUser.images = images;
	if (checkExisting.length === 0) {
		users.push(newUser);
		res.send(
			`User with the user name of ${newUser.username} was added to the database`
		);
	}
	//if there is an existing user
	else {
		res.send(
			`user can't be added because the username ${newUser} already exists`
		);
	}
});

//rote that deals with logging in and out and buying and selling nfts
router.patch("/", async (req, res) => {
	const { username, password, login } = req.body;

	const user = users.find((user) => user.username === username);
	const index = users.indexOf(user);
	if (!login) {
		user.login = login;
		res.send("user successfully logged out");
		return;
	}
	if (user === null) {
		res.status(400).send("username isn't correct");
	}
	try {
		//compare function, hash comes second
		if (
			(await bcrypt.compare(password, user.password)) ||
			(password === user.password && req.body.purchasedItem === undefined)
		) {
			//logs user in or out depending on what was sent in the request as login
			users[index].login = login;
			res.send(
				`The user with the username ${username}  just made a request to login or out`
			);
		} else if (req.body.purchasedItem === undefined) {
			res.status(500).send("password isn't correct ");
		}
	} catch {
		res.status(400).send("unable to login ");
	}

	//if the user bought or sold a nft this will run
	if (req.body.purchasedItem !== undefined) {
		const allPurchases = users[index].purchasedItems;
		let exists = false;

		allPurchases.map((purchase, index) => {
			//finding if there are any duplicates
			if (purchase.url === req.body.purchasedItem[0].url) {
				exists = true;
				/*if the user is buying the same nft make sure to add the quantities as one, so that there aren't 2 slots in the portfolio for the same nft*/
				if (req.body.type !== "sell") {
					req.body.purchasedItem[0].quantity =
						req.body.purchasedItem[0].quantity + purchase.quantity;
				}
				//get rid of where the old nft was
				allPurchases.splice(index, 1);
				if (req.body.purchasedItem[0].quantity !== 0) {
					//if there is atleast one nft insert the new nft in it's previous spot but with the updated quantity
					allPurchases.splice(index, 0, req.body.purchasedItem[0]);
				}
			}
		});
		//if the nft didn't exist already and is brand new to the portfolio then add it to the end of the allPurchases array
		if (req.body.type !== "sell" && !exists) {
			allPurchases.push(req.body.purchasedItem[0]);
		}
		res.send(`The user with the username ${username}  just purchased an nft `);
	}
});

//get request by the username, if the username isn't found send an error
router.get("/:username", (req, res) => {
	const { username } = req.params;
	const findUser = users.find((user) => user.username === username);
	if (!findUser) res.send("error 404 page not found");
	res.send(findUser);
});

//changes data about the user
router.patch("/:username", async (req, res) => {
	const { username } = req.params;
	const { url, newusername, newpassword } = req.body;
	const findUser = users.find((user) => user.username === username);
	if (!findUser) res.send("error 404 page not found");
	if (url) findUser.profilePic = url;
	//if the user wants to change their profile image
	else if (newpassword) findUser.password = await bcrypt.hash(newpassword, 10);
	//if the user wants to change their password
	else if (newusername) findUser.username = newusername; //if the user wants to change their username
	res.send(findUser.username);
});

//deletes the user
router.delete("/:username", (req, res) => {
	const { username } = req.params;
	const findUser = users.find((user) => user.username === username);
	const index = users.indexOf(findUser);
	if (!findUser) res.send("error 404 page not found");
	//removes the user from the database
	users.splice(index, 1);
	res.send(`user ${findUser.username} has been deleted from the database`);
});

export default router;
