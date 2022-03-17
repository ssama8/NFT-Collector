//container of all of the elements for the page used for event delegation
const portfolioSection = document.querySelector(".portfolio-container");

//used to change state
const gallery = document.querySelector(".portfolio-gallery");
const sellScreen = document.querySelector(".sell-screen");
const orderSummary = document.querySelector(".order-summary");

//variables that have to do with the counter
const decrementCounter = document.querySelector(".decrement");
const incrementCounter = document.querySelector(".increment");
const counterValue = document.querySelector(".quantity");

//show login landing page
const showloginSection = document.querySelector(".login");

const goBackBtn = document.getElementById("go-back");

//Variables declared that will be used to send the patch request when user sells a nft
let loggedInUser;
let purchasedNFTs;
let nameSoldNFT;
let priceToSell;
let maxSellNumber;

//array usd to calculate the portfolio worth
let assetValues = [];

//function called right away to add every purchased nft to the gallery
checkUserData();
async function checkUserData() {
	const getUser = new httpRequest("https://nft-collector.herokuapp.com/users");
	getUser.getRequest().then((data) => {
		const copy = data;
		copy.filter((user) => {
			if (user.login) {
				loggedInUser = user;
			}
		});
		//the user needs to be logged in so if not, display the landing page that prompts user to login
		if (loggedInUser === undefined) {
			portfolioSection.style.display = "none";
		} else {
			showloginSection.style.display = "none";

			/*sets the profile image on the top and the username of the logged in user*/
			const profilePic = document.querySelector(".profile");
			profilePic.src = loggedInUser.profilePic;
			const username = document.querySelector(".username");
			username.textContent = `#${loggedInUser.username}`;

			//all of the nfts purchased by the user
			purchasedNFTs = loggedInUser.purchasedItems;

			//make a nft card with the data for ecerynft purchased
			console.log(loggedInUser.purchasedItems);
			loggedInUser.purchasedItems.map((item) => {
				const div = document.createElement("div");
				const img = document.createElement("img");
				const header = document.createElement("h3");
				const description = document.createElement("h4");
				const number = document.createElement("h4");

				//adding classes for styling purposes
				img.classList.add("purchased-nfts");
				div.classList.add("gallery-image");
				header.classList.add("name");
				description.classList.add("price");
				number.classList.add("amount");

				//setting the content
				header.textContent = item.name;
				number.textContent = ` Quantity:  ${item.quantity}`;
				description.textContent = `Value:  ${item.price}`;
				img.src = item.url;

				const priceInt = parseFloat(item.price);
				const quantityInt = parseFloat(item.quantity);
				priceToSell = priceInt;
				//getting the total worth of each nft by multiplying the amount by the price
				const orderWorth = priceInt * quantityInt;

				//setting the content for the total value
				const totalValueText = `Total Value: ${+orderWorth.toFixed(2)} million`;
				const orderValue = document.createElement("h4");
				orderValue.textContent = totalValueText;

				//pushing the value of each nft to the assetValues array to calculate the portfolio worth
				assetValues.push(priceInt * quantityInt);

				//making the sell button
				const button = document.createElement("button");
				button.textContent = "Sell";
				button.classList.add("show-sell-screen");
				button.id = "show-sell-screen";

				div.classList.add("showcase");

				div.appendChild(header);
				div.appendChild(img);
				div.appendChild(button);
				div.appendChild(description);
				div.appendChild(number);
				div.appendChild(orderValue);

				//apppending every nft to the gallery
				gallery.appendChild(div);
			});
			//after all of the values are pushed into the assetValues array calculate the portfolio worth
			calculatePortfolioWorth();
		}
	});
}

function calculatePortfolioWorth() {
	const portfolioValue = document.querySelector(".net-worth");
	//if there are not nfts in the portfolio return
	if (assetValues.length === 0) return;
	//gets the value of all of the nfts
	let sum = assetValues.reduce((a, b) => {
		return a + b;
	});
	sum = +sum.toFixed(2);
	portfolioValue.textContent = `Net Worth On Paper: $${sum} million`;
}

goBackBtn.addEventListener("click", goBack);

function goBack() {
	sellScreen.style.display = "none";
}

//used to get the url of what every nft is being sold
let currentItem;

portfolioSection.addEventListener("click", sellItem);

