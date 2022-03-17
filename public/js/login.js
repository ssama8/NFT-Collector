//Creating variables for the inputs
const usernameInput = document.getElementById("username-login");
const passwordInput = document.getElementById("password-login");

//the login button
const loginButton = document.getElementById("login");

//The form used as the parent for the insertBefore method
const signinForm = document.querySelector(".login-form");

//Adding event listener to the login button
loginButton.addEventListener("click", loginToAccount);

function loginToAccount(e) {
	e.preventDefault();
	//The input values
	const username = usernameInput.value;
	const password = passwordInput.value;
	if (username === "" || password === "") {
		//if either inputs value is equal to an empty string then make an alert to fill in all of the fields
		createErrorMessage("Please fill out all fields");
	} else {
		//Instantiating loginSite as a new httpRequest with null being image source because there is no url involved in the request
		const loginSite = new httpRequest(
			"https://nft-collector.herokuapp.com/users",
			username,
			null,
			password
		);
		const check = loginSite.loginRequest(true).then((resp) => {
			if (resp.status === 200)
				setTimeout((window.location.href = "index.html"), 250);
			else createErrorMessage("username or password is not correct");
		});
		//Calling the makeGetRequest function with the httpRequest object, username and password. This will return the account that matches the username and password inputted
		// const checkExists = makeGetRequest(loginSite, username, password);
		//checkExists
		// .then(user=>{
		//   //If there is no user that matches than create error message with the following text
		//   if(user.length === 0) {
		//     createErrorMessage("Username or Password is not correct ")
		//   }else{
		//     //If there is a user set the login status to true
		//     loginSite.loginRequest(true);
		//     //Redirect to home page
		//    window.location.href = "index.html"

		//   }
		// })
	}
}
//Makes the get request to the server
async function makeGetRequest(loginSite, username, password) {
	const checkUserExists = await loginSite
		.getRequest()
		.then((data) => {
			const users = data;
			//filtering through users to see if one has the same username and password
			const filtered = users.filter((user) => {
				return user.username === username && user.password === password;
			});
			//Returns the filtered array
			return filtered;
		})
		//Will create errorMessage with the error if getrequest can't be made
		.catch((err) => {
			createErrorMessage(err);
		});
	//return checKUserExists which is a promise
	return checkUserExists;
}

//Creates the error message at the top of the form
function createErrorMessage(mesg) {
	//The class alert message is dynamically added to the div holding the message, previousMessage is used to check if there already is an alert message
	const previousMessage = document.querySelector(".alert-message");
	//Used to insert before
	const usernameLabel = document.getElementById("username-label");
	//If there already is an alert message than return to avoid multiple messages on the screen
	if (previousMessage !== null) return;

	const div = document.createElement("div");
	const message = document.createTextNode(mesg);
	//Adding the alert-message class
	div.classList.add("alert-message");
	div.appendChild(message);
	//inserting the div before the usernameLabel
	signinForm.insertBefore(div, usernameLabel);
	//Removes the errorMessage after 2 seconds
	setTimeout(removeErrorMessage, 2000, div);
}

function removeErrorMessage(div) {
	div.remove();
}
