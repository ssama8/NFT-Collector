const container = document.getElementById("container");

//navbar buttons
const signUpBtn = document.getElementById("sign-up");
const loginButton = document.getElementById("login-btn");
const profile = document.getElementById("profile");

//account settings dropdown
const accountSettings = document.querySelector(".settings-list");

container.addEventListener("click", updateChangeRequest);
container.addEventListener("click", showSettings);

//initially setting if a user is signed in to false
const accountState = {
	signedIn: false,
};
//getting the user logged in if there is one
let currentUser;

//function that gets the user thats logged in
async function getDetails() {
	const getDetails = new httpRequest(
		"https://nft-collector.herokuapp.com/users"
	);
	const findLogin = getDetails.getRequest().then((data) => {
		let copyData = [...data];
		let currentAccount = copyData.filter((user) => {
			return user.login;
		});

		return currentAccount;
	});

	return findLogin;
}

showLoginStatus();
//called on page load to check if there is a logged in user
function showLoginStatus() {
	getDetails()
		.then((user) => {
			//if there is a logged in user
			if (user.length !== 0) {
				//hide the menu buttons
				signUpBtn.style.display = "none";
				loginButton.style.display = "none";
				//show the profile image and set it to the users profile pic
				profile.style.display = "flex";
				const img = document.querySelectorAll(".profile-image");
				img.forEach((img) => {
					img.src = user[0].profilePic;
				});
				const usernameDisplay = document.querySelector(".current-username");
				const passwordDisplay = document.querySelector("#current-password");
				//populates the username and password of the account settings dropdown
				usernameDisplay.textContent = user[0].username;
				passwordDisplay.value = user[0].password;

				currentUser = user;

				//setting signedIn to true

				accountState.signedIn = true;
			}
			//if no logged in user then show the menu buttons and hide the profile image
			else {
				profile.style.display = "none";
				signUpBtn.style.display = "block";
				loginButton.style.display = "block";
				accountState.signedIn = false;
			}
		})
		.catch((err) => alert(err));
}

const accountNav = document.getElementById("account-details");
accountNav.style.display = "none";

container.addEventListener("click", showProfileSettings);

//toggles the sign out, account settings, and delete account dropdown
function showProfileSettings(e) {
	if (e.target.id === "profile-image-display") {
		("account-details");
		if (accountNav.style.display === "none") {
			accountNav.style.display = "flex";
		} else {
			accountNav.style.display = "none";
			accountSettings.style.display = "none";
			const accountButton = document.getElementById("account-settings");
			accountButton.classList.remove("visible");
		}
	}
}

container.addEventListener("click", signOut);
//signs out of account
function signOut(e) {
	if (e.target.id === "sign-out") {
		e.preventDefault();
		getDetails().then((user) => {
			const signOut = new httpRequest(
				"http://localhost:5000/users",
				user[0].username,
				null,
				user[0].password
			);
			//saying if the users logged in to false
			signOut.loginRequest(false);
			accountState.signedIn = false;
			currentUser = null;
			window.location.reload();
		});
	}
}
//toggles the account settings dropdown
function showSettings(e) {
	if (e.target.id === "account-settings") {
		if (e.target.classList.contains("visible")) {
			accountSettings.style.display = "none";
			e.target.classList.remove("visible");
		} else {
			accountSettings.style.display = "flex";
			e.target.classList.add("visible");
		}
	}
}

//sending the correct request to the server depending on what the user wants to change, the changeSettings page will get this request and display what the user wants to change
function updateChangeRequest(e) {
	if (e.target.classList.contains("change-request")) {
		e.preventDefault();

		const sendData = new httpRequest(
			"http://localhost:5000/users/change-request"
		);
		//sendProfileSettings takes in 4 arguments, 1 is the profile pic, 2 is the username, 3 is the password, 4 is to delete the account
		if (e.target.id === "change-profile-image") {
			//change profile image
			sendData.sendProfileSettings(true);
		} else if (e.target.id === "change-username") {
			//change the username
			sendData.sendProfileSettings(null, true);
		} else if (e.target.id === "delete-user") {
			//remove the account
			sendData.sendProfileSettings(null, null, null, true);
		} else {
			//change the password
			sendData.sendProfileSettings(null, null, true);
		}
		window.location.href = "changeAccountSettings.html";
	}
}