function sellItem(e) {
	//using event delegation to fire when user clicks the sell button
	if (e.target.classList.contains("show-sell-screen")) {
		//puts the screen in the middle of the page
		positionsellScreen();

		sellScreen.style.display = "flex";
		//hiding the sell sScreen but keeping the child, orderSummary, visible because of a backgroung bug on the sellScreen
		sellScreen.style.visibility = "hidden";
		orderSummary.style.visibility = "visible";

		//variable from the js file linked before the portfolio controlling the counter
		counterValue.textContent = 0;

		//getting the elemetns that need to dynamically be updated
		const priceOfItem = document.querySelector(".price-description");
		const sellItem = document.querySelector(".item-to-sell");
		const nameOfItem = document.querySelector(".heading-nft");

		//gets the sibling elements of the button to display the nft on the sell screen
		const siblingElements = [...e.target.parentElement.childNodes];

		//getting the correct sibling element
		const name = siblingElements.filter((node) => {
			return node.classList.contains("name");
		});
		const img = siblingElements.filter((node) => {
			return node.classList.contains("purchased-nfts");
		});
		const price = siblingElements.filter((node) => {
			return node.classList.contains("price");
		});
		const quantity = siblingElements.filter((node) => {
			return node.classList.contains("amount");
		});
		const url = img[0].src;
		sellItem.src = url;

		//sets the currentItem to the url which will be used when nft is sold
		currentItem = url;
		//getting just the number from the text
		const priceNum = price[0].textContent.split(" ");
		const noSpaces = priceNum.filter((words) => {
			return words !== "";
		});
		const value = parseFloat(noSpaces[1]);
		priceOfItem.textContent = `The value of this NFT on paper is $${value} million`;

		//getting just the number from the text
		const quanityText = quantity[0].textContent.split(" ");
		const getWord = quanityText.filter((words) => {
			return words !== "";
		});
		//sets the max value of the counter, counter can't be greater than the the amount of amount
		const number = parseInt(getWord[1]);
		maxSellNumber = number;

		nameOfItem.textContent = name[0].textContent;

		//sets the nameSoldNFT to the header of the nft
		nameSoldNFT = nameOfItem.textContent;
	}
}
//sets the sell screen inthe middle of the page with a fixed position
function positionsellScreen() {
	const orderSummary = document.querySelector(".order-summary");
	const image = document.querySelector(".item-to-sell");
	image.style.height = `${window.innerHeight / 8}px`;
	orderSummary.style.position = "fixed";
	const sellScreenHeight = window.innerHeight / 2;
	sellScreen.style.top = `${sellScreenHeight}px`;
	orderSummary.style.height = `${sellScreenHeight}px`;
}

//adding event listeners to change the value of the counter
decrementCounter.addEventListener("click", subtractCounter);
incrementCounter.addEventListener("click", addCounter);

function subtractCounter() {
	const priceOfItem = document.querySelector(".price-description");
	const sellValue = document.querySelector(".sell-value");
	//the new value
	const value = parseInt(counterValue.textContent) - 1;
	//value can't bet negative
	if (value < 0) counterValue.textContent = 0;
	else counterValue.textContent = value;
	sellValue.textContent = `$${+(
		priceToSell * parseInt(counterValue.textContent)
	).toFixed(2)} million`;
}

function addCounter() {
	const priceOfItem = document.querySelector(".price-description");
	const sellValue = document.querySelector(".sell-value");
	//new value
	const value = parseInt(counterValue.textContent) + 1;
	//value can't be greater than the maxSellNumber
	if (value > maxSellNumber) counterValue.textContent = maxSellNumber;
	else counterValue.textContent = value;
	sellValue.textContent = `$${+(
		priceToSell * parseInt(counterValue.textContent)
	).toFixed(2)} million`;
}
//the receipt shows after the item is sold. m
const receipt = document.querySelector(".receipt");

portfolioSection.addEventListener("click", updatePortfolio);

function updatePortfolio(e) {
	//if the quantity is not zero than create a sale and send the request to server
	if (e.target.id === "update-portfolio" && counterValue.textContent !== "0") {
		//sgowing the receipt
		orderSummary.style.display = "none";
		receipt.style.display = "block";
		receipt.style.visibility = "visible";
		//positions the receipt
		positionScreen();

		const counterQuantity = parseInt(counterValue.textContent);
		//instantiating post purchases as a new http request
		const postPurchases = new httpRequest(
			"https://nft-collector.herokuapp.com/users",
			loggedInUser.username,
			currentItem,
			loggedInUser.password,
			maxSellNumber - counterQuantity
		);
		//sends request to server to update the quantity of the sold nft
		postPurchases.nftPostPurchasesRequest(priceToSell, nameSoldNFT, "sell");
	}
}
const reloadBtn = document.getElementById("reload-page");
const redirectHome = document.getElementById("redirect-home");

//reloads page
reloadBtn.addEventListener("click", () => {
	window.location.reload();
});
//redirects to home page
redirectHome.addEventListener("click", () => {
	window.location.href = "index.html";
});

function positionScreen() {
	receipt.style.position = "fixed";
	receipt.style.width = `${window.innerWidth / 2}px`;
	receipt.style.height = "min-content";
	receipt.style.top = `${window.innerHeight / 3}px`;
}
